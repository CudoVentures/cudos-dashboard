"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const long_1 = __importDefault(require("long"));
const minimal_1 = __importDefault(require("protobufjs/minimal"));
const upgrade_1 = require("./upgrade");
exports.protobufPackage = "cosmos.upgrade.v1beta1";
const baseQueryCurrentPlanRequest = {};
exports.QueryCurrentPlanRequest = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseQueryCurrentPlanRequest);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(_) {
        const message = Object.assign({}, baseQueryCurrentPlanRequest);
        return message;
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    fromPartial(_) {
        const message = Object.assign({}, baseQueryCurrentPlanRequest);
        return message;
    },
};
const baseQueryCurrentPlanResponse = {};
exports.QueryCurrentPlanResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.plan !== undefined) {
            upgrade_1.Plan.encode(message.plan, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseQueryCurrentPlanResponse);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.plan = upgrade_1.Plan.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseQueryCurrentPlanResponse);
        if (object.plan !== undefined && object.plan !== null) {
            message.plan = upgrade_1.Plan.fromJSON(object.plan);
        }
        else {
            message.plan = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.plan !== undefined &&
            (obj.plan = message.plan ? upgrade_1.Plan.toJSON(message.plan) : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseQueryCurrentPlanResponse);
        if (object.plan !== undefined && object.plan !== null) {
            message.plan = upgrade_1.Plan.fromPartial(object.plan);
        }
        else {
            message.plan = undefined;
        }
        return message;
    },
};
const baseQueryAppliedPlanRequest = { name: "" };
exports.QueryAppliedPlanRequest = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.name !== "") {
            writer.uint32(10).string(message.name);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseQueryAppliedPlanRequest);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.name = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseQueryAppliedPlanRequest);
        if (object.name !== undefined && object.name !== null) {
            message.name = String(object.name);
        }
        else {
            message.name = "";
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.name !== undefined && (obj.name = message.name);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseQueryAppliedPlanRequest);
        if (object.name !== undefined && object.name !== null) {
            message.name = object.name;
        }
        else {
            message.name = "";
        }
        return message;
    },
};
const baseQueryAppliedPlanResponse = { height: long_1.default.ZERO };
exports.QueryAppliedPlanResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (!message.height.isZero()) {
            writer.uint32(8).int64(message.height);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseQueryAppliedPlanResponse);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.height = reader.int64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseQueryAppliedPlanResponse);
        if (object.height !== undefined && object.height !== null) {
            message.height = long_1.default.fromString(object.height);
        }
        else {
            message.height = long_1.default.ZERO;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.height !== undefined &&
            (obj.height = (message.height || long_1.default.ZERO).toString());
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseQueryAppliedPlanResponse);
        if (object.height !== undefined && object.height !== null) {
            message.height = object.height;
        }
        else {
            message.height = long_1.default.ZERO;
        }
        return message;
    },
};
const baseQueryUpgradedConsensusStateRequest = {
    lastHeight: long_1.default.ZERO,
};
exports.QueryUpgradedConsensusStateRequest = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (!message.lastHeight.isZero()) {
            writer.uint32(8).int64(message.lastHeight);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseQueryUpgradedConsensusStateRequest);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.lastHeight = reader.int64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseQueryUpgradedConsensusStateRequest);
        if (object.lastHeight !== undefined && object.lastHeight !== null) {
            message.lastHeight = long_1.default.fromString(object.lastHeight);
        }
        else {
            message.lastHeight = long_1.default.ZERO;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.lastHeight !== undefined &&
            (obj.lastHeight = (message.lastHeight || long_1.default.ZERO).toString());
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseQueryUpgradedConsensusStateRequest);
        if (object.lastHeight !== undefined && object.lastHeight !== null) {
            message.lastHeight = object.lastHeight;
        }
        else {
            message.lastHeight = long_1.default.ZERO;
        }
        return message;
    },
};
const baseQueryUpgradedConsensusStateResponse = {};
exports.QueryUpgradedConsensusStateResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.upgradedConsensusState.length !== 0) {
            writer.uint32(18).bytes(message.upgradedConsensusState);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseQueryUpgradedConsensusStateResponse);
        message.upgradedConsensusState = new Uint8Array();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 2:
                    message.upgradedConsensusState = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseQueryUpgradedConsensusStateResponse);
        message.upgradedConsensusState = new Uint8Array();
        if (object.upgradedConsensusState !== undefined &&
            object.upgradedConsensusState !== null) {
            message.upgradedConsensusState = bytesFromBase64(object.upgradedConsensusState);
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.upgradedConsensusState !== undefined &&
            (obj.upgradedConsensusState = base64FromBytes(message.upgradedConsensusState !== undefined
                ? message.upgradedConsensusState
                : new Uint8Array()));
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseQueryUpgradedConsensusStateResponse);
        if (object.upgradedConsensusState !== undefined &&
            object.upgradedConsensusState !== null) {
            message.upgradedConsensusState = object.upgradedConsensusState;
        }
        else {
            message.upgradedConsensusState = new Uint8Array();
        }
        return message;
    },
};
const baseQueryModuleVersionsRequest = { moduleName: "" };
exports.QueryModuleVersionsRequest = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.moduleName !== "") {
            writer.uint32(10).string(message.moduleName);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseQueryModuleVersionsRequest);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.moduleName = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseQueryModuleVersionsRequest);
        if (object.moduleName !== undefined && object.moduleName !== null) {
            message.moduleName = String(object.moduleName);
        }
        else {
            message.moduleName = "";
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.moduleName !== undefined && (obj.moduleName = message.moduleName);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseQueryModuleVersionsRequest);
        if (object.moduleName !== undefined && object.moduleName !== null) {
            message.moduleName = object.moduleName;
        }
        else {
            message.moduleName = "";
        }
        return message;
    },
};
const baseQueryModuleVersionsResponse = {};
exports.QueryModuleVersionsResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.moduleVersions) {
            upgrade_1.ModuleVersion.encode(v, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseQueryModuleVersionsResponse);
        message.moduleVersions = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.moduleVersions.push(upgrade_1.ModuleVersion.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseQueryModuleVersionsResponse);
        message.moduleVersions = [];
        if (object.moduleVersions !== undefined && object.moduleVersions !== null) {
            for (const e of object.moduleVersions) {
                message.moduleVersions.push(upgrade_1.ModuleVersion.fromJSON(e));
            }
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        if (message.moduleVersions) {
            obj.moduleVersions = message.moduleVersions.map((e) => e ? upgrade_1.ModuleVersion.toJSON(e) : undefined);
        }
        else {
            obj.moduleVersions = [];
        }
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseQueryModuleVersionsResponse);
        message.moduleVersions = [];
        if (object.moduleVersions !== undefined && object.moduleVersions !== null) {
            for (const e of object.moduleVersions) {
                message.moduleVersions.push(upgrade_1.ModuleVersion.fromPartial(e));
            }
        }
        return message;
    },
};
class QueryClientImpl {
    constructor(rpc) {
        this.rpc = rpc;
        this.CurrentPlan = this.CurrentPlan.bind(this);
        this.AppliedPlan = this.AppliedPlan.bind(this);
        this.UpgradedConsensusState = this.UpgradedConsensusState.bind(this);
        this.ModuleVersions = this.ModuleVersions.bind(this);
    }
    CurrentPlan(request) {
        const data = exports.QueryCurrentPlanRequest.encode(request).finish();
        const promise = this.rpc.request("cosmos.upgrade.v1beta1.Query", "CurrentPlan", data);
        return promise.then((data) => exports.QueryCurrentPlanResponse.decode(new minimal_1.default.Reader(data)));
    }
    AppliedPlan(request) {
        const data = exports.QueryAppliedPlanRequest.encode(request).finish();
        const promise = this.rpc.request("cosmos.upgrade.v1beta1.Query", "AppliedPlan", data);
        return promise.then((data) => exports.QueryAppliedPlanResponse.decode(new minimal_1.default.Reader(data)));
    }
    UpgradedConsensusState(request) {
        const data = exports.QueryUpgradedConsensusStateRequest.encode(request).finish();
        const promise = this.rpc.request("cosmos.upgrade.v1beta1.Query", "UpgradedConsensusState", data);
        return promise.then((data) => exports.QueryUpgradedConsensusStateResponse.decode(new minimal_1.default.Reader(data)));
    }
    ModuleVersions(request) {
        const data = exports.QueryModuleVersionsRequest.encode(request).finish();
        const promise = this.rpc.request("cosmos.upgrade.v1beta1.Query", "ModuleVersions", data);
        return promise.then((data) => exports.QueryModuleVersionsResponse.decode(new minimal_1.default.Reader(data)));
    }
}
exports.QueryClientImpl = QueryClientImpl;
var globalThis = (() => {
    if (typeof globalThis !== "undefined")
        return globalThis;
    if (typeof self !== "undefined")
        return self;
    if (typeof window !== "undefined")
        return window;
    if (typeof global !== "undefined")
        return global;
    throw "Unable to locate global object";
})();
const atob = globalThis.atob ||
    ((b64) => globalThis.Buffer.from(b64, "base64").toString("binary"));
function bytesFromBase64(b64) {
    const bin = atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
        arr[i] = bin.charCodeAt(i);
    }
    return arr;
}
const btoa = globalThis.btoa ||
    ((bin) => globalThis.Buffer.from(bin, "binary").toString("base64"));
function base64FromBytes(arr) {
    const bin = [];
    for (let i = 0; i < arr.byteLength; ++i) {
        bin.push(String.fromCharCode(arr[i]));
    }
    return btoa(bin.join(""));
}
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}
