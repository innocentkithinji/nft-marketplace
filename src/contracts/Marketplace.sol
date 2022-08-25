// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";


contract Marketplace is ReentrancyGuard{

    //State Vars
    address payable public immutable feeAccount;
    uint public immutable feePercent;
    uint public itemCount;

    struct Item {
        uint itemId;
        IERC721 nft;
        uint tokenId;
        uint price;
        address payable seller;
        bool sold;
    }

    event Offered(
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller
    );


    event Bought(
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller,
        address indexed buyer
    );

    //ItemId -> Item
    mapping (uint => Item) public items;

    function makeItem(IERC721 _nft, uint _tokenId, uint _price) external nonReentrant {
        require(_price > 0, "Price must be greater than zero!");

        itemCount ++;

        _nft.transferFrom(msg.sender, address(this), _tokenId);

        items[itemCount] = Item (
            itemCount,
            _nft,
            _tokenId,
            _price,
            payable(msg.sender),
            false
        );

        emit Offered(itemCount, address(_nft), _tokenId, _price, msg.sender);
    }


    function purchaseItem(uint _itemId) external payable nonReentrant{
        require(_itemId > 0 && _itemId <= itemCount, "Item doesn't exist!");

        uint _totalPrice = getTotalPrice(_itemId);
        require(msg.value >= _totalPrice, "Not enough Ether to cover item price and market fee");

        Item storage item = items[_itemId];
        require(!item.sold, "item already sold");

        item.seller.transfer(item.price);
        feeAccount.transfer(_totalPrice - item.price);

        item.sold = true;

        item.nft.transferFrom(address(this), msg.sender, item.tokenId);

        emit Bought(itemCount, address(item.nft), item.itemId, item.price, address(item.seller), msg.sender);
    }

    function getTotalPrice(uint _itemId) view public returns(uint){
        return (items[_itemId].price*(100 + feePercent)/100);
    }

    constructor(uint _feepercent){
        feeAccount = payable(msg.sender);
        feePercent = _feepercent;
    }
}