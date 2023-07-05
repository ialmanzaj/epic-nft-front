import React from 'react';

const NFTCard = ({contract, tokenId}) => {
  return (
    <div>
      <nft-card
        contractAddress={contract}
        tokenId={tokenId}
        network="rinkeby"
      ></nft-card>
     
    </div>
  );
};

export default NFTCard;
