# Pausability Functionality

The purpose of this library is to allow fine tuned control of pausing smart contracts individual functions. Traditional pausability models rely on using a modifier that checks a global variable and will cause all contracts that use that modifier to be paused.

This pausability contract allows you to pause any function signature except the exempted signatures you specify at runtime.

As an example, say we have the following interface and we want to be able to pause the function:

```transfer(address to, uint256 amount)```

However, we would like other functions to remain unpaused:

```
approve(address to, uint256 allowance)
transferFrom(address from, address to, uint256 amount)
```

We would add the `whileFunctionNotPaused` modifier to all the aforementioned functions, implement the `pauseFunction` and `unPauseFunction` method as specified in the MockContractToPause.sol file. Then, when we want to pause the transfer function, we call the function `pauseFunction` with the parameter `transfer(address,uint256)`. Then, if we try to call the transfer function after pausing it, execution will revert with the following error message: "function paused".


## MockContractToPause Constructor
When constructing this contract, we must not allow functions pauseFunction or unPauseFunction to ever be paused as we could then be stuck in a state that would be irrecoverable.

To combat this, we will pass an array of hashed function signatures to the constructor which will be whitelisted and prevented from ever being paused. This ensures that we can never pause the pause or unpause function.

### How it Works
The way this Function Pausability contract works is by getting the first 4 bytes of msg.data and then maintaining a whitelist of bytes4 to booleans which tells us whether or not this function is paused. Then, when a function on a contract is called from the entry point from another EOA or Contract Account, if the modifier is used on that function, our helpers will determine the function signature being called, if that function signature is paused, the tx will be reverted

#### Why Assembly?
The reason I chose to use assembly is because trying to copy over msg.data which does not have a fixed length into a fixed size container of bytes4 was tediuous so I decided to get a bit closer to the metal to solve this problem instead of trying to do a bunch of wonky type casting between ints and bytes.
