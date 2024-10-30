import { EventRecord } from "@polkadot/types/interfaces"
import { SubstrateExtrinsic, SubstrateBlock } from "@subql/types";
import { blockHandler } from "../handlers";
import { Event, Extrinsic, EventDescription, ExtrinsicDescription, SpecVersion, Block } from "../types";
import { checkIfExtrinsicExecuteSuccess, getFees, roundPrice, shouldGetFees } from "../utils/extrinsic";
import { wrapExtrinsics } from "../utils";


let specVersion: SpecVersion;
export async function handleBlock(block: SubstrateBlock): Promise<void> {
    const blockNumber = block.block.header.number.toNumber()
    if (blockNumber % 100 === 0) logger.info("Handling block with specversion " + block.specVersion)
    const dbBlock = await Block.get(blockNumber.toString())
    if (!dbBlock) {
        await blockHandler(block, specVersion)
        const wrappedExtrinsics = wrapExtrinsics(block)
        const calls = wrappedExtrinsics.map((ext, idx) => handleCall(`${blockNumber.toString()}-${idx}`, ext));
        const events = block.events.map((evt, idx) => {
            const relatedExtrinsicIndex = evt.phase.isApplyExtrinsic ? evt.phase.asApplyExtrinsic.toNumber() : -1
            return handleEvent(blockNumber.toString(), idx, evt, relatedExtrinsicIndex)
        });
        await Promise.all([
            store.bulkCreate('Event', await Promise.all(events)),
            store.bulkCreate('Extrinsic', await Promise.all(calls))
        ]);
    }
}

export async function handleCall(idx: string, extrinsic: SubstrateExtrinsic): Promise<Extrinsic> {
    try {
        const block = extrinsic.block
        const ext = extrinsic.extrinsic
        const methodData = ext.method
        const documentation = ext.meta.docs ? ext.meta.docs : JSON.parse(JSON.stringify(ext.meta)).documentation
        const blockId = block.block.header.number.toString()
        const txHash = ext.hash.toString();
        const call = methodData.method
        const blockHeight = block.block.header.number.toBigInt();
        const success = checkIfExtrinsicExecuteSuccess(extrinsic);
        const isSigned = ext.isSigned
        const extrinsicIndex = extrinsic.idx
        const hash = ext.hash.toString()
        const timestamp = block.timestamp
        const signer = ext.signer.toString()
        const signature = ext.signature.toString()
        const nonce = ext.nonce.toNumber()
        const argsName = methodData.meta.args.map(a => a.name.toString())
        const argsValue = methodData.args.map((a) => a.toString())
        const nbEvents = extrinsic.events.length
        
        let descriptionRecord = await ExtrinsicDescription.get(`${methodData.section}_${methodData.method}`)
        if (!descriptionRecord) {
            const call = methodData.method
            const description = JSON.stringify(documentation.map(d => d.toString()).join('\n'))
            descriptionRecord = new ExtrinsicDescription(`${methodData.section}_${methodData.method}`, methodData.section, call, description)
            await descriptionRecord.save()
            logger.info('new extrinsic description recorded')
        }
        const descriptionId = descriptionRecord.id

        const extrinsicRecord = new Extrinsic(idx, blockId, txHash, methodData.section, call, blockHeight, success, isSigned, extrinsicIndex, hash, timestamp, descriptionId, signer, signature, nonce, argsName, argsValue, nbEvents);
        extrinsicRecord.fees = shouldGetFees(extrinsicRecord.module) ? await getFees(ext.toHex(), block.block.header.hash.toHex()) : ""
        extrinsicRecord.feesRounded = roundPrice(extrinsicRecord.fees)
        return extrinsicRecord
    } catch (err) {
        logger.error(`record extrinsic error at : hash(${extrinsic.extrinsic.hash}) and block nb ${extrinsic.block.block.header.number.toNumber()}`);
        logger.error('record extrinsic error detail:' + err);
        if (err.sql) logger.error('record extrinsic error sql detail:' + err.sql);
    }
}

export async function handleEvent(blockNumber: string, eventIdx: number, event: EventRecord, extrinsicId: number): Promise<Event> {
    try {
        const eventData = event.event
        const documentation = eventData.meta.docs ? eventData.meta.docs : JSON.parse(JSON.stringify(eventData.meta)).documentation
        const blockId = blockNumber.toString()
        const blockHeight = BigInt(blockNumber);
        const call = eventData.method
        const argsName = eventData.meta.args.map(a => a.toString())
        const argsValue = eventData.data.map(a => JSON.stringify(a).indexOf('u0000') === -1 ?
            a.toString()
            :
            JSON.stringify(a).split("u0000").join('')
                .split("\\").join('')
                .split("\"").join('')
        )

        let descriptionRecord = await EventDescription.get(`${eventData.section}_${eventData.method}`)
        if (!descriptionRecord) {
            const call = eventData.method
            const description = JSON.stringify(documentation.map(d => d.toString()).join('\n'))
            descriptionRecord = new EventDescription(`${eventData.section}_${eventData.method}`, eventData.section, call, description)
            await descriptionRecord.save()
            logger.info('new event description recorded')
        }
        const descriptionId = descriptionRecord.id

        const newEvent = new Event(`${blockNumber}-${eventIdx}`, blockId, eventData.section, eventData.method, blockHeight, eventIdx, call, descriptionId, argsName, argsValue);
        if (extrinsicId !== -1) newEvent.extrinsicId = `${blockNumber}-${extrinsicId}`
        return newEvent;
    } catch (err) {
        logger.error('record event error at block number:' + blockNumber.toString());
        logger.error('record event error detail:' + err);
    }
}