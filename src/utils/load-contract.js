

export const loadContract = async (name) => {
    const res = await fetch(`/contracts/${name}.json`);
    const artifact = res.json();
    return {
        contract: artifact
    }
}