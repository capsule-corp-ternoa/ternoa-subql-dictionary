import { SubstrateBlock } from "@subql/types";
import { Block, Session, SpecVersion } from "../types";

export const blockHandler = async (block: SubstrateBlock, specVersion: SpecVersion): Promise<void> => {
    try {
        const blockHeader = block.block.header
        const blockExtrinsics = block.block.extrinsics
        if (block.block.header.number.toNumber() % 100 === 0) logger.info(`Time ${blockHeader.number.toString()}: ${new Date()}`);
        const number = blockHeader.number.toNumber()
        const hash = blockHeader.hash.toString()
        const timestamp = block.timestamp
        const parentHash = blockHeader.parentHash.toString()
        const stateRoot = blockHeader.stateRoot.toString()
        const extrinsicsRoot = blockHeader.extrinsicsRoot.toString()
        const runtimeVersion = block.specVersion
        const nbExtrinsics = blockExtrinsics.length
        const blockRecord = new Block(blockHeader.number.toString(), number, hash, timestamp, parentHash, stateRoot, extrinsicsRoot, runtimeVersion, nbExtrinsics)
        await updateSession(blockRecord)
        await updateSpecversion(specVersion, runtimeVersion, blockHeader.number.toBigInt())
        await blockRecord.save()
    } catch (err) {
        logger.error('record block error:' + block.block.header.number.toNumber());
        logger.error('record block error detail:' + err);
    }
}

export const updateSession = async (blockRecord: Block) => {
    try {
        const sessionId = await api.query.session.currentIndex()
        let sessionRecord = await Session.get(sessionId.toString())
        if (!sessionRecord) {
            const validators = (await api.query.session.validators()) as unknown as string[]
            const formatedValidators = validators.map(x => x.toString())
            sessionRecord = new Session(sessionId.toString(), formatedValidators)
            await sessionRecord.save()
        }
        blockRecord.sessionId = Number(sessionRecord.id)
    } catch (err) {
        logger.error('update session error');
        logger.error('update session error detail:' + err);
    }
}

export const updateSpecversion = async (specVersion: SpecVersion, blockSpecVersion: number, blockHeight: bigint) => {
    if (!specVersion) {
        specVersion = await SpecVersion.get(blockSpecVersion.toString());
    }
    if (!specVersion || specVersion.id !== blockSpecVersion.toString()) {
        specVersion = new SpecVersion(blockSpecVersion.toString(), blockHeight);
        await specVersion.save();
    }
}
