pragma solidity ^0.4.24;

/**
 * This library generate random number.
 */
library Random {

    function generateRandomWithin(uint limit) public view returns (uint) {
        uint Q = block.difficulty / block.number;
        uint R = block.difficulty % block.number;
        uint M = (uint8(uint256(keccak256(abi.encodePacked(Q, R))) % 251));
        uint random = ( M * (now % Q)) - ( R * (now / Q));

        if(random <= 0) {
            random = random + block.difficulty;
        }
        return (random % limit) == 0 ? limit - (R % limit) : random % limit;
    }
}
