import {
  ProposalCanceled as ProposalCanceledEvent,
  ProposalCreated as ProposalCreatedEvent,
} from "../generated/GovernorCompTestnet/GovernorCompTestnet"
import {
  ProposalCanceled,
  ProposalCreated,
} from "../generated/schema"
import {
  ethereum,
} from "@graphprotocol/graph-ts";


// function acceptedContract(event: ethereum.Event): boolean {
// 	return ['0xDB4e3F34bb3eba8FD3FcFAbC89E58CF4005AF367'.toLowerCase(), '0xbEF87C8665F2F7C413b9781EFC5b7f1852B68D2e'.toLowerCase()].includes(event.address.toString().toLowerCase())
// }
// 0xdb4e3f34bb3eba8fd3fcfabc89e58cf4005af367

export function handleProposalCanceled(event: ProposalCanceledEvent): void {
	// if (!acceptedContract(event)) return
  let entity = new ProposalCanceled(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.proposalId = event.params.proposalId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.contract = event.address

  entity.save()
}

export function handleProposalCreated(event: ProposalCreatedEvent): void {
	// if (!acceptedContract(event)) return
  let entity = new ProposalCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.proposalId = event.params.proposalId
  entity.proposer = event.params.proposer
	// Weird type issue
  entity.values = event.params.values
  entity.signatures = event.params.signatures
  entity.calldatas = event.params.calldatas
  entity.startBlock = event.params.startBlock
  entity.endBlock = event.params.endBlock
  entity.description = event.params.description

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.contract = event.address

  entity.save()
}
