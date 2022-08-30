const MyDAOSourceTpl = (
  address,
  daoName,
  description,
  long_description,
  purpose,
  tags,
  links,

  voting_delay,
  voting_period,
  voting_quorum_rate,
  min_action_delay,
  min_proposal_deposit,
) => {
  let tagsCode = 'let tags = Vector::empty<vector<u8>>();\n';
  for (const i in tags) {
    const tag = tags[i];
    tagsCode += `\t\tVector::push_back<vector<u8>>(&mut tags, b"${tag}");\n`;
  }

  let linksCode = 'let links = Vector::empty<vector<u8>>();\n';
  for (const key in links) {
    const value = links[key];
    const link = `${key}=${value}`;
    linksCode += `\t\tVector::push_back<vector<u8>>(&mut links, b"${link}");\n`;
  }

  return `
module ${address}::${daoName} {
    use StarcoinFramework::Signer;
    use StarcoinFramework::Errors;
    use StarcoinFramework::Vector;
    use StarcoinFramework::Option::{ Self, Option};
    use StarcoinFramework::DAOAccount;
    use StarcoinFramework::DAOSpace;
    use StarcoinFramework::MemberProposalPlugin::{Self, MemberProposalPlugin};
    use StarcoinFramework::InstallPluginProposalPlugin::{Self, InstallPluginProposalPlugin};
    use FreePlugin::PluginMarketplace;
    
    /// The info for DAO installed Plugin
    struct InstalledWebPluginInfo has store, drop {
        plugin_id: u64,
        plugin_version: u64,
    }

    struct ${daoName} has key, store {
        long_description: vector<u8>,
        purpose: vector<u8>,
        tags: vector<vector<u8>>,
        links: vector<vector<u8>>,
        installed_web_plugins: vector<InstalledWebPluginInfo>,
    }
    
    const NAME: vector<u8> = b"${daoName}";
    const CONTRACT_ACCOUNT:address = @${daoName};

    const ERR_ALREADY_INITIALIZED: u64 = 100;
    const ERR_NOT_CONTRACT_OWNER: u64 = 101;
    const ERR_NOT_FOUND_PLUGIN: u64 = 102;
    const ERR_EXPECT_PLUGIN_NFT: u64 = 103;
    const ERR_REPEAT_ELEMENT: u64 = 104;
    const ERR_PLUGIN_HAS_INSTALLED: u64 = 105;
    const ERR_PLUGIN_VERSION_NOT_EXISTS: u64 = 106;
    const ERR_PLUGIN_NOT_INSTALLED: u64 = 107;

    /// directly upgrade the sender account to DAOAccount and create DAO
    public(script) fun initialize(
        sender: signer
    ){
        let dao_account_cap = DAOAccount::upgrade_to_dao(sender);
        let config = DAOSpace::new_dao_config(
            ${voting_delay},
            ${voting_period},
            ${voting_quorum_rate},
            ${min_action_delay},
            ${min_proposal_deposit},
        );
        ${tagsCode}
        ${linksCode}
        let dao = ${daoName} {
            long_description: b"${long_description}",
            purpose: b"${purpose}",
            tags: tags,
            links: links,
            installed_web_plugins: Vector::empty<InstalledWebPluginInfo>(),
        };

        Vector::push_back<InstalledWebPluginInfo>(&mut dao.installed_web_plugins, InstalledWebPluginInfo{
            plugin_id: 1,
            plugin_version: 1,
        });

        let dao_root_cap = DAOSpace::create_dao<${daoName}>(dao_account_cap, *&NAME, b"${description}", dao, config);
        
        DAOSpace::install_plugin_with_root_cap<${daoName}, InstallPluginProposalPlugin>(&dao_root_cap, InstallPluginProposalPlugin::required_caps()); 
        DAOSpace::install_plugin_with_root_cap<${daoName}, MemberProposalPlugin>(&dao_root_cap, MemberProposalPlugin::required_caps());

        DAOSpace::burn_root_cap(dao_root_cap);
    }
}
`;
};

export { MyDAOSourceTpl };