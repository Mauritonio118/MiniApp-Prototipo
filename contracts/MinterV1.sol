// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract ClickToken is Ownable {
    using ECDSA for bytes32;

    address public backendSigner; // Dirección del backend autorizado
    address public tokenContract; // Dirección del contrato objetivo
    mapping(address => uint256) public minted;

    // Constructor para inicializar las direcciones
    constructor(address initialOwner, address _backendSigner, address _tokenContract ) 
        Ownable(initialOwner) {
        backendSigner = _backendSigner;
        tokenContract = _tokenContract;
    }

    function setBackendSigner(address _backendSigner) external onlyOwner  {
        backendSigner = _backendSigner;
    }

    function setTokenContract(address _tokenContract) external onlyOwner  {
        tokenContract = _tokenContract;
    }

    function minter(uint256 amount, uint256 timestamp, bytes memory signature) public {
        // Crear el hash del mensaje firmado
        bytes32 message = keccak256(abi.encodePacked(msg.sender, amount, timestamp));

        // Verificar que la firma proviene del backend autorizado
        require(message.recover(signature) == backendSigner, "Firma invalida");

        // Verificar que la firma no esté expirada
        require(block.timestamp < timestamp + 1 hours, "Firma expirada");

        // Actualizar el registro de tokens mintados por el usuario
        minted[msg.sender] += amount;

        // Llamar a la función mint del contrato objetivo
        ITokenContract(tokenContract).mint(msg.sender, amount);
    }
}

interface ITokenContract {
    function mint(address to, uint256 amount) external;
}