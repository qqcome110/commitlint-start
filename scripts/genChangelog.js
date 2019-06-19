const standardVersion = require("standard-version");
const inquirer = require("inquirer");
const semver = require("semver");
const { version } = require("../package.json");

// 请选择更新版本，major, minor, patch
const versionTypes = ["major", "minor", "patch"];
const getVersion = flag => semver.inc(version, flag);

async function genChangelog() {
  const { selectVersion } = await inquirer.prompt([
    {
      name: "selectVersion",
      type: "list",
      message: "请选择要发布的版本类型",
      choices: versionTypes.map(ver => ({
        name: `${ver}(${getVersion(ver)})`,
        value: ver
      })),
      default: "patch"
    }
  ]);

  await standardVersion({
    releaseAs: selectVersion,
    changelogHeader: " "
  });
}

genChangelog().catch(err => console.error(err));
