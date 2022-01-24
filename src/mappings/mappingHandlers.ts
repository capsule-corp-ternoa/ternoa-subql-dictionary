import { EventRecord } from "@polkadot/types/interfaces"
import { SubstrateExtrinsic, SubstrateBlock } from "@subql/types";
import { blockHandler } from "../handlers";
import { Event,Extrinsic, EventDescription, ExtrinsicDescription, SpecVersion, Block } from "../types";
import { checkIfExtrinsicExecuteSuccess, getFees, shouldGetFees } from "../utils/extrinsic";
import { wrapExtrinsics } from "../utils";


let specVersion: SpecVersion;
export async function handleBlock(block: SubstrateBlock): Promise<void> {
    if (block.block.header.number.toNumber() % 100 === 0) logger.info("Handling block with specversion " + block.specVersion)
    const dbBlock = await Block.get(block.block.header.number.toString())
    if (!dbBlock){
        await blockHandler(block, specVersion)
        const events = block.events.filter(evt => evt.event.section!=='system' && evt.event.method!=='ExtrinsicSuccess').map(async (evt, idx)=> await handleEvent(block.block.header.number.toString(), idx, evt));
        const calls = wrapExtrinsics(block).map((ext,idx)=>handleCall(`${block.block.header.number.toString()}-${idx}`,ext));
        await Promise.all([
            store.bulkCreate('Event', await Promise.all(events)),
            store.bulkCreate('Extrinsic', await Promise.all(calls))
        ]);
    }
}

export async function handleCall(idx: string, extrinsic: SubstrateExtrinsic): Promise<Extrinsic> {
    try{
        const block = extrinsic.block
        const ext = extrinsic.extrinsic
        const methodData = ext.method
        const documentation = ext.meta.docs ? ext.meta.docs : JSON.parse(JSON.stringify(ext.meta)).documentation
        const extrinsicRecord = new Extrinsic(idx);;
        extrinsicRecord.blockId = block.block.header.number.toString()
        extrinsicRecord.blockHeight = block.block.header.number.toBigInt();
        extrinsicRecord.extrinsicIndex = extrinsic.idx
        extrinsicRecord.hash = ext.hash.toString()
        extrinsicRecord.txHash = ext.hash.toString();
        extrinsicRecord.timestamp = block.timestamp
        extrinsicRecord.module = methodData.section
        extrinsicRecord.call = methodData.method
        extrinsicRecord.signer = ext.signer.toString()
        extrinsicRecord.isSigned = ext.isSigned
        extrinsicRecord.signature = ext.signature.toString()
        extrinsicRecord.nonce = ext.nonce.toNumber()
        extrinsicRecord.success = checkIfExtrinsicExecuteSuccess(extrinsic);
        extrinsicRecord.argsName = methodData.meta.args.map(a => a.name.toString())
        extrinsicRecord.argsValue = methodData.args.map((a) => a.toString())
        extrinsicRecord.nbEvents = extrinsic.events.length
        extrinsicRecord.eventIndexes = extrinsic.events.map((_x,i) => `${block.block.header.number.toString()}-${i}`)
        extrinsicRecord.fees = shouldGetFees(extrinsicRecord.module) ? await getFees(ext.toHex(), block.block.header.hash.toHex()) : ""
        let descriptionRecord = await ExtrinsicDescription.get(`${methodData.section}_${methodData.method}`)
        if (!descriptionRecord){
            descriptionRecord = new ExtrinsicDescription(`${methodData.section}_${methodData.method}`)
            descriptionRecord.module = methodData.section
            descriptionRecord.call = methodData.method
            descriptionRecord.description = JSON.stringify(documentation.map(d => d.toString()).join('\n'))
            await descriptionRecord.save()
            logger.info('new extrinsic description recorded')
        }
        extrinsicRecord.descriptionId = descriptionRecord.id
        return extrinsicRecord
    }catch(err){
        logger.error(`record extrinsic error at : hash(${extrinsic.extrinsic.hash}) and block nb ${extrinsic.block.block.header.number.toNumber()}`);
        logger.error('record extrinsic error detail:' + err);
        if (err.sql) logger.error('record extrinsic error sql detail:' + err.sql);
    }
}

export async function handleEvent(blockNumber: string, eventIdx: number, event: EventRecord): Promise<Event> {
    try{
        const eventData = event.event
        const documentation = eventData.meta.docs ? eventData.meta.docs : JSON.parse(JSON.stringify(eventData.meta)).documentation
        const newEvent = new Event(`${blockNumber}-${eventIdx}`);
        newEvent.blockId = blockNumber.toString()
        newEvent.blockHeight = BigInt(blockNumber);
        newEvent.eventIndex = eventIdx
        newEvent.event = eventData.method;
        newEvent.module = eventData.section
        newEvent.call = eventData.method
        newEvent.argsName = eventData.meta.args.map(a => a.toString())
        newEvent.argsValue = eventData.data.map(a => JSON.stringify(a).indexOf('u0000') === -1 ? 
            a.toString()
        : 
            JSON.stringify(a).split("u0000").join('')
                .split("\\").join('')
                .split("\"").join('')
        )
        let descriptionRecord = await EventDescription.get(`${eventData.section}_${eventData.method}`)
        if (!descriptionRecord){
            descriptionRecord = new EventDescription(`${eventData.section}_${eventData.method}`)
            descriptionRecord.module = eventData.section
            descriptionRecord.call = eventData.method
            descriptionRecord.description = JSON.stringify(documentation.map(d => d.toString()).join('\n'))
            await descriptionRecord.save()
            logger.info('new event description recorded')
        }
        newEvent.descriptionId = descriptionRecord.id
        return newEvent;
    }catch(err){
        logger.error('record event error at block number:' + blockNumber.toString());
        logger.error('record event error detail:' + err);
    }
}