pragma solidity ^0.4.24;

/**
 * This library generate random number.
 */
library Random {

    function generateRandomWithin(uint limit) public view returns (uint) {
        require(int(limit) > 0, 'limit must be positive.');

        uint D = block.difficulty;
        uint N = block.number;

        // only for testing env. as ganache give 0 as difficulty which never be case.
        if(D == 0) D = limit;

        uint Q = D / N;
        uint R = D % N;

        uint M = (uint8(uint256(keccak256(abi.encodePacked(Q, R))) % 251));
        uint random = ( M * (now % Q)) - ( R * (now / Q));

        if(random <= 0) {
            random = random + D;
        }
        return (random % limit) == 0 ? limit - (R % limit) : random % limit;
    }
}
