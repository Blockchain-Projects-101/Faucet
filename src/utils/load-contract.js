import contract from '@truffle/contract';

export const loadContract = async (name, provider) => {
    const res = await fetch(`/contracts/${name}.json`);
    const artifact =await res.json();
    const _contract  = contract(artifact);
    _contract.setProvider(provider);
    let deployedContract = null;
    try {
        deployedContract = await _contract.deployed();

    } catch {
        console.error("You're connected to the wrong network");
    }
    return deployedContract;
}