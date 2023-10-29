import { Spec, LiveTable, Property, Event, BigInt, BigFloat, Address, Timestamp } from '@spec.dev/core'
import { OnCoreEvent } from '../shared/decorators.ts'
import Position from '../Position/spec.ts'

/**
 * All vaults on Synthetix V3.
 */
@Spec({
    uniqueBy: ['poolId', 'collateralType', 'chainId']
})
class Vault extends LiveTable {

    @Property()
    poolId: BigInt

    @Property()
    collateralType: Address

    @Property()
    collateralAmount: BigFloat

    @Property({ canUpdate: false })
    createdAt: Timestamp

    // ==== Event Handlers ===================
    
    @OnCoreEvent('DelegationUpdated')
    async onDelegationUpdated(event: Event) {
        this.poolId = BigInt.from(event.data.poolId)
        this.collateralType = event.data.collateralType
        await this.load()
        
        const delta = await this._getAmountDelta(event)
        this.collateralAmount = this.collateralAmount.plus(delta)
        this.createdAt = this.blockTimestamp
    }

    // ==== Helpers ==========================

    async _getAmountDelta(event: Event) {
        const { accountId, amount } = event.data
        const position = await this.findOne(Position, {
            accountId,
            poolId: this.poolId,
            collateralType: this.collateralType,
        })
        return position ? position.collateralAmount.minus(amount) : 0
    }
}

export default Vault