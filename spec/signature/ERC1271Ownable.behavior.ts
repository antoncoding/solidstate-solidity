import { ERC1271Ownable } from '../../typechain';
import { describeBehaviorOfERC1271Base } from './ERC1271Base.behavior';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { describeFilter } from '@solidstate/library';
import { ethers } from 'hardhat';

interface ERC1271OwnableBehaviorArgs {
  deploy: () => Promise<ERC1271Ownable>;
  getOwner: () => Promise<SignerWithAddress>;
  getNonOwner: () => Promise<SignerWithAddress>;
}

export function describeBehaviorOfERC1271Ownable(
  { deploy, getOwner, getNonOwner }: ERC1271OwnableBehaviorArgs,
  skips?: string[],
) {
  const describe = describeFilter(skips);

  describe('::ERC1271Ownable', function () {
    let owner: SignerWithAddress;
    let nonOwner: SignerWithAddress;

    beforeEach(async function () {
      owner = await getOwner();
      nonOwner = await getNonOwner();
    });

    describeBehaviorOfERC1271Base(
      {
        deploy,
        getValidParams: async function () {
          let hash = ethers.utils.randomBytes(32);
          let signature = await owner.signMessage(ethers.utils.arrayify(hash));
          return [hash, ethers.utils.arrayify(signature)];
        },
        getInvalidParams: async function () {
          let hash = ethers.utils.randomBytes(32);
          let signature = await nonOwner.signMessage(
            ethers.utils.arrayify(hash),
          );
          return [hash, ethers.utils.arrayify(signature)];
        },
      },
      skips,
    );
  });
}
