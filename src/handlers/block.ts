import { SubstrateBlock } from "@subql/types";
import { Block, Session, SpecVersion} from "../types";

export const blockHandler = async (block: SubstrateBlock, specVersion: SpecVersion): Promise<void> => {
    try{
        const blockHeader = block.block.header
        const blockExtrinsics = block.block.extrinsics
        if (block.block.header.number.toNumber() % 100 === 0) logger.info(`Time ${blockHeader.number.toString()}: ${new Date()}`);
        const blockRecord = new Block(blockHeader.number.toString())
        blockRecord.number = blockHeader.number.toNumber()
        blockRecord.hash = blockHeader.hash.toString()
        blockRecord.timestamp = block.timestamp
        blockRecord.parentHash = blockHeader.parentHash.toString()
        blockRecord.stateRoot = blockHeader.stateRoot.toString()
        blockRecord.extrinsicsRoot = blockHeader.extrinsicsRoot.toString()
        blockRecord.nbExtrinsics = blockExtrinsics.length
        blockRecord.runtimeVersion = block.specVersion
        await updateSession(blockRecord)
        await updateSpecversion(specVersion, block.specVersion, blockHeader.number.toBigInt())
        await blockRecord.save()
    }catch(err){
        logger.error('record block error:' + block.block.header.number.toNumber());
        logger.error('record block error detail:' + err);
    }
}

export const updateSession = async (blockRecord: Block) => {
    try{
        const sessionId = await api.query.session.currentIndex()
        let sessionRecord = await Session.get(sessionId.toString())
        if (!sessionRecord){
            sessionRecord = new Session(sessionId.toString())
            const validators = await api.query.session.validators()
            sessionRecord.validators = validators.map(x => x.toString())
            await sessionRecord.save()
        }
        blockRecord.sessionId = Number(sessionRecord.id)
    }catch(err){
        logger.error('update session error');
        logger.error('update session error detail:' + err);
    }
}

export const updateSpecversion = async (specVersion: SpecVersion, blockSpecVersion: number, blockNumber: bigint) => {
    if (!specVersion) {
        specVersion = await SpecVersion.get(blockSpecVersion.toString());
    }
    if(!specVersion || specVersion.id !== blockSpecVersion.toString()){
        specVersion = new SpecVersion(blockSpecVersion.toString());
        specVersion.blockHeight = blockNumber;
        await specVersion.save();
    }
}
