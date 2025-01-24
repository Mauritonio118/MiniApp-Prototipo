// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ByteHasher} from "./helpers/ByteHasher.sol";
import {IWorldID} from "./interfaces/IWorldID.sol";

contract MInterV2 is ERC20, Ownable {
    using ByteHasher for bytes;

    uint256 internal constant GROUP_ID = 1;
    IWorldID internal immutable WORLD_ID;
    uint256 internal immutable EXTERNAL_NULLIFIER;

    struct MintData {
        uint256 mintable;
    }

    mapping(uint256 nullifierHash => MintData) public nullifierHashMintData;

    event Minted(address indexed to, uint256 amount);

    constructor(
        address _owner,
        IWorldID _worldId,
        string memory _appId,
        string memory _actionId
    ) ERC20("ClickTokenV2", "CLICKV2") Ownable(_owner) {
        WORLD_ID = _worldId;
        EXTERNAL_NULLIFIER = abi.encodePacked(abi.encodePacked(_appId).hashToField(), _actionId).hashToField();
    }

    function mint(uint256 root, uint256 nullifierHash, uint256[8] calldata proof) public returns (uint256 amount) {
        // Ensure the required wait time has passed since the last claim
        MintData memory mintData = nullifierHashMintData[nullifierHash];

        // Verify proof of personhood
        WORLD_ID.verifyProof(
            root, GROUP_ID, abi.encodePacked(msg.sender).hashToField(), nullifierHash, EXTERNAL_NULLIFIER, proof
        );

        // Record the mint
        MintData storage data = nullifierHashMintData[nullifierHash];


        // Mint the tokens
        amount = data.mintable;
        _mint(msg.sender, amount);
        require(amount > 0, "Nothing to mint");
        emit Minted(msg.sender, amount);
    }

        function setMintable(uint256 nullifierHash, uint256 amount) external onlyOwner {
        nullifierHashMintData[nullifierHash].mintable = amount;
    }
}