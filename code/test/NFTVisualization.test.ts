const { expect } = require('chai');
const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

describe('BasicNFT SVG Visualization', function () {
  before(async function () {
    this.BasicNFT = await ethers.getContractFactory('BasicNFT');
  });

  beforeEach(async function () {
    this.basicNFT = await this.BasicNFT.deploy();
    await this.basicNFT.waitForDeployment();
    
    // Your SVG with embedded image
    this.sampleSVG = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="27" height="27" xml:space="preserve" version="1.1" viewBox="0 0 27 27">
      <image width="27" height="27" xlink:href="data:image/png;base64,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"/>
    </svg>`;
  });

  it('Should mint NFT and save SVG to file for visualization', async function () {
    // Mint NFT with the SVG
    const tx = await this.basicNFT.mintNFT(
      this.sampleSVG,
      "Test NFT",
      "Test Description"
    );
    await tx.wait();

    // Get the tokenURI
    const tokenURI = await this.basicNFT.tokenURI(1);
    
    // Decode the base64 JSON metadata
    const json = Buffer.from(tokenURI.split('base64,')[1], 'base64').toString();
    const metadata = JSON.parse(json);
    
    // Decode the base64 SVG image
    const svgBase64 = metadata.image.split('base64,')[1];
    const svgContent = Buffer.from(svgBase64, 'base64').toString();
    
    // Create artifacts directory if it doesn't exist
    const artifactsDir = path.join(__dirname, 'artifacts');
    if (!fs.existsSync(artifactsDir)) {
      fs.mkdirSync(artifactsDir);
    }
    
    // Save files for inspection
    fs.writeFileSync(path.join(artifactsDir, 'metadata.json'), JSON.stringify(metadata, null, 2));
    fs.writeFileSync(path.join(artifactsDir, 'nft.svg'), svgContent);
    
    // Verify the SVG content matches
    expect(svgContent).to.equal(this.sampleSVG);
    
    console.log('\n');
    console.log('NFT files saved for visualization:');
    console.log('- Metadata:', path.join(artifactsDir, 'metadata.json'));
    console.log('- SVG:', path.join(artifactsDir, 'nft.svg'));
    console.log('\nYou can open the SVG file in a web browser to view your NFT\n');
  });
});