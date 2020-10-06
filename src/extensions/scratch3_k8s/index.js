const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');

class Scratch3K8sBlocks {
    constructor(runtime) {
        this.runtime = runtime;
    }

    getInfo() {
        return {
            id: 'k8s',
            name: 'Kubernetes',
            blocks: [
                {
                    opcode: 'writeLog',
                    blockType: BlockType.COMMAND,
                    text: 'log [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: "hello"
                        }
                    }
                }
            ],
            menus: {
            }
        };
    }

    writeLog(args) {
        const text = Cast.toString(args.TEXT);
        log.log(text.toUpperCase());

    }
}

module.exports = Scratch3K8sBlocks;
