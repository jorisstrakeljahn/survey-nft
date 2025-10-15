export const ABI_SURVEY_NFT = [
  'function claimNFT(uint256 surveyId, uint8 points) external returns (uint256)',

  // Burn- und Admin-Calls
  'function burn(uint256 tokenId) external',
  'function burnAny(uint256 tokenId) external',
  'function burnAllFor(address user, uint256 surveyId) external',

  // Roles (AccessControl)
  'function grantRole(bytes32 role, address account) external',
  'function revokeRole(bytes32 role, address account) external',
  'function hasRole(bytes32 role, address account) view returns (bool)',
  'function DELETER_ROLE() view returns (bytes32)',
];
