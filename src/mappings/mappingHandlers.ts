import {SubstrateExtrinsic,SubstrateEvent,SubstrateBlock} from "@subql/types";
import { blockHandler } from "../handlers";
import {SpecVersion,Event,Extrinsic, EventDescription, ExtrinsicDescription} from "../types";
import { checkIfExtrinsicExecuteSuccess, getFees } from "../utils/extrinsic";


export async function handleBlock(block: SubstrateBlock): Promise<void> {
    const specVersion = await SpecVersion.get(block.specVersion.toString());
    if(specVersion === undefined){
        const newSpecVersion = new SpecVersion(block.specVersion.toString());
        newSpecVersion.blockHeight = block.block.header.number.toBigInt();
        await newSpecVersion.save();
    }
    await blockHandler(block)
}

export async function handleCall(extrinsic: SubstrateExtrinsic): Promise<void> {
    try{
        const block = extrinsic.block
        const thisExtrinsic = await Extrinsic.get(`${block.block.header.number.toString()}-${extrinsic.idx}`);
        if(thisExtrinsic === undefined){
            const ext = extrinsic.extrinsic
            const methodData = ext.method
            const documentation = ext.meta.docs ? ext.meta.docs : JSON.parse(JSON.stringify(ext.meta)).documentation
            const extrinsicRecord = new Extrinsic(`${block.block.header.number.toString()}-${extrinsic.idx}`);
            extrinsicRecord.blockId = block.block.header.number.toString()
            extrinsicRecord.blockHeight = block.block.header.number.toBigInt();
            extrinsicRecord.extrinsicIndex = extrinsic.idx
            extrinsicRecord.hash = ext.hash.toString()
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
            extrinsicRecord.fees = await getFees(ext.toHex(), block.block.header.hash.toHex())
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
            await extrinsicRecord.save();
        }
    }catch(err){
        logger.error(`record extrinsic error at : hash(${extrinsic.extrinsic.hash}) and block nb ${extrinsic.block.block.header.number.toNumber()}`);
        logger.error('record extrinsic error detail:' + err);
        if (err.sql) logger.error('record extrinsic error sql detail:' + err.sql);
    }
}

export async function handleEvent(event: SubstrateEvent): Promise<void> {
    try{
        const thisEvent = await Event.get(`${event.block.block.header.number}-${event.idx.toString()}`);
        if(thisEvent === undefined){
            const blockHeader = event.block.block.header
            const blockNumber = blockHeader.number.toNumber()
            const eventData = event.event
            const documentation = eventData.meta.docs ? eventData.meta.docs : JSON.parse(JSON.stringify(eventData.meta)).documentation
            const newEvent = new Event(`${blockNumber}-${event.idx}`);
            newEvent.blockId = blockNumber.toString()
            if (event.extrinsic) newEvent.extrinsicId = `${blockNumber}-${event.extrinsic.idx}`
            newEvent.blockHeight = event.block.block.header.number.toBigInt();
            newEvent.eventIndex = event.idx
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
            await newEvent.save()
        }
    }catch(err){
        logger.error('record event error at block number:' + event.block.block.header.number.toNumber());
        logger.error('record event error detail:' + err);
    }
}



