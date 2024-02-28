import {
  ProposalCanceled as ProposalCanceledEvent,
  ProposalCreated as ProposalCreatedEvent,
} from "../generated/GovernorCompTestnet/GovernorCompTestnet";
import { AggregationEntity, Proposal } from "../generated/schema";
import { Address, ethereum } from "@graphprotocol/graph-ts";

function acceptedContract(event: ethereum.Event): boolean {
  return [
    Address.fromString("0x6254c468849548Cf79898347AA4db0c046F10a86"),
    Address.fromString("0x13F7dCcBFa3E17c9063eCFF7299BfbCB738E6AF8"),
  ].includes(event.address);
}
// 0xdb4e3f34bb3eba8fd3fcfabc89e58cf4005af367

export function handleProposalCanceled(event: ProposalCanceledEvent): void {
  if (!acceptedContract(event)) return;
  let entity = Proposal.load(
    `${event.address.toHex()}-${event.params.proposalId}`
  );
  if (entity === null) return;
  entity.isCancelled = true;
  entity.save();
}

// Customize so we just have a proposal object
export function handleProposalCreated(event: ProposalCreatedEvent): void {
  if (!acceptedContract(event)) return;
	let aggregationEntity = AggregationEntity.load(`${event.address.toHex()}-proposal`)
	if (!aggregationEntity) {
		aggregationEntity = new AggregationEntity(`${event.address.toHex()}-proposal`)
	}
  let entity = new Proposal(
    `${event.address.toHex()}-${event.params.proposalId}`
  );
  entity.proposalId = event.params.proposalId;
  entity.proposer = event.params.proposer;
  // Weird type issue
  entity.values = event.params.values;
  entity.signatures = event.params.signatures;
  entity.calldatas = event.params.calldatas;
  entity.startBlock = event.params.startBlock;
  entity.endBlock = event.params.endBlock;
  entity.description = event.params.description;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  entity.governorAddress = event.address;
  entity.isCancelled = false;

  entity.save();

	aggregationEntity.proposalCount = aggregationEntity.proposalCount + 1
	aggregationEntity.save()
}
