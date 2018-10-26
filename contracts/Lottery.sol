pragma solidity ^0.4.24;

import './Random.sol';

/**
 *  This contract is used as lottery scheme, master get 20% and winner get 80%.
 *
 */
contract Lottery {

    // Status of Scheme
    enum Status { ACTIVE, EXPIRED }

    uint schemeId = 1;

    // All Scheme Details
    mapping (uint => Scheme) schemes;

    struct Scheme {
        address                  master;
        address                  winner;
        Status                   status;
        uint                     amount;
        uint                     maxAmount;
        uint                     totalTokenSold;
        mapping (uint => Player) players;
    }

    struct Player {
        address playerAddress;
        uint    amount;
    }

    event playerAdded(string,address,uint);
    event winnerDeclared(string,address);
    event logInteger(string,uint);

    modifier masterOnlyAccess(uint _schemeId) {
        require(schemes[_schemeId].master == msg.sender);
        _;
    }

    function generateScheme(uint maxAmount) public returns (uint _schemeId) {
        require(int(maxAmount) > 0, 'Amount must be positive.');
        _schemeId          = schemeId++;
        schemes[_schemeId] = Scheme(msg.sender, 0x0, Status.ACTIVE, 0, maxAmount, 0);
        emit logInteger('Scheme generated', _schemeId);
    }

    function buyToken(uint _schemeId) public payable {
        require(schemes[_schemeId].status == Status.ACTIVE, 'Scheme must be active.');
        require(msg.value == 1 ether, 'Token Amount must be 1.');
        require(schemes[_schemeId].amount <= schemes[_schemeId].maxAmount, 'Scheme capacity reached.');

        Scheme storage scheme = schemes[_schemeId];
        scheme.players[scheme.totalTokenSold++] = Player(msg.sender, msg.value);
        scheme.amount += (msg.value/1000000000000000000);
        emit playerAdded('player added', msg.sender, msg.value);
    }

    function declareWinner(uint _schemeId) public payable masterOnlyAccess(_schemeId) {
        require(schemes[_schemeId].status == Status.ACTIVE, 'Scheme must be active.');

        Scheme storage scheme = schemes[_schemeId];
        scheme.status = Status.EXPIRED;

        scheme.winner = scheme.players[Random.generateRandomWithin(scheme.totalTokenSold)].playerAddress;

        uint winningAmount = (scheme.amount * 80) / 100;

        emit winnerDeclared('winner', scheme.winner);
        emit logInteger('Winning Amount', winningAmount);

        scheme.winner.transfer(winningAmount * 1000000000000000000);
        scheme.master.transfer((scheme.amount-winningAmount) * 1000000000000000000);
    }
}
