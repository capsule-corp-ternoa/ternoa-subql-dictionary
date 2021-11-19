export const getFees = async (extObjectHash: string, blockHash: string) => {
    try{
        const fees = await api.rpc.payment.queryFeeDetails(extObjectHash, blockHash)
        if (fees){
            const feesFormatted = JSON.parse(JSON.stringify(fees))
            if (feesFormatted.inclusionFee){
                let totalFees = BigInt(0)
                if(feesFormatted.inclusionFee.basefee) totalFees += BigInt(feesFormatted.inclusionFee.basefee)
                if(feesFormatted.inclusionFee.lenfee) totalFees += BigInt(feesFormatted.inclusionFee.lenfee)
                if(feesFormatted.inclusionFee.adjustedWeightFee) totalFees += BigInt(feesFormatted.inclusionFee.adjustedWeightFee)
                return totalFees.toString()
            }
        }
        return ""
    }catch(err){
        logger.error(`get extrinsic fee error`);
        logger.error('get extrinsic fee error detail:' + err);
    }
}