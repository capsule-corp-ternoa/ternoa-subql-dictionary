import { SubstrateBlock } from "@subql/types";
import { Block, Session, SpecVersion} from "../types";

export const blockHandler = async (block: SubstrateBlock): Promise<void> => {
    try{
        const specVersion = await SpecVersion.get(block.specVersion.toString());
        if(specVersion === undefined){
            const newSpecVersion = new SpecVersion(block.specVersion.toString());
            newSpecVersion.blockHeight = block.block.header.number.toBigInt();
            await newSpecVersion.save();
        }
        const blockHeader = block.block.header
        const blockExtrinsics = block.block.extrinsics
        //const logs = block.block.header.digest.logs
        //const digestItem = logs.find(({ type }) => type === 'Seal');
        if (blockHeader.number.toString().length>2 && blockHeader.number.toString().slice(-2) == "01"){
            logger.info(`Time ${blockHeader.number.toString()}: ${new Date()}`);
        }
        const blockRecord = new Block(blockHeader.number.toString())
        blockRecord.number = blockHeader.number.toNumber()
        blockRecord.hash = blockHeader.hash.toString()
        blockRecord.timestamp = block.timestamp
        //logger.info("block num " + block.block.header.number.toString())
        // logger.info("block timestamp " + block.timestamp)
        // logger.info("date now" + Date.now())
        // logger.info("diff : " + (+Date.now() - +block.timestamp))
        blockRecord.parentHash = blockHeader.parentHash.toString()
        blockRecord.stateRoot = blockHeader.stateRoot.toString()
        blockRecord.extrinsicsRoot = blockHeader.extrinsicsRoot.toString()
        blockRecord.nbExtrinsics = blockExtrinsics.length
        blockRecord.runtimeVersion = block.specVersion
        /*if (digestItem){
            const disabledValidators = await api.query.session.disabledValidators()
            logger.info("seal " + digestItem.asSeal[1].toHex())
            logger.info("logs " + JSON.stringify(logs))
            const validatorIndex = BigInt(digestItem.asSeal[1].toHex())
            const currentValidators = (!newSession && typeof sessionRecord.validators==="string") ? (sessionRecord.validators as string).replace(/\{|\}|"/gi, '').split(',') : sessionRecord.validators
            const validatorLength = currentValidators.length
            const validatorLengthBN = BigInt(currentValidators.length)
            logger.info("blocknum " + blockHeader.number.toString())
            logger.info("validatorIndex " + parseInt(digestItem.asSeal[1].toString(), 16))
            logger.info("validator length " + validatorLength)
            logger.info("validatorIndex modulo " + validatorIndex % BigInt(validatorLength))
            logger.info("validator address " + currentValidators[Number(validatorIndex % validatorLengthBN)])
            logger.info("validators " + currentValidators)
            blockRecord.author = (validatorLength ?
                currentValidators[Number(validatorIndex % validatorLengthBN)].toString()
            : 
                undefined
            );
        }*/
        await updateBlockSessionId(blockRecord)
        await blockRecord.save()
    }catch(err){
        logger.error('record block error:' + block.block.header.number.toNumber());
        logger.error('record block error detail:' + err);
    }
  }

  export const updateBlockSessionId = async (blockRecord: Block) => {
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