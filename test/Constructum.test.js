const Constructum_contract = artifacts.require("Constructum");
const ConstructumMint_contract = artifacts.require("ConstructumMint");
const assert = require('assert');
const { default: BigNumber } = require('bignumber.js');

contract("Constructum", accounts => {

  var BN = web3.utils.BN;
  let signer = web3.eth.accounts.wallet[0];
  let constructumAddress;
  let constructumMintAddress;
  let price;
  let AL = {};
  let WL;



  beforeEach(async() =>{
    constructum = await Constructum_contract.deployed();
    constructumMint = await ConstructumMint_contract.deployed();
    await web3.eth.accounts.wallet.create(1)
    signer = web3.eth.accounts.wallet[0]

    constructumAddress = await constructum.address
    constructumMintAddress = await constructumMint.address

    price = new BN(await constructumMint._price.call())
  });

  it("... should create a WL", async ()=>{
    WL = [
      {"address": accounts[1], maxQuantity: 1, isReserveMint: false},
      {"address": accounts[2], maxQuantity: 1, isReserveMint: true},
      {"address": accounts[3], maxQuantity: 2, isReserveMint: false},
      {"address": accounts[4], maxQuantity: 2, isReserveMint: false}]
      // set signer
    await assert.rejects(constructumMint.setSigner(accounts[1], {from: accounts[1]}), "Non admin could set Signer")
    assert(await constructumMint.setSigner(signer.address),"Could not set the signer");
    for(i=0; i < WL.length ;i ++){
      assert(web3.utils.toChecksumAddress(WL[i].address),"error")
      assert(web3.utils.toChecksumAddress(signer.address),"error")
      AL[WL[i].address] = await web3.eth.accounts.sign(web3.utils.soliditySha3(WL[i].address, constructumAddress, true , true, WL[i].maxQuantity, WL[i].isReserveMint), signer.privateKey)
    }
  })

  
  it("... should give deployment costs", async () => {
    let constructumInstance = await Constructum_contract.new();
    let receiptConstructum = await web3.eth.getTransactionReceipt(constructumInstance.transactionHash);

    let constructumMintInstance = await ConstructumMint_contract.new();
    let receiptConstructumMint = await web3.eth.getTransactionReceipt(constructumMintInstance.transactionHash);

    console.log(`Constructum gas deployement cost: ${receiptConstructum.gasUsed}`)
    console.log(`Price @10Gwei: ${(receiptConstructum.gasUsed)*10*10**9/(10**18)} ETH`)
    console.log(`Price @20Gwei: ${(receiptConstructum.gasUsed)*20*10**9/(10**18)} ETH`)
    console.log(`Price @30Gwei: ${(receiptConstructum.gasUsed)*30*10**9/(10**18)} ETH`)

    console.log(`ConstructumMint gas deployement cost: ${receiptConstructumMint.gasUsed}`)
    console.log(`Price @10Gwei: ${(receiptConstructumMint.gasUsed)*10*10**9/(10**18)} ETH`)
    console.log(`Price @20Gwei: ${(receiptConstructumMint.gasUsed)*20*10**9/(10**18)} ETH`)
    console.log(`Price @30Gwei: ${(receiptConstructumMint.gasUsed)*30*10**9/(10**18)} ETH`)

    console.log(`Total gas deployement cost: ${receiptConstructum.gasUsed + receiptConstructumMint.gasUsed}`)
    console.log(`Price @10Gwei: ${(receiptConstructum.gasUsed + receiptConstructumMint.gasUsed)*10*10**9/(10**18)} ETH`)
    console.log(`Price @20Gwei: ${(receiptConstructum.gasUsed + receiptConstructumMint.gasUsed)*20*10**9/(10**18)} ETH`)
    console.log(`Price @30Gwei: ${(receiptConstructum.gasUsed + receiptConstructumMint.gasUsed)*30*10**9/(10**18)} ETH`)
  });

  it("... should set the Mint contract correctly", async ()=>{
    // set contract address
    await assert.rejects(constructumMint.setConstructumAddress(constructumAddress, {from: accounts[1]}), "Non admin could set Constructum address")
    assert(await constructumMint.setConstructumAddress(constructumAddress), "Could not set Constructum address")
    // set recipient address
    await assert.rejects(constructumMint.setRecipient(accounts[1], {from: accounts[1]}), "Non admin could set recipient")
    assert(await constructumMint.setRecipient(accounts[0]), "Could not setrecipient")
  })

  it("... should set the contract correctly", async ()=>{
    // Test admins
    await assert.rejects(constructum.toggleAdmin(constructumMintAddress, {from: accounts[1]}), "Non admin could add admin")
    assert(await constructum.toggleAdmin(constructumMintAddress), "Could not add admin")


    // Test URIs
    await assert.rejects(constructum.setURI('link', {from: accounts[1]}), "Non admin could set URI")
    assert(await constructum.setURI('link'), "Admin could not set URI")
  })

  it('... should allow to AL mint', async()=>{
    let signature = AL[accounts[1]]
    await assert.rejects(constructumMint.ALMint(signature.v, signature.r, signature.s, 1, false, 0, 1, 2, {from: accounts[1]}), "Could mint before opened drop");
    await assert.rejects(constructumMint.toggleALMintOpened({from: accounts[1]}),"Non admin could open the drop")
    assert(await constructumMint.toggleALMintOpened(),"Admin could not open the drop")

    assert(await constructumMint.ALMint(signature.v, signature.r, signature.s, 1, false, 0, 1, 2, {from: accounts[1], value: price.toString()}), "Could mint before opened drop");
  })

  it('... should save some spots for the reserve', async()=>{
    await assert.rejects(constructumMint.configDrop((0.08*10**18).toString(), 2, 1,{from: accounts[1]}),"Non admin could config the drop")
    assert(await constructumMint.configDrop((0.08*10**18).toString(), 2, 1,{from: accounts[0]}),"Non admin could config the drop")
    let signature = AL[accounts[3]]
    await assert.rejects(constructumMint.ALMint(signature.v, signature.r, signature.s, 1, true, 0, 1, 2, {from: accounts[3]}), "Could mint when supply Maxed out");
    await assert.rejects(constructumMint.ALMint(signature.v, signature.r, signature.s, 1, false, 0, 1, 2, {from: accounts[3]}), "Could mint when supply Maxed out");

    signature = AL[accounts[2]]
    assert(await constructumMint.ALMint(signature.v, signature.r, signature.s, 1, true, 0, 1, 2, {from: accounts[2]}), "Could noot mint the reserve");
  })

  it('... should not allow to mint more than the limit', async()=>{
    assert(await constructumMint.configDrop((0.08*10**18).toString(), 55, 3,{from: accounts[0]}),"Non admin could config the drop")
    let signature = AL[accounts[1]]
    await assert.rejects(constructumMint.ALMint(signature.v, signature.r, signature.s, 1, false, 0, 1, 2, {from: accounts[1]}), "Could mint more than the limit");
    signature = AL[accounts[3]]
    assert(await constructumMint.ALMint(signature.v, signature.r, signature.s, 2, false, 0, 1, 2, {from: accounts[3], value: price.toString()}), "Could not mint within its limit");
    assert(await constructumMint.ALMint(signature.v, signature.r, signature.s, 2, false, 3, 1, 4, {from: accounts[3], value: price.toString()}), "Could not mint within its limit");
    await assert.rejects(constructumMint.ALMint(signature.v, signature.r, signature.s, 2, false, 0, 1, 2, {from: accounts[3], value: price.toString()}), "Could mint more than the limit");
  })


  it('... should allow to public mint with the right characteristics', async()=>{
    await assert.rejects(constructumMint.mint(0, 1, 2, {from: accounts[1]}), "Could mint before opened drop");
    await assert.rejects(constructumMint.mint(0, 1, 2, {from: accounts[1]}), "Could mint before opened drop");
    await assert.rejects(constructum.mint(accounts[1], 0, 1, 2, true, {from: accounts[1]}), "Could mint from main contract directly");

    await assert.rejects(constructumMint.toggleMintOpened({from: accounts[1]}), "Could open drop as non admin");
    assert(await constructumMint.toggleMintOpened(), "Could not open drop")

    await assert.rejects(constructumMint.mint(0, 1, 2, {from: accounts[0], value: 0}),"Could mint without paying");

    assert(await constructumMint.mint(3, 1, 4, {from: accounts[0], value: price.toString()}),"Could not mint a token");
    assert(await constructumMint.mint(3, 1, 4, {from: accounts[1], value: price.toString()}),"Could not mint a Token");

    await assert.rejects(constructumMint.mint(3, 1, 4, {from: accounts[1], value: price.toString()}),"Could mint aoove the limit per Wallet");

    await assert.rejects(constructumMint.setLimitPerWallet(2, {from: accounts[1]}), "non admin could   set the wallet limit")
    assert(await constructumMint.setLimitPerWallet(2), "admin could not set the wallet limit")
    assert(await constructumMint.mint(3, 1, 4, {from: accounts[1], value: price.toString()}),"Could not mint a Token");
  })

  it("... should have the right URI", async()=>{
    let uri;
    let uri0 = 'data:application/json;utf8,{"name":"Constructum", "description":"", "created_by":"Simply Anders", "image":"link/images/012.jpg", "image_url":"link/images/012.jpg", "animation":"link/animations/012.mp4", "animation_url":"link/animations/012.mp4", "attributes":[{"trait_type": "Color", "value": "Black"},{"trait_type": "Outer Shell", "value": "10d"},{"trait_type": "Decoration", "value": "Intersection"}]}' 
    let uri1 = 'data:application/json;utf8,{"name":"Constructum", "description":"", "created_by":"Simply Anders", "image":"link/images/314.jpg", "image_url":"link/images/314.jpg", "animation":"link/animations/314.mp4", "animation_url":"link/animations/314.mp4", "attributes":[{"trait_type": "Color", "value": "Green"},{"trait_type": "Outer Shell", "value": "10d"},{"trait_type": "Decoration", "value": "Squares"}]}'
    // Test broken
      uri = await constructum.tokenURI(0)
      assert.equal(uri, uri0, 'wrong URI0')
      uri = await constructum.tokenURI(3)
      assert.equal(uri, uri1, 'wrong URI1')
  })


});
