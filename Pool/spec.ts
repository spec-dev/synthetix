import { Spec, LiveTable, Property, Event, Address, BigInt, Timestamp, ZERO_ADDRESS, BeforeAll } from '@spec.dev/core'
import { OnCoreEvent } from '../shared/decorators.ts'

/**
 * All pools on Synthetix V3.
 */
@Spec({ 
    uniqueBy: ['poolId', 'chainId'] 
})
class Pool extends LiveTable {

    @Property()
    poolId: BigInt

    @Property()
    name: string

    @Property()
    owner: Address

    @Property()
    nominatedOwner: Address

    @Property()
    createdAt: Timestamp

    // ==== Event Handlers ===================
    
    @BeforeAll()
    setCommonProperties(event: Event) {
        this.poolId = BigInt.from(event.data.poolId)
    }

    @OnCoreEvent('PoolCreated')
    onPoolCreated(event: Event) {
        this.owner = event.data.owner
        this.createdAt = this.blockTimestamp
    }

    @OnCoreEvent('PoolNameUpdated')
    onNameUpdated(event: Event) {
        this.name = event.data.name
    }

    @OnCoreEvent('PoolOwnerNominated')
    onOwnerNominated(event: Event) {
        this.nominatedOwner = event.data.nominatedOwner
    }

    @OnCoreEvent('PoolOwnershipAccepted')
    onOwnershipAccepted(event: Event) {
        this.owner = event.data.owner
        this.nominatedOwner = ZERO_ADDRESS
    }

    @OnCoreEvent('PoolNominationRenounced')
    @OnCoreEvent('PoolNominationRevoked')
    unsetNominatedOwner() {
        this.nominatedOwner = ZERO_ADDRESS
    }
}

export default Pool