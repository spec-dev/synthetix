import { Spec, LiveTable, Property, Event, BigInt, BigFloat, Timestamp, Address, BeforeAll } from '@spec.dev/core'
import { OnCoreEvent } from '../shared/decorators.ts'

/**
 * All positions on Synthetix V3.
 */
@Spec({ 
    uniqueBy: ['accountId', 'poolId', 'collateralType', 'chainId'] 
})
class Position extends LiveTable {

    @Property()
    accountId: BigInt

    @Property()
    poolId: BigInt

    @Property()
    collateralType: Address

    @Property()
    collateralAmount: BigFloat

    @Property()
    leverage: BigFloat

    @Property()
    totalMinted: BigFloat

    @Property()
    totalBurned: BigFloat

    @Property()
    netIssuance: BigFloat

    @Property({ canUpdate: false })
    createdAt: Timestamp

    // ==== Event Handlers ===================

    @BeforeAll()
    setCommonProperties(event: Event) {
        this.accountId = BigInt.from(event.data.accountId)
        this.poolId = BigInt.from(event.data.poolId)
        this.collateralType = event.data.collateralType
    }

    @OnCoreEvent('DelegationUpdated')
    onDelegationUpdated(event: Event) {
        this.collateralAmount = BigFloat.from(event.data.amount)
        this.leverage = BigFloat.from(event.data.leverage)
        this.createdAt = this.blockTimestamp
    }

    @OnCoreEvent('UsdMinted')
    async onUsdMinted(event: Event) {
        await this.load()
        this.totalMinted = this.totalMinted.plus(event.data.amount)
        this.netIssuance = this.netIssuance.plus(event.data.amount)
    }

    @OnCoreEvent('UsdBurned')
    async onUsdBurned(event: Event) {
        await this.load()
        this.totalBurned = this.totalBurned.plus(event.data.amount)
        this.netIssuance = this.netIssuance.minus(event.data.amount)
    }
}

export default Position