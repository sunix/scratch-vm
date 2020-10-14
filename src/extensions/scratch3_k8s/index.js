const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const nets = require('nets');
const log = require('../../util/log');

const urlParams = new URLSearchParams(window.location.search);
const urlBase = urlParams.get('k8sServer');

class Scratch3K8sBlocks {

    constructor(runtime) {
        this.runtime = runtime;
        this.namespace = "sutan-che";

    }

    getInfo() {
        return {
            id: 'k8s',
            name: 'Kubernetes',
            blocks: [
                {
                    opcode: 'setNamespace',
                    blockType: BlockType.COMMAND,
                    text: 'setNamespace [NAMESPACE]',
                    arguments: {
                        NAMESPACE: {
                            type: ArgumentType.STRING,
                            defaultValue: "sutan-che"
                        }
                    }
                },
                {
                    opcode: 'getPods',
                    blockType: BlockType.REPORTER,
                    text: 'getPods',
                },
                {
                    opcode: 'getPodListSize',
                    blockType: BlockType.REPORTER,
                    text: 'get number of Pods [PODS_JSON]',
                    arguments: {
                        PODS_JSON: {
                            type: ArgumentType.STRING,
                            defaultValue: "[]"
                        }
                    }
                },

                {
                    opcode: 'getPod',
                    blockType: BlockType.REPORTER,
                    text: 'get Pod [POD_INDEX] from List [PODS_JSON]',
                    arguments: {
                        POD_INDEX: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }, PODS_JSON: {
                            type: ArgumentType.STRING,
                            defaultValue: "[]"
                        }
                    }
                },

                {
                    opcode: 'getPodName',
                    blockType: BlockType.REPORTER,
                    text: 'get Pod Name [POD_JSON]',
                    arguments: {
                        POD_JSON: {
                            type: ArgumentType.STRING,
                            defaultValue: "{}"
                        }
                    }
                },
            ],
            menus: {
            }
        };
    }

    getPods(args) {
        return new Promise((resolve, reject) => {
            nets({
                url: urlBase.replace("http://", "https://") // quick dirty fix should use https
                    + (urlBase.endsWith("/") ? "" : "/") + this.namespace,
                timeout: 60000
            }, (err, res, body) => {
                if (err) {
                    log.warn(`error fetching get pods result! ${res}`);
                    reject();
                }
                log.log(`Get pods from ${this.namespace}: ${body}`);
                resolve(body);
            })
        });
    }

    getPodListSize(args) {
        const podsListJson = Cast.toString(args.PODS_JSON);
        const pods = JSON.parse(podsListJson);
        return pods.length;

    }

    getPod(args) {
        const index = Cast.toNumber(args.POD_INDEX);
        const podsListJson = Cast.toString(args.PODS_JSON);
        const pods = JSON.parse(podsListJson);
        return JSON.stringify(pods[index]);
    }

    getPodName(args) {
        const podJson = Cast.toString(args.POD_JSON);

        const pod = JSON.parse(podJson);
        return pod.metadata.name;
    }


    setNamespace(args) {
        const namespace = Cast.toString(args.NAMESPACE);
        log.log(`Set current namespace with ${namespace}`);
        this.namespace = namespace;
    }
}

module.exports = Scratch3K8sBlocks;
