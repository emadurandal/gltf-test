(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("babylonjs"));
	else if(typeof define === 'function' && define.amd)
		define("babylonjs-serializers", ["babylonjs"], factory);
	else if(typeof exports === 'object')
		exports["babylonjs-serializers"] = factory(require("babylonjs"));
	else
		root["SERIALIZERS"] = factory(root["BABYLON"]);
})((typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : this), (__WEBPACK_EXTERNAL_MODULE_babylonjs_Maths_math_vector__) => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "../../../dev/serializers/src/OBJ/index.ts":
/*!*************************************************!*\
  !*** ../../../dev/serializers/src/OBJ/index.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OBJExport: () => (/* reexport safe */ _objSerializer__WEBPACK_IMPORTED_MODULE_0__.OBJExport)
/* harmony export */ });
/* harmony import */ var _objSerializer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./objSerializer */ "../../../dev/serializers/src/OBJ/objSerializer.ts");



/***/ }),

/***/ "../../../dev/serializers/src/OBJ/objSerializer.ts":
/*!*********************************************************!*\
  !*** ../../../dev/serializers/src/OBJ/objSerializer.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OBJExport: () => (/* binding */ OBJExport)
/* harmony export */ });
/* harmony import */ var babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! babylonjs/Materials/material */ "babylonjs/Maths/math.vector");
/* harmony import */ var babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__);



/**
 * Class for generating OBJ data from a Babylon scene.
 */
var OBJExport = /** @class */ (function () {
    function OBJExport() {
    }
    /**
     * Exports the geometry of a Mesh array in .OBJ file format (text)
     * @param meshes defines the list of meshes to serialize
     * @param materials defines if materials should be exported
     * @param matlibname defines the name of the associated mtl file
     * @param globalposition defines if the exported positions are globals or local to the exported mesh
     * @returns the OBJ content
     */
    OBJExport.OBJ = function (meshes, materials, matlibname, globalposition) {
        var output = [];
        var v = 1;
        // keep track of uv index in case mixed meshes are passed in
        var textureV = 1;
        if (materials) {
            if (!matlibname) {
                matlibname = "mat";
            }
            output.push("mtllib " + matlibname + ".mtl");
        }
        for (var j = 0; j < meshes.length; j++) {
            var mesh = meshes[j];
            var objectName = mesh.name || "mesh".concat(j, "}");
            output.push("o ".concat(objectName));
            //Uses the position of the item in the scene, to the file (this back to normal in the end)
            var inverseTransform = null;
            if (globalposition) {
                var transform = mesh.computeWorldMatrix(true);
                inverseTransform = new babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Matrix();
                transform.invertToRef(inverseTransform);
                mesh.bakeTransformIntoVertices(transform);
            }
            //TODO: submeshes (groups)
            //TODO: smoothing groups (s 1, s off);
            if (materials) {
                var mat = mesh.material;
                if (mat) {
                    output.push("usemtl " + mat.id);
                }
            }
            var g = mesh.geometry;
            if (!g) {
                babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Tools.Warn("No geometry is present on the mesh");
                continue;
            }
            var trunkVerts = g.getVerticesData("position");
            var trunkNormals = g.getVerticesData("normal");
            var trunkUV = g.getVerticesData("uv");
            var trunkFaces = g.getIndices();
            var currentV = 0;
            var currentTextureV = 0;
            if (!trunkVerts || !trunkFaces) {
                babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Tools.Warn("There are no position vertices or indices on the mesh!");
                continue;
            }
            var useRightHandedSystem = meshes[0].getScene().useRightHandedSystem;
            var handednessSign = useRightHandedSystem ? 1 : -1;
            for (var i = 0; i < trunkVerts.length; i += 3) {
                output.push("v " + trunkVerts[i] * handednessSign + " " + trunkVerts[i + 1] + " " + trunkVerts[i + 2]);
                currentV++;
            }
            if (trunkNormals != null) {
                for (var i = 0; i < trunkNormals.length; i += 3) {
                    output.push("vn " + trunkNormals[i] * handednessSign + " " + trunkNormals[i + 1] + " " + trunkNormals[i + 2]);
                }
            }
            if (trunkUV != null) {
                for (var i = 0; i < trunkUV.length; i += 2) {
                    output.push("vt " + trunkUV[i] + " " + trunkUV[i + 1]);
                    currentTextureV++;
                }
            }
            var blanks = ["", "", ""];
            var material = mesh.material || mesh.getScene().defaultMaterial;
            var sideOrientation = material._getEffectiveOrientation(mesh);
            var _a = sideOrientation === babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Material.ClockWiseSideOrientation ? [2, 1] : [1, 2], offset1 = _a[0], offset2 = _a[1];
            for (var i = 0; i < trunkFaces.length; i += 3) {
                var indices = [String(trunkFaces[i] + v), String(trunkFaces[i + offset1] + v), String(trunkFaces[i + offset2] + v)];
                var textureIndices = [String(trunkFaces[i] + textureV), String(trunkFaces[i + offset1] + textureV), String(trunkFaces[i + offset2] + textureV)];
                var facePositions = indices;
                var faceUVs = trunkUV != null ? textureIndices : blanks;
                var faceNormals = trunkNormals != null ? indices : blanks;
                output.push("f " +
                    facePositions[0] +
                    "/" +
                    faceUVs[0] +
                    "/" +
                    faceNormals[0] +
                    " " +
                    facePositions[1] +
                    "/" +
                    faceUVs[1] +
                    "/" +
                    faceNormals[1] +
                    " " +
                    facePositions[2] +
                    "/" +
                    faceUVs[2] +
                    "/" +
                    faceNormals[2]);
            }
            //back de previous matrix, to not change the original mesh in the scene
            if (globalposition && inverseTransform) {
                mesh.bakeTransformIntoVertices(inverseTransform);
            }
            v += currentV;
            textureV += currentTextureV;
        }
        var text = output.join("\n");
        return text;
    };
    /**
     * Exports the material(s) of a mesh in .MTL file format (text)
     * @param mesh defines the mesh to extract the material from
     * @returns the mtl content
     */
    //TODO: Export the materials of mesh array
    OBJExport.MTL = function (mesh) {
        var output = [];
        var m = mesh.material;
        output.push("newmtl mat1");
        output.push("  Ns " + m.specularPower.toFixed(4));
        output.push("  Ni 1.5000");
        output.push("  d " + m.alpha.toFixed(4));
        output.push("  Tr 0.0000");
        output.push("  Tf 1.0000 1.0000 1.0000");
        output.push("  illum 2");
        output.push("  Ka " + m.ambientColor.r.toFixed(4) + " " + m.ambientColor.g.toFixed(4) + " " + m.ambientColor.b.toFixed(4));
        output.push("  Kd " + m.diffuseColor.r.toFixed(4) + " " + m.diffuseColor.g.toFixed(4) + " " + m.diffuseColor.b.toFixed(4));
        output.push("  Ks " + m.specularColor.r.toFixed(4) + " " + m.specularColor.g.toFixed(4) + " " + m.specularColor.b.toFixed(4));
        output.push("  Ke " + m.emissiveColor.r.toFixed(4) + " " + m.emissiveColor.g.toFixed(4) + " " + m.emissiveColor.b.toFixed(4));
        //TODO: uv scale, offset, wrap
        //TODO: UV mirrored in Blender? second UV channel? lightMap? reflection textures?
        var uvscale = "";
        if (m.ambientTexture) {
            output.push("  map_Ka " + uvscale + m.ambientTexture.name);
        }
        if (m.diffuseTexture) {
            output.push("  map_Kd " + uvscale + m.diffuseTexture.name);
            //TODO: alpha testing, opacity in diffuse texture alpha channel (diffuseTexture.hasAlpha -> map_d)
        }
        if (m.specularTexture) {
            output.push("  map_Ks " + uvscale + m.specularTexture.name);
            /* TODO: glossiness = specular highlight component is in alpha channel of specularTexture. (???)
            if (m.useGlossinessFromSpecularMapAlpha)  {
                output.push("  map_Ns "+uvscale + m.specularTexture.name);
            }
            */
        }
        /* TODO: emissive texture not in .MAT format (???)
        if (m.emissiveTexture) {
            output.push("  map_d "+uvscale+m.emissiveTexture.name);
        }
        */
        if (m.bumpTexture) {
            output.push("  map_bump -imfchan z " + uvscale + m.bumpTexture.name);
        }
        if (m.opacityTexture) {
            output.push("  map_d " + uvscale + m.opacityTexture.name);
        }
        var text = output.join("\n");
        return text;
    };
    return OBJExport;
}());



/***/ }),

/***/ "../../../dev/serializers/src/glTF/2.0/Extensions/EXT_mesh_gpu_instancing.ts":
/*!***********************************************************************************!*\
  !*** ../../../dev/serializers/src/glTF/2.0/Extensions/EXT_mesh_gpu_instancing.ts ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EXT_mesh_gpu_instancing: () => (/* binding */ EXT_mesh_gpu_instancing)
/* harmony export */ });
/* harmony import */ var _glTFExporter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../glTFExporter */ "../../../dev/serializers/src/glTF/2.0/glTFExporter.ts");
/* harmony import */ var babylonjs_Meshes_mesh__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! babylonjs/Buffers/buffer */ "babylonjs/Maths/math.vector");
/* harmony import */ var babylonjs_Meshes_mesh__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(babylonjs_Meshes_mesh__WEBPACK_IMPORTED_MODULE_1__);





var NAME = "EXT_mesh_gpu_instancing";
/**
 * [Specification](https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Vendor/EXT_mesh_gpu_instancing/README.md)
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
var EXT_mesh_gpu_instancing = /** @class */ (function () {
    function EXT_mesh_gpu_instancing(exporter) {
        /** Name of this extension */
        this.name = NAME;
        /** Defines whether this extension is enabled */
        this.enabled = true;
        /** Defines whether this extension is required */
        this.required = false;
        this._wasUsed = false;
        this._exporter = exporter;
    }
    EXT_mesh_gpu_instancing.prototype.dispose = function () { };
    Object.defineProperty(EXT_mesh_gpu_instancing.prototype, "wasUsed", {
        /** @internal */
        get: function () {
            return this._wasUsed;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * After node is exported
     * @param context the GLTF context when loading the asset
     * @param node the node exported
     * @param babylonNode the corresponding babylon node
     * @param nodeMap map from babylon node id to node index
     * @param binaryWriter binary writer
     * @returns nullable promise, resolves with the node
     */
    EXT_mesh_gpu_instancing.prototype.postExportNodeAsync = function (context, node, babylonNode, nodeMap, binaryWriter) {
        var _this = this;
        return new Promise(function (resolve) {
            if (node && babylonNode instanceof babylonjs_Meshes_mesh__WEBPACK_IMPORTED_MODULE_1__.Mesh) {
                if (babylonNode.hasThinInstances && binaryWriter) {
                    _this._wasUsed = true;
                    var noTranslation = babylonjs_Meshes_mesh__WEBPACK_IMPORTED_MODULE_1__.Vector3.Zero();
                    var noRotation = babylonjs_Meshes_mesh__WEBPACK_IMPORTED_MODULE_1__.Quaternion.Identity();
                    var noScale = babylonjs_Meshes_mesh__WEBPACK_IMPORTED_MODULE_1__.Vector3.One();
                    // retrieve all the instance world matrix
                    var matrix = babylonNode.thinInstanceGetWorldMatrices();
                    var iwt = babylonjs_Meshes_mesh__WEBPACK_IMPORTED_MODULE_1__.TmpVectors.Vector3[2];
                    var iwr = babylonjs_Meshes_mesh__WEBPACK_IMPORTED_MODULE_1__.TmpVectors.Quaternion[1];
                    var iws = babylonjs_Meshes_mesh__WEBPACK_IMPORTED_MODULE_1__.TmpVectors.Vector3[3];
                    var hasAnyInstanceWorldTranslation = false;
                    var hasAnyInstanceWorldRotation = false;
                    var hasAnyInstanceWorldScale = false;
                    // prepare temp buffers
                    var translationBuffer = new Float32Array(babylonNode.thinInstanceCount * 3);
                    var rotationBuffer = new Float32Array(babylonNode.thinInstanceCount * 4);
                    var scaleBuffer = new Float32Array(babylonNode.thinInstanceCount * 3);
                    var i = 0;
                    for (var _i = 0, matrix_1 = matrix; _i < matrix_1.length; _i++) {
                        var m = matrix_1[_i];
                        m.decompose(iws, iwr, iwt);
                        // fill the temp buffer
                        translationBuffer.set(iwt.asArray(), i * 3);
                        rotationBuffer.set(iwr.normalize().asArray(), i * 4); // ensure the quaternion is normalized
                        scaleBuffer.set(iws.asArray(), i * 3);
                        // this is where we decide if there is any transformation
                        hasAnyInstanceWorldTranslation = hasAnyInstanceWorldTranslation || !iwt.equalsWithEpsilon(noTranslation);
                        hasAnyInstanceWorldRotation = hasAnyInstanceWorldRotation || !iwr.equalsWithEpsilon(noRotation);
                        hasAnyInstanceWorldScale = hasAnyInstanceWorldScale || !iws.equalsWithEpsilon(noScale);
                        i++;
                    }
                    var extension = {
                        attributes: {},
                    };
                    // do we need to write TRANSLATION ?
                    if (hasAnyInstanceWorldTranslation) {
                        extension.attributes["TRANSLATION"] = _this._buildAccessor(translationBuffer, "VEC3" /* AccessorType.VEC3 */, babylonNode.thinInstanceCount, binaryWriter, 5126 /* AccessorComponentType.FLOAT */);
                    }
                    // do we need to write ROTATION ?
                    if (hasAnyInstanceWorldRotation) {
                        var componentType = 5126 /* AccessorComponentType.FLOAT */; // we decided to stay on FLOAT for now see https://github.com/BabylonJS/Babylon.js/pull/12495
                        extension.attributes["ROTATION"] = _this._buildAccessor(rotationBuffer, "VEC4" /* AccessorType.VEC4 */, babylonNode.thinInstanceCount, binaryWriter, componentType);
                    }
                    // do we need to write SCALE ?
                    if (hasAnyInstanceWorldScale) {
                        extension.attributes["SCALE"] = _this._buildAccessor(scaleBuffer, "VEC3" /* AccessorType.VEC3 */, babylonNode.thinInstanceCount, binaryWriter, 5126 /* AccessorComponentType.FLOAT */);
                    }
                    /* eslint-enable @typescript-eslint/naming-convention*/
                    node.extensions = node.extensions || {};
                    node.extensions[NAME] = extension;
                }
            }
            resolve(node);
        });
    };
    EXT_mesh_gpu_instancing.prototype._buildAccessor = function (buffer, type, count, binaryWriter, componentType) {
        // write the buffer
        var bufferOffset = binaryWriter.getByteOffset();
        switch (componentType) {
            case 5126 /* AccessorComponentType.FLOAT */: {
                for (var i = 0; i != buffer.length; i++) {
                    binaryWriter.setFloat32(buffer[i]);
                }
                break;
            }
            case 5120 /* AccessorComponentType.BYTE */: {
                for (var i = 0; i != buffer.length; i++) {
                    binaryWriter.setByte(buffer[i] * 127);
                }
                break;
            }
            case 5122 /* AccessorComponentType.SHORT */: {
                for (var i = 0; i != buffer.length; i++) {
                    binaryWriter.setInt16(buffer[i] * 32767);
                }
                break;
            }
        }
        // build the buffer view
        var bv = { buffer: 0, byteOffset: bufferOffset, byteLength: buffer.length * babylonjs_Meshes_mesh__WEBPACK_IMPORTED_MODULE_1__.VertexBuffer.GetTypeByteLength(componentType) };
        var bufferViewIndex = this._exporter._bufferViews.length;
        this._exporter._bufferViews.push(bv);
        // finally build the accessor
        var accessorIndex = this._exporter._accessors.length;
        var accessor = {
            bufferView: bufferViewIndex,
            componentType: componentType,
            count: count,
            type: type,
            normalized: componentType == 5120 /* AccessorComponentType.BYTE */ || componentType == 5122 /* AccessorComponentType.SHORT */,
        };
        this._exporter._accessors.push(accessor);
        return accessorIndex;
    };
    return EXT_mesh_gpu_instancing;
}());

// eslint-disable-next-line @typescript-eslint/no-unused-vars
_glTFExporter__WEBPACK_IMPORTED_MODULE_0__._Exporter.RegisterExtension(NAME, function (exporter) { return new EXT_mesh_gpu_instancing(exporter); });


/***/ }),

/***/ "../../../dev/serializers/src/glTF/2.0/Extensions/KHR_lights_punctual.ts":
/*!*******************************************************************************!*\
  !*** ../../../dev/serializers/src/glTF/2.0/Extensions/KHR_lights_punctual.ts ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KHR_lights_punctual: () => (/* binding */ KHR_lights_punctual)
/* harmony export */ });
/* harmony import */ var babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! babylonjs/Misc/logger */ "babylonjs/Maths/math.vector");
/* harmony import */ var babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _glTFExporter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../glTFExporter */ "../../../dev/serializers/src/glTF/2.0/glTFExporter.ts");






var NAME = "KHR_lights_punctual";
/**
 * [Specification](https://github.com/KhronosGroup/glTF/blob/master/extensions/2.0/Khronos/KHR_lights_punctual/README.md)
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
var KHR_lights_punctual = /** @class */ (function () {
    /**
     * @internal
     */
    function KHR_lights_punctual(exporter) {
        /** The name of this extension. */
        this.name = NAME;
        /** Defines whether this extension is enabled. */
        this.enabled = true;
        /** Defines whether this extension is required */
        this.required = false;
        this._exporter = exporter;
    }
    /** @internal */
    KHR_lights_punctual.prototype.dispose = function () {
        this._lights = null;
    };
    Object.defineProperty(KHR_lights_punctual.prototype, "wasUsed", {
        /** @internal */
        get: function () {
            return !!this._lights;
        },
        enumerable: false,
        configurable: true
    });
    /** @internal */
    KHR_lights_punctual.prototype.onExporting = function () {
        this._exporter._glTF.extensions[NAME] = this._lights;
    };
    /**
     * Define this method to modify the default behavior when exporting a node
     * @param context The context when exporting the node
     * @param node glTF node
     * @param babylonNode BabylonJS node
     * @param nodeMap Node mapping of unique id to glTF node index
     * @returns nullable INode promise
     */
    KHR_lights_punctual.prototype.postExportNodeAsync = function (context, node, babylonNode, nodeMap) {
        var _this = this;
        return new Promise(function (resolve) {
            if (node && babylonNode instanceof babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.ShadowLight) {
                var light = void 0;
                var lightType = babylonNode.getTypeID() == babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Light.LIGHTTYPEID_POINTLIGHT
                    ? "point" /* KHRLightsPunctual_LightType.POINT */
                    : babylonNode.getTypeID() == babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Light.LIGHTTYPEID_DIRECTIONALLIGHT
                        ? "directional" /* KHRLightsPunctual_LightType.DIRECTIONAL */
                        : babylonNode.getTypeID() == babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Light.LIGHTTYPEID_SPOTLIGHT
                            ? "spot" /* KHRLightsPunctual_LightType.SPOT */
                            : null;
                if (lightType == null) {
                    babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Logger.Warn("".concat(context, ": Light ").concat(babylonNode.name, " is not supported in ").concat(NAME));
                }
                else {
                    if (!babylonNode.position.equalsToFloats(0, 0, 0)) {
                        node.translation = babylonNode.position.asArray();
                    }
                    if (lightType !== "point" /* KHRLightsPunctual_LightType.POINT */) {
                        var localAxis = babylonNode.direction;
                        var yaw = -Math.atan2(localAxis.z, localAxis.x) + Math.PI / 2;
                        var len = Math.sqrt(localAxis.x * localAxis.x + localAxis.z * localAxis.z);
                        var pitch = -Math.atan2(localAxis.y, len);
                        var lightRotationQuaternion = babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Quaternion.RotationYawPitchRoll(yaw + Math.PI, pitch, 0);
                        if (!babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Quaternion.IsIdentity(lightRotationQuaternion)) {
                            node.rotation = lightRotationQuaternion.asArray();
                        }
                    }
                    if (babylonNode.falloffType !== babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Light.FALLOFF_GLTF) {
                        babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Logger.Warn("".concat(context, ": Light falloff for ").concat(babylonNode.name, " does not match the ").concat(NAME, " specification!"));
                    }
                    light = {
                        type: lightType,
                    };
                    if (!babylonNode.diffuse.equals(babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Color3.White())) {
                        light.color = babylonNode.diffuse.asArray();
                    }
                    if (babylonNode.intensity !== 1.0) {
                        light.intensity = babylonNode.intensity;
                    }
                    if (babylonNode.range !== Number.MAX_VALUE) {
                        light.range = babylonNode.range;
                    }
                    if (lightType === "spot" /* KHRLightsPunctual_LightType.SPOT */) {
                        var babylonSpotLight = babylonNode;
                        if (babylonSpotLight.angle !== Math.PI / 2.0) {
                            if (light.spot == null) {
                                light.spot = {};
                            }
                            light.spot.outerConeAngle = babylonSpotLight.angle / 2.0;
                        }
                        if (babylonSpotLight.innerAngle !== 0) {
                            if (light.spot == null) {
                                light.spot = {};
                            }
                            light.spot.innerConeAngle = babylonSpotLight.innerAngle / 2.0;
                        }
                    }
                    _this._lights || (_this._lights = {
                        lights: [],
                    });
                    _this._lights.lights.push(light);
                    var lightReference = {
                        light: _this._lights.lights.length - 1,
                    };
                    // Avoid duplicating the Light's parent node if possible.
                    var parentBabylonNode = babylonNode.parent;
                    if (parentBabylonNode && parentBabylonNode.getChildren().length == 1) {
                        var parentNode = _this._exporter._nodes[nodeMap[parentBabylonNode.uniqueId]];
                        if (parentNode) {
                            var parentTranslation = babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Vector3.FromArrayToRef(parentNode.translation || [0, 0, 0], 0, babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.TmpVectors.Vector3[0]);
                            var parentRotation = babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Quaternion.FromArrayToRef(parentNode.rotation || [0, 0, 0, 1], 0, babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.TmpVectors.Quaternion[0]);
                            var parentScale = babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Vector3.FromArrayToRef(parentNode.scale || [1, 1, 1], 0, babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.TmpVectors.Vector3[1]);
                            var parentMatrix = babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Matrix.ComposeToRef(parentScale, parentRotation, parentTranslation, babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.TmpVectors.Matrix[0]);
                            var translation = babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Vector3.FromArrayToRef(node.translation || [0, 0, 0], 0, babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.TmpVectors.Vector3[2]);
                            var rotation = babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Quaternion.FromArrayToRef(node.rotation || [0, 0, 0, 1], 0, babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.TmpVectors.Quaternion[1]);
                            var matrix = babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Matrix.ComposeToRef(babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Vector3.OneReadOnly, rotation, translation, babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.TmpVectors.Matrix[1]);
                            parentMatrix.multiplyToRef(matrix, matrix);
                            matrix.decompose(parentScale, parentRotation, parentTranslation);
                            if (parentTranslation.equalsToFloats(0, 0, 0)) {
                                delete parentNode.translation;
                            }
                            else {
                                parentNode.translation = parentTranslation.asArray();
                            }
                            if (babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Quaternion.IsIdentity(parentRotation)) {
                                delete parentNode.rotation;
                            }
                            else {
                                parentNode.rotation = parentRotation.asArray();
                            }
                            if (parentScale.equalsToFloats(1, 1, 1)) {
                                delete parentNode.scale;
                            }
                            else {
                                parentNode.scale = parentScale.asArray();
                            }
                            parentNode.extensions || (parentNode.extensions = {});
                            parentNode.extensions[NAME] = lightReference;
                            // Do not export the original node
                            resolve(null);
                            return;
                        }
                    }
                    node.extensions || (node.extensions = {});
                    node.extensions[NAME] = lightReference;
                }
            }
            resolve(node);
        });
    };
    return KHR_lights_punctual;
}());

_glTFExporter__WEBPACK_IMPORTED_MODULE_1__._Exporter.RegisterExtension(NAME, function (exporter) { return new KHR_lights_punctual(exporter); });


/***/ }),

/***/ "../../../dev/serializers/src/glTF/2.0/Extensions/KHR_materials_anisotropy.ts":
/*!************************************************************************************!*\
  !*** ../../../dev/serializers/src/glTF/2.0/Extensions/KHR_materials_anisotropy.ts ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KHR_materials_anisotropy: () => (/* binding */ KHR_materials_anisotropy)
/* harmony export */ });
/* harmony import */ var _glTFExporter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../glTFExporter */ "../../../dev/serializers/src/glTF/2.0/glTFExporter.ts");
/* harmony import */ var babylonjs_Materials_PBR_pbrBaseMaterial__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! babylonjs/Materials/PBR/pbrBaseMaterial */ "babylonjs/Maths/math.vector");
/* harmony import */ var babylonjs_Materials_PBR_pbrBaseMaterial__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(babylonjs_Materials_PBR_pbrBaseMaterial__WEBPACK_IMPORTED_MODULE_1__);


var NAME = "KHR_materials_anisotropy";
/**
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
var KHR_materials_anisotropy = /** @class */ (function () {
    function KHR_materials_anisotropy(exporter) {
        /** Name of this extension */
        this.name = NAME;
        /** Defines whether this extension is enabled */
        this.enabled = true;
        /** Defines whether this extension is required */
        this.required = false;
        this._wasUsed = false;
        this._exporter = exporter;
    }
    KHR_materials_anisotropy.prototype.dispose = function () { };
    Object.defineProperty(KHR_materials_anisotropy.prototype, "wasUsed", {
        /** @internal */
        get: function () {
            return this._wasUsed;
        },
        enumerable: false,
        configurable: true
    });
    KHR_materials_anisotropy.prototype.postExportMaterialAdditionalTextures = function (context, node, babylonMaterial) {
        var additionalTextures = [];
        if (babylonMaterial instanceof babylonjs_Materials_PBR_pbrBaseMaterial__WEBPACK_IMPORTED_MODULE_1__.PBRBaseMaterial) {
            if (babylonMaterial.anisotropy.isEnabled && !babylonMaterial.anisotropy.legacy) {
                if (babylonMaterial.anisotropy.texture) {
                    additionalTextures.push(babylonMaterial.anisotropy.texture);
                }
                return additionalTextures;
            }
        }
        return [];
    };
    KHR_materials_anisotropy.prototype.postExportMaterialAsync = function (context, node, babylonMaterial) {
        var _this = this;
        return new Promise(function (resolve) {
            if (babylonMaterial instanceof babylonjs_Materials_PBR_pbrBaseMaterial__WEBPACK_IMPORTED_MODULE_1__.PBRBaseMaterial) {
                if (!babylonMaterial.anisotropy.isEnabled || babylonMaterial.anisotropy.legacy) {
                    resolve(node);
                    return;
                }
                _this._wasUsed = true;
                node.extensions = node.extensions || {};
                var anisotropyTextureInfo = _this._exporter._glTFMaterialExporter._getTextureInfo(babylonMaterial.anisotropy.texture);
                var anisotropyInfo_1 = {
                    anisotropyStrength: babylonMaterial.anisotropy.intensity,
                    anisotropyRotation: babylonMaterial.anisotropy.angle,
                    anisotropyTexture: anisotropyTextureInfo !== null && anisotropyTextureInfo !== void 0 ? anisotropyTextureInfo : undefined,
                    hasTextures: function () {
                        return anisotropyInfo_1.anisotropyTexture !== null;
                    },
                };
                node.extensions[NAME] = anisotropyInfo_1;
            }
            resolve(node);
        });
    };
    return KHR_materials_anisotropy;
}());

_glTFExporter__WEBPACK_IMPORTED_MODULE_0__._Exporter.RegisterExtension(NAME, function (exporter) { return new KHR_materials_anisotropy(exporter); });


/***/ }),

/***/ "../../../dev/serializers/src/glTF/2.0/Extensions/KHR_materials_clearcoat.ts":
/*!***********************************************************************************!*\
  !*** ../../../dev/serializers/src/glTF/2.0/Extensions/KHR_materials_clearcoat.ts ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KHR_materials_clearcoat: () => (/* binding */ KHR_materials_clearcoat)
/* harmony export */ });
/* harmony import */ var _glTFExporter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../glTFExporter */ "../../../dev/serializers/src/glTF/2.0/glTFExporter.ts");
/* harmony import */ var babylonjs_Materials_PBR_pbrBaseMaterial__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! babylonjs/Misc/tools */ "babylonjs/Maths/math.vector");
/* harmony import */ var babylonjs_Materials_PBR_pbrBaseMaterial__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(babylonjs_Materials_PBR_pbrBaseMaterial__WEBPACK_IMPORTED_MODULE_1__);



var NAME = "KHR_materials_clearcoat";
/**
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
var KHR_materials_clearcoat = /** @class */ (function () {
    function KHR_materials_clearcoat(exporter) {
        /** Name of this extension */
        this.name = NAME;
        /** Defines whether this extension is enabled */
        this.enabled = true;
        /** Defines whether this extension is required */
        this.required = false;
        this._wasUsed = false;
        this._exporter = exporter;
    }
    KHR_materials_clearcoat.prototype.dispose = function () { };
    Object.defineProperty(KHR_materials_clearcoat.prototype, "wasUsed", {
        /** @internal */
        get: function () {
            return this._wasUsed;
        },
        enumerable: false,
        configurable: true
    });
    KHR_materials_clearcoat.prototype.postExportMaterialAdditionalTextures = function (context, node, babylonMaterial) {
        var additionalTextures = [];
        if (babylonMaterial instanceof babylonjs_Materials_PBR_pbrBaseMaterial__WEBPACK_IMPORTED_MODULE_1__.PBRBaseMaterial) {
            if (babylonMaterial.clearCoat.isEnabled) {
                if (babylonMaterial.clearCoat.texture) {
                    additionalTextures.push(babylonMaterial.clearCoat.texture);
                }
                if (!babylonMaterial.clearCoat.useRoughnessFromMainTexture && babylonMaterial.clearCoat.textureRoughness) {
                    additionalTextures.push(babylonMaterial.clearCoat.textureRoughness);
                }
                if (babylonMaterial.clearCoat.bumpTexture) {
                    additionalTextures.push(babylonMaterial.clearCoat.bumpTexture);
                }
                return additionalTextures;
            }
        }
        return [];
    };
    KHR_materials_clearcoat.prototype.postExportMaterialAsync = function (context, node, babylonMaterial) {
        var _this = this;
        return new Promise(function (resolve) {
            if (babylonMaterial instanceof babylonjs_Materials_PBR_pbrBaseMaterial__WEBPACK_IMPORTED_MODULE_1__.PBRBaseMaterial) {
                if (!babylonMaterial.clearCoat.isEnabled) {
                    resolve(node);
                    return;
                }
                _this._wasUsed = true;
                node.extensions = node.extensions || {};
                var clearCoatTextureInfo = _this._exporter._glTFMaterialExporter._getTextureInfo(babylonMaterial.clearCoat.texture);
                var clearCoatTextureRoughnessInfo = void 0;
                if (babylonMaterial.clearCoat.useRoughnessFromMainTexture) {
                    clearCoatTextureRoughnessInfo = _this._exporter._glTFMaterialExporter._getTextureInfo(babylonMaterial.clearCoat.texture);
                }
                else {
                    clearCoatTextureRoughnessInfo = _this._exporter._glTFMaterialExporter._getTextureInfo(babylonMaterial.clearCoat.textureRoughness);
                }
                if (babylonMaterial.clearCoat.isTintEnabled) {
                    babylonjs_Materials_PBR_pbrBaseMaterial__WEBPACK_IMPORTED_MODULE_1__.Tools.Warn("Clear Color tint is not supported for glTF export. Ignoring for: ".concat(babylonMaterial.name));
                }
                if (babylonMaterial.clearCoat.remapF0OnInterfaceChange) {
                    babylonjs_Materials_PBR_pbrBaseMaterial__WEBPACK_IMPORTED_MODULE_1__.Tools.Warn("Clear Color F0 remapping is not supported for glTF export. Ignoring for: ".concat(babylonMaterial.name));
                }
                var clearCoatNormalTextureInfo = _this._exporter._glTFMaterialExporter._getTextureInfo(babylonMaterial.clearCoat.bumpTexture);
                var clearCoatInfo_1 = {
                    clearcoatFactor: babylonMaterial.clearCoat.intensity,
                    clearcoatTexture: clearCoatTextureInfo !== null && clearCoatTextureInfo !== void 0 ? clearCoatTextureInfo : undefined,
                    clearcoatRoughnessFactor: babylonMaterial.clearCoat.roughness,
                    clearcoatRoughnessTexture: clearCoatTextureRoughnessInfo !== null && clearCoatTextureRoughnessInfo !== void 0 ? clearCoatTextureRoughnessInfo : undefined,
                    clearcoatNormalTexture: clearCoatNormalTextureInfo !== null && clearCoatNormalTextureInfo !== void 0 ? clearCoatNormalTextureInfo : undefined,
                    hasTextures: function () {
                        return clearCoatInfo_1.clearcoatTexture !== null || clearCoatInfo_1.clearcoatRoughnessTexture !== null || clearCoatInfo_1.clearcoatRoughnessTexture !== null;
                    },
                };
                node.extensions[NAME] = clearCoatInfo_1;
            }
            resolve(node);
        });
    };
    return KHR_materials_clearcoat;
}());

_glTFExporter__WEBPACK_IMPORTED_MODULE_0__._Exporter.RegisterExtension(NAME, function (exporter) { return new KHR_materials_clearcoat(exporter); });


/***/ }),

/***/ "../../../dev/serializers/src/glTF/2.0/Extensions/KHR_materials_diffuse_transmission.ts":
/*!**********************************************************************************************!*\
  !*** ../../../dev/serializers/src/glTF/2.0/Extensions/KHR_materials_diffuse_transmission.ts ***!
  \**********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KHR_materials_diffuse_transmission: () => (/* binding */ KHR_materials_diffuse_transmission)
/* harmony export */ });
/* harmony import */ var _glTFExporter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../glTFExporter */ "../../../dev/serializers/src/glTF/2.0/glTFExporter.ts");
/* harmony import */ var babylonjs_Materials_PBR_pbrMaterial__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! babylonjs/Materials/PBR/pbrMaterial */ "babylonjs/Maths/math.vector");
/* harmony import */ var babylonjs_Materials_PBR_pbrMaterial__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(babylonjs_Materials_PBR_pbrMaterial__WEBPACK_IMPORTED_MODULE_1__);


var NAME = "KHR_materials_diffuse_transmission";
/**
 * [Proposed Specification](https://github.com/KhronosGroup/glTF/pull/1825)
 * !!! Experimental Extension Subject to Changes !!!
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
var KHR_materials_diffuse_transmission = /** @class */ (function () {
    function KHR_materials_diffuse_transmission(exporter) {
        /** Name of this extension */
        this.name = NAME;
        /** Defines whether this extension is enabled */
        this.enabled = true;
        /** Defines whether this extension is required */
        this.required = false;
        this._wasUsed = false;
        this._exporter = exporter;
    }
    KHR_materials_diffuse_transmission.prototype.dispose = function () { };
    Object.defineProperty(KHR_materials_diffuse_transmission.prototype, "wasUsed", {
        /** @internal */
        get: function () {
            return this._wasUsed;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * After exporting a material, deal with additional textures
     * @param context GLTF context of the material
     * @param node exported GLTF node
     * @param babylonMaterial corresponding babylon material
     * @returns array of additional textures to export
     */
    KHR_materials_diffuse_transmission.prototype.postExportMaterialAdditionalTextures = function (context, node, babylonMaterial) {
        var additionalTextures = [];
        if (babylonMaterial instanceof babylonjs_Materials_PBR_pbrMaterial__WEBPACK_IMPORTED_MODULE_1__.PBRMaterial) {
            if (this._isExtensionEnabled(babylonMaterial)) {
                if (babylonMaterial.subSurface.thicknessTexture) {
                    additionalTextures.push(babylonMaterial.subSurface.thicknessTexture);
                }
                return additionalTextures;
            }
        }
        return additionalTextures;
    };
    KHR_materials_diffuse_transmission.prototype._isExtensionEnabled = function (mat) {
        // This extension must not be used on a material that also uses KHR_materials_unlit
        if (mat.unlit) {
            return false;
        }
        var subs = mat.subSurface;
        if (!subs.isTranslucencyEnabled) {
            return false;
        }
        return (!mat.unlit &&
            !subs.useAlbedoToTintTranslucency &&
            subs.useGltfStyleTextures &&
            subs.volumeIndexOfRefraction === 1 &&
            subs.minimumThickness === 0 &&
            subs.maximumThickness === 0);
    };
    KHR_materials_diffuse_transmission.prototype._hasTexturesExtension = function (mat) {
        return mat.subSurface.translucencyIntensityTexture != null || mat.subSurface.translucencyColorTexture != null;
    };
    /**
     * After exporting a material
     * @param context GLTF context of the material
     * @param node exported GLTF node
     * @param babylonMaterial corresponding babylon material
     * @returns promise that resolves with the updated node
     */
    KHR_materials_diffuse_transmission.prototype.postExportMaterialAsync = function (context, node, babylonMaterial) {
        var _this = this;
        return new Promise(function (resolve) {
            var _a, _b;
            if (babylonMaterial instanceof babylonjs_Materials_PBR_pbrMaterial__WEBPACK_IMPORTED_MODULE_1__.PBRMaterial && _this._isExtensionEnabled(babylonMaterial)) {
                _this._wasUsed = true;
                var subs = babylonMaterial.subSurface;
                var diffuseTransmissionFactor = subs.translucencyIntensity == 1 ? undefined : subs.translucencyIntensity;
                var diffuseTransmissionTexture = (_a = _this._exporter._glTFMaterialExporter._getTextureInfo(subs.translucencyIntensityTexture)) !== null && _a !== void 0 ? _a : undefined;
                var diffuseTransmissionColorFactor = !subs.translucencyColor || subs.translucencyColor.equalsFloats(1.0, 1.0, 1.0) ? undefined : subs.translucencyColor.asArray();
                var diffuseTransmissionColorTexture = (_b = _this._exporter._glTFMaterialExporter._getTextureInfo(subs.translucencyColorTexture)) !== null && _b !== void 0 ? _b : undefined;
                var diffuseTransmissionInfo = {
                    diffuseTransmissionFactor: diffuseTransmissionFactor,
                    diffuseTransmissionTexture: diffuseTransmissionTexture,
                    diffuseTransmissionColorFactor: diffuseTransmissionColorFactor,
                    diffuseTransmissionColorTexture: diffuseTransmissionColorTexture,
                    hasTextures: function () {
                        return _this._hasTexturesExtension(babylonMaterial);
                    },
                };
                node.extensions = node.extensions || {};
                node.extensions[NAME] = diffuseTransmissionInfo;
            }
            resolve(node);
        });
    };
    return KHR_materials_diffuse_transmission;
}());

_glTFExporter__WEBPACK_IMPORTED_MODULE_0__._Exporter.RegisterExtension(NAME, function (exporter) { return new KHR_materials_diffuse_transmission(exporter); });


/***/ }),

/***/ "../../../dev/serializers/src/glTF/2.0/Extensions/KHR_materials_dispersion.ts":
/*!************************************************************************************!*\
  !*** ../../../dev/serializers/src/glTF/2.0/Extensions/KHR_materials_dispersion.ts ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KHR_materials_dispersion: () => (/* binding */ KHR_materials_dispersion)
/* harmony export */ });
/* harmony import */ var _glTFExporter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../glTFExporter */ "../../../dev/serializers/src/glTF/2.0/glTFExporter.ts");
/* harmony import */ var babylonjs_Materials_PBR_pbrMaterial__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! babylonjs/Materials/PBR/pbrMaterial */ "babylonjs/Maths/math.vector");
/* harmony import */ var babylonjs_Materials_PBR_pbrMaterial__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(babylonjs_Materials_PBR_pbrMaterial__WEBPACK_IMPORTED_MODULE_1__);


var NAME = "KHR_materials_dispersion";
/**
 * [Specification](https://github.com/KhronosGroup/glTF/blob/87bd64a7f5e23c84b6aef2e6082069583ed0ddb4/extensions/2.0/Khronos/KHR_materials_dispersion/README.md)
 * @experimental
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
var KHR_materials_dispersion = /** @class */ (function () {
    /** Constructor */
    function KHR_materials_dispersion() {
        /** Name of this extension */
        this.name = NAME;
        /** Defines whether this extension is enabled */
        this.enabled = true;
        /** Defines whether this extension is required */
        this.required = false;
        this._wasUsed = false;
    }
    /** Dispose */
    KHR_materials_dispersion.prototype.dispose = function () { };
    Object.defineProperty(KHR_materials_dispersion.prototype, "wasUsed", {
        /** @internal */
        get: function () {
            return this._wasUsed;
        },
        enumerable: false,
        configurable: true
    });
    KHR_materials_dispersion.prototype._isExtensionEnabled = function (mat) {
        // This extension must not be used on a material that also uses KHR_materials_unlit
        if (mat.unlit) {
            return false;
        }
        var subs = mat.subSurface;
        // this extension requires refraction to be enabled.
        if (!subs.isRefractionEnabled && !subs.isDispersionEnabled) {
            return false;
        }
        return true;
    };
    /**
     * After exporting a material
     * @param context GLTF context of the material
     * @param node exported GLTF node
     * @param babylonMaterial corresponding babylon material
     * @returns promise, resolves with the material
     */
    KHR_materials_dispersion.prototype.postExportMaterialAsync = function (context, node, babylonMaterial) {
        var _this = this;
        return new Promise(function (resolve) {
            if (babylonMaterial instanceof babylonjs_Materials_PBR_pbrMaterial__WEBPACK_IMPORTED_MODULE_1__.PBRMaterial && _this._isExtensionEnabled(babylonMaterial)) {
                _this._wasUsed = true;
                var subs = babylonMaterial.subSurface;
                var dispersion = subs.dispersion;
                var dispersionInfo = {
                    dispersion: dispersion,
                };
                node.extensions = node.extensions || {};
                node.extensions[NAME] = dispersionInfo;
            }
            resolve(node);
        });
    };
    return KHR_materials_dispersion;
}());

_glTFExporter__WEBPACK_IMPORTED_MODULE_0__._Exporter.RegisterExtension(NAME, function () { return new KHR_materials_dispersion(); });


/***/ }),

/***/ "../../../dev/serializers/src/glTF/2.0/Extensions/KHR_materials_emissive_strength.ts":
/*!*******************************************************************************************!*\
  !*** ../../../dev/serializers/src/glTF/2.0/Extensions/KHR_materials_emissive_strength.ts ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KHR_materials_emissive_strength: () => (/* binding */ KHR_materials_emissive_strength)
/* harmony export */ });
/* harmony import */ var _glTFExporter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../glTFExporter */ "../../../dev/serializers/src/glTF/2.0/glTFExporter.ts");
/* harmony import */ var babylonjs_Materials_PBR_pbrMaterial__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! babylonjs/Materials/PBR/pbrMaterial */ "babylonjs/Maths/math.vector");
/* harmony import */ var babylonjs_Materials_PBR_pbrMaterial__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(babylonjs_Materials_PBR_pbrMaterial__WEBPACK_IMPORTED_MODULE_1__);


var NAME = "KHR_materials_emissive_strength";
/**
 * [Specification](https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_materials_emissive_strength/README.md)
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
var KHR_materials_emissive_strength = /** @class */ (function () {
    function KHR_materials_emissive_strength() {
        /** Name of this extension */
        this.name = NAME;
        /** Defines whether this extension is enabled */
        this.enabled = true;
        /** Defines whether this extension is required */
        this.required = false;
        this._wasUsed = false;
    }
    /** Dispose */
    KHR_materials_emissive_strength.prototype.dispose = function () { };
    Object.defineProperty(KHR_materials_emissive_strength.prototype, "wasUsed", {
        /** @internal */
        get: function () {
            return this._wasUsed;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * After exporting a material
     * @param context GLTF context of the material
     * @param node exported GLTF node
     * @param babylonMaterial corresponding babylon material
     * @returns promise, resolves with the material
     */
    KHR_materials_emissive_strength.prototype.postExportMaterialAsync = function (context, node, babylonMaterial) {
        var _this = this;
        return new Promise(function (resolve) {
            if (!(babylonMaterial instanceof babylonjs_Materials_PBR_pbrMaterial__WEBPACK_IMPORTED_MODULE_1__.PBRMaterial)) {
                return resolve(node);
            }
            var emissiveColor = babylonMaterial.emissiveColor.asArray();
            var tempEmissiveStrength = Math.max.apply(Math, emissiveColor);
            if (tempEmissiveStrength > 1) {
                _this._wasUsed = true;
                node.extensions || (node.extensions = {});
                var emissiveStrengthInfo = {
                    emissiveStrength: tempEmissiveStrength,
                };
                // Normalize each value of the emissive factor to have a max value of 1
                var newEmissiveFactor = babylonMaterial.emissiveColor.scale(1 / emissiveStrengthInfo.emissiveStrength);
                node.emissiveFactor = newEmissiveFactor.asArray();
                node.extensions[NAME] = emissiveStrengthInfo;
            }
            return resolve(node);
        });
    };
    return KHR_materials_emissive_strength;
}());

_glTFExporter__WEBPACK_IMPORTED_MODULE_0__._Exporter.RegisterExtension(NAME, function (exporter) { return new KHR_materials_emissive_strength(); });


/***/ }),

/***/ "../../../dev/serializers/src/glTF/2.0/Extensions/KHR_materials_ior.ts":
/*!*****************************************************************************!*\
  !*** ../../../dev/serializers/src/glTF/2.0/Extensions/KHR_materials_ior.ts ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KHR_materials_ior: () => (/* binding */ KHR_materials_ior)
/* harmony export */ });
/* harmony import */ var _glTFExporter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../glTFExporter */ "../../../dev/serializers/src/glTF/2.0/glTFExporter.ts");
/* harmony import */ var babylonjs_Materials_PBR_pbrMaterial__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! babylonjs/Materials/PBR/pbrMaterial */ "babylonjs/Maths/math.vector");
/* harmony import */ var babylonjs_Materials_PBR_pbrMaterial__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(babylonjs_Materials_PBR_pbrMaterial__WEBPACK_IMPORTED_MODULE_1__);


var NAME = "KHR_materials_ior";
/**
 * [Specification](https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_materials_ior/README.md)
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
var KHR_materials_ior = /** @class */ (function () {
    function KHR_materials_ior() {
        /** Name of this extension */
        this.name = NAME;
        /** Defines whether this extension is enabled */
        this.enabled = true;
        /** Defines whether this extension is required */
        this.required = false;
        this._wasUsed = false;
    }
    /** Dispose */
    KHR_materials_ior.prototype.dispose = function () { };
    Object.defineProperty(KHR_materials_ior.prototype, "wasUsed", {
        /** @internal */
        get: function () {
            return this._wasUsed;
        },
        enumerable: false,
        configurable: true
    });
    KHR_materials_ior.prototype._isExtensionEnabled = function (mat) {
        // This extension must not be used on a material that also uses KHR_materials_unlit
        if (mat.unlit) {
            return false;
        }
        return mat.indexOfRefraction != undefined && mat.indexOfRefraction != 1.5; // 1.5 is normative default value.
    };
    /**
     * After exporting a material
     * @param context GLTF context of the material
     * @param node exported GLTF node
     * @param babylonMaterial corresponding babylon material
     * @returns promise, resolves with the material
     */
    KHR_materials_ior.prototype.postExportMaterialAsync = function (context, node, babylonMaterial) {
        var _this = this;
        return new Promise(function (resolve) {
            if (babylonMaterial instanceof babylonjs_Materials_PBR_pbrMaterial__WEBPACK_IMPORTED_MODULE_1__.PBRMaterial && _this._isExtensionEnabled(babylonMaterial)) {
                _this._wasUsed = true;
                var iorInfo = {
                    ior: babylonMaterial.indexOfRefraction,
                };
                node.extensions = node.extensions || {};
                node.extensions[NAME] = iorInfo;
            }
            resolve(node);
        });
    };
    return KHR_materials_ior;
}());

// eslint-disable-next-line @typescript-eslint/no-unused-vars
_glTFExporter__WEBPACK_IMPORTED_MODULE_0__._Exporter.RegisterExtension(NAME, function (exporter) { return new KHR_materials_ior(); });


/***/ }),

/***/ "../../../dev/serializers/src/glTF/2.0/Extensions/KHR_materials_iridescence.ts":
/*!*************************************************************************************!*\
  !*** ../../../dev/serializers/src/glTF/2.0/Extensions/KHR_materials_iridescence.ts ***!
  \*************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KHR_materials_iridescence: () => (/* binding */ KHR_materials_iridescence)
/* harmony export */ });
/* harmony import */ var _glTFExporter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../glTFExporter */ "../../../dev/serializers/src/glTF/2.0/glTFExporter.ts");
/* harmony import */ var babylonjs_Materials_PBR_pbrBaseMaterial__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! babylonjs/Materials/PBR/pbrBaseMaterial */ "babylonjs/Maths/math.vector");
/* harmony import */ var babylonjs_Materials_PBR_pbrBaseMaterial__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(babylonjs_Materials_PBR_pbrBaseMaterial__WEBPACK_IMPORTED_MODULE_1__);


var NAME = "KHR_materials_iridescence";
/**
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
var KHR_materials_iridescence = /** @class */ (function () {
    function KHR_materials_iridescence(exporter) {
        /** Name of this extension */
        this.name = NAME;
        /** Defines whether this extension is enabled */
        this.enabled = true;
        /** Defines whether this extension is required */
        this.required = false;
        this._wasUsed = false;
        this._exporter = exporter;
    }
    KHR_materials_iridescence.prototype.dispose = function () { };
    Object.defineProperty(KHR_materials_iridescence.prototype, "wasUsed", {
        /** @internal */
        get: function () {
            return this._wasUsed;
        },
        enumerable: false,
        configurable: true
    });
    KHR_materials_iridescence.prototype.postExportMaterialAdditionalTextures = function (context, node, babylonMaterial) {
        var additionalTextures = [];
        if (babylonMaterial instanceof babylonjs_Materials_PBR_pbrBaseMaterial__WEBPACK_IMPORTED_MODULE_1__.PBRBaseMaterial) {
            if (babylonMaterial.iridescence.isEnabled) {
                if (babylonMaterial.iridescence.texture) {
                    additionalTextures.push(babylonMaterial.iridescence.texture);
                }
                if (babylonMaterial.iridescence.thicknessTexture && babylonMaterial.iridescence.thicknessTexture !== babylonMaterial.iridescence.texture) {
                    additionalTextures.push(babylonMaterial.iridescence.thicknessTexture);
                }
                return additionalTextures;
            }
        }
        return [];
    };
    KHR_materials_iridescence.prototype.postExportMaterialAsync = function (context, node, babylonMaterial) {
        var _this = this;
        return new Promise(function (resolve) {
            if (babylonMaterial instanceof babylonjs_Materials_PBR_pbrBaseMaterial__WEBPACK_IMPORTED_MODULE_1__.PBRBaseMaterial) {
                if (!babylonMaterial.iridescence.isEnabled) {
                    resolve(node);
                    return;
                }
                _this._wasUsed = true;
                node.extensions = node.extensions || {};
                var iridescenceTextureInfo = _this._exporter._glTFMaterialExporter._getTextureInfo(babylonMaterial.iridescence.texture);
                var iridescenceThicknessTextureInfo = _this._exporter._glTFMaterialExporter._getTextureInfo(babylonMaterial.iridescence.thicknessTexture);
                var iridescenceInfo_1 = {
                    iridescenceFactor: babylonMaterial.iridescence.intensity,
                    iridescenceIor: babylonMaterial.iridescence.indexOfRefraction,
                    iridescenceThicknessMinimum: babylonMaterial.iridescence.minimumThickness,
                    iridescenceThicknessMaximum: babylonMaterial.iridescence.maximumThickness,
                    iridescenceTexture: iridescenceTextureInfo !== null && iridescenceTextureInfo !== void 0 ? iridescenceTextureInfo : undefined,
                    iridescenceThicknessTexture: iridescenceThicknessTextureInfo !== null && iridescenceThicknessTextureInfo !== void 0 ? iridescenceThicknessTextureInfo : undefined,
                    hasTextures: function () {
                        return iridescenceInfo_1.iridescenceTexture !== null || iridescenceInfo_1.iridescenceThicknessTexture !== null;
                    },
                };
                node.extensions[NAME] = iridescenceInfo_1;
            }
            resolve(node);
        });
    };
    return KHR_materials_iridescence;
}());

_glTFExporter__WEBPACK_IMPORTED_MODULE_0__._Exporter.RegisterExtension(NAME, function (exporter) { return new KHR_materials_iridescence(exporter); });


/***/ }),

/***/ "../../../dev/serializers/src/glTF/2.0/Extensions/KHR_materials_sheen.ts":
/*!*******************************************************************************!*\
  !*** ../../../dev/serializers/src/glTF/2.0/Extensions/KHR_materials_sheen.ts ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KHR_materials_sheen: () => (/* binding */ KHR_materials_sheen)
/* harmony export */ });
/* harmony import */ var _glTFExporter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../glTFExporter */ "../../../dev/serializers/src/glTF/2.0/glTFExporter.ts");
/* harmony import */ var babylonjs_Materials_PBR_pbrMaterial__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! babylonjs/Materials/PBR/pbrMaterial */ "babylonjs/Maths/math.vector");
/* harmony import */ var babylonjs_Materials_PBR_pbrMaterial__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(babylonjs_Materials_PBR_pbrMaterial__WEBPACK_IMPORTED_MODULE_1__);


var NAME = "KHR_materials_sheen";
/**
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
var KHR_materials_sheen = /** @class */ (function () {
    function KHR_materials_sheen(exporter) {
        /** Name of this extension */
        this.name = NAME;
        /** Defines whether this extension is enabled */
        this.enabled = true;
        /** Defines whether this extension is required */
        this.required = false;
        this._wasUsed = false;
        this._exporter = exporter;
    }
    KHR_materials_sheen.prototype.dispose = function () { };
    Object.defineProperty(KHR_materials_sheen.prototype, "wasUsed", {
        /** @internal */
        get: function () {
            return this._wasUsed;
        },
        enumerable: false,
        configurable: true
    });
    KHR_materials_sheen.prototype.postExportMaterialAdditionalTextures = function (context, node, babylonMaterial) {
        if (babylonMaterial instanceof babylonjs_Materials_PBR_pbrMaterial__WEBPACK_IMPORTED_MODULE_1__.PBRMaterial) {
            if (babylonMaterial.sheen.isEnabled && babylonMaterial.sheen.texture) {
                return [babylonMaterial.sheen.texture];
            }
        }
        return [];
    };
    KHR_materials_sheen.prototype.postExportMaterialAsync = function (context, node, babylonMaterial) {
        var _this = this;
        return new Promise(function (resolve) {
            var _a, _b, _c, _d;
            if (babylonMaterial instanceof babylonjs_Materials_PBR_pbrMaterial__WEBPACK_IMPORTED_MODULE_1__.PBRMaterial) {
                if (!babylonMaterial.sheen.isEnabled) {
                    resolve(node);
                    return;
                }
                _this._wasUsed = true;
                if (node.extensions == null) {
                    node.extensions = {};
                }
                var sheenInfo_1 = {
                    sheenColorFactor: babylonMaterial.sheen.color.asArray(),
                    sheenRoughnessFactor: (_a = babylonMaterial.sheen.roughness) !== null && _a !== void 0 ? _a : 0,
                    hasTextures: function () {
                        return sheenInfo_1.sheenColorTexture !== null || sheenInfo_1.sheenRoughnessTexture !== null;
                    },
                };
                if (babylonMaterial.sheen.texture) {
                    sheenInfo_1.sheenColorTexture = (_b = _this._exporter._glTFMaterialExporter._getTextureInfo(babylonMaterial.sheen.texture)) !== null && _b !== void 0 ? _b : undefined;
                }
                if (babylonMaterial.sheen.textureRoughness && !babylonMaterial.sheen.useRoughnessFromMainTexture) {
                    sheenInfo_1.sheenRoughnessTexture = (_c = _this._exporter._glTFMaterialExporter._getTextureInfo(babylonMaterial.sheen.textureRoughness)) !== null && _c !== void 0 ? _c : undefined;
                }
                else if (babylonMaterial.sheen.texture && babylonMaterial.sheen.useRoughnessFromMainTexture) {
                    sheenInfo_1.sheenRoughnessTexture = (_d = _this._exporter._glTFMaterialExporter._getTextureInfo(babylonMaterial.sheen.texture)) !== null && _d !== void 0 ? _d : undefined;
                }
                node.extensions[NAME] = sheenInfo_1;
            }
            resolve(node);
        });
    };
    return KHR_materials_sheen;
}());

_glTFExporter__WEBPACK_IMPORTED_MODULE_0__._Exporter.RegisterExtension(NAME, function (exporter) { return new KHR_materials_sheen(exporter); });


/***/ }),

/***/ "../../../dev/serializers/src/glTF/2.0/Extensions/KHR_materials_specular.ts":
/*!**********************************************************************************!*\
  !*** ../../../dev/serializers/src/glTF/2.0/Extensions/KHR_materials_specular.ts ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KHR_materials_specular: () => (/* binding */ KHR_materials_specular)
/* harmony export */ });
/* harmony import */ var _glTFExporter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../glTFExporter */ "../../../dev/serializers/src/glTF/2.0/glTFExporter.ts");
/* harmony import */ var babylonjs_Materials_PBR_pbrMaterial__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! babylonjs/Materials/PBR/pbrMaterial */ "babylonjs/Maths/math.vector");
/* harmony import */ var babylonjs_Materials_PBR_pbrMaterial__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(babylonjs_Materials_PBR_pbrMaterial__WEBPACK_IMPORTED_MODULE_1__);


var NAME = "KHR_materials_specular";
/**
 * [Specification](https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_materials_specular/README.md)
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
var KHR_materials_specular = /** @class */ (function () {
    function KHR_materials_specular(exporter) {
        /** Name of this extension */
        this.name = NAME;
        /** Defines whether this extension is enabled */
        this.enabled = true;
        /** Defines whether this extension is required */
        this.required = false;
        this._wasUsed = false;
        this._exporter = exporter;
    }
    /** Dispose */
    KHR_materials_specular.prototype.dispose = function () { };
    Object.defineProperty(KHR_materials_specular.prototype, "wasUsed", {
        /** @internal */
        get: function () {
            return this._wasUsed;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * After exporting a material, deal with the additional textures
     * @param context GLTF context of the material
     * @param node exported GLTF node
     * @param babylonMaterial corresponding babylon material
     * @returns array of additional textures to export
     */
    KHR_materials_specular.prototype.postExportMaterialAdditionalTextures = function (context, node, babylonMaterial) {
        var additionalTextures = [];
        if (babylonMaterial instanceof babylonjs_Materials_PBR_pbrMaterial__WEBPACK_IMPORTED_MODULE_1__.PBRMaterial) {
            if (this._isExtensionEnabled(babylonMaterial)) {
                if (babylonMaterial.metallicReflectanceTexture) {
                    additionalTextures.push(babylonMaterial.metallicReflectanceTexture);
                }
                if (babylonMaterial.reflectanceTexture) {
                    additionalTextures.push(babylonMaterial.reflectanceTexture);
                }
                return additionalTextures;
            }
        }
        return additionalTextures;
    };
    KHR_materials_specular.prototype._isExtensionEnabled = function (mat) {
        // This extension must not be used on a material that also uses KHR_materials_unlit
        if (mat.unlit) {
            return false;
        }
        return ((mat.metallicF0Factor != undefined && mat.metallicF0Factor != 1.0) ||
            (mat.metallicReflectanceColor != undefined && !mat.metallicReflectanceColor.equalsFloats(1.0, 1.0, 1.0)) ||
            this._hasTexturesExtension(mat));
    };
    KHR_materials_specular.prototype._hasTexturesExtension = function (mat) {
        return mat.metallicReflectanceTexture != null || mat.reflectanceTexture != null;
    };
    /**
     * After exporting a material
     * @param context GLTF context of the material
     * @param node exported GLTF node
     * @param babylonMaterial corresponding babylon material
     * @returns promise, resolves with the material
     */
    KHR_materials_specular.prototype.postExportMaterialAsync = function (context, node, babylonMaterial) {
        var _this = this;
        return new Promise(function (resolve) {
            var _a, _b;
            if (babylonMaterial instanceof babylonjs_Materials_PBR_pbrMaterial__WEBPACK_IMPORTED_MODULE_1__.PBRMaterial && _this._isExtensionEnabled(babylonMaterial)) {
                _this._wasUsed = true;
                node.extensions = node.extensions || {};
                var metallicReflectanceTexture = (_a = _this._exporter._glTFMaterialExporter._getTextureInfo(babylonMaterial.metallicReflectanceTexture)) !== null && _a !== void 0 ? _a : undefined;
                var reflectanceTexture = (_b = _this._exporter._glTFMaterialExporter._getTextureInfo(babylonMaterial.reflectanceTexture)) !== null && _b !== void 0 ? _b : undefined;
                var metallicF0Factor = babylonMaterial.metallicF0Factor == 1.0 ? undefined : babylonMaterial.metallicF0Factor;
                var metallicReflectanceColor = babylonMaterial.metallicReflectanceColor.equalsFloats(1.0, 1.0, 1.0)
                    ? undefined
                    : babylonMaterial.metallicReflectanceColor.asArray();
                var specularInfo = {
                    specularFactor: metallicF0Factor,
                    specularTexture: metallicReflectanceTexture,
                    specularColorFactor: metallicReflectanceColor,
                    specularColorTexture: reflectanceTexture,
                    hasTextures: function () {
                        return _this._hasTexturesExtension(babylonMaterial);
                    },
                };
                node.extensions[NAME] = specularInfo;
            }
            resolve(node);
        });
    };
    return KHR_materials_specular;
}());

_glTFExporter__WEBPACK_IMPORTED_MODULE_0__._Exporter.RegisterExtension(NAME, function (exporter) { return new KHR_materials_specular(exporter); });


/***/ }),

/***/ "../../../dev/serializers/src/glTF/2.0/Extensions/KHR_materials_transmission.ts":
/*!**************************************************************************************!*\
  !*** ../../../dev/serializers/src/glTF/2.0/Extensions/KHR_materials_transmission.ts ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KHR_materials_transmission: () => (/* binding */ KHR_materials_transmission)
/* harmony export */ });
/* harmony import */ var _glTFExporter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../glTFExporter */ "../../../dev/serializers/src/glTF/2.0/glTFExporter.ts");
/* harmony import */ var babylonjs_Materials_PBR_pbrMaterial__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! babylonjs/Materials/PBR/pbrMaterial */ "babylonjs/Maths/math.vector");
/* harmony import */ var babylonjs_Materials_PBR_pbrMaterial__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(babylonjs_Materials_PBR_pbrMaterial__WEBPACK_IMPORTED_MODULE_1__);


var NAME = "KHR_materials_transmission";
/**
 * [Specification](https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_materials_transmission/README.md)
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
var KHR_materials_transmission = /** @class */ (function () {
    function KHR_materials_transmission(exporter) {
        /** Name of this extension */
        this.name = NAME;
        /** Defines whether this extension is enabled */
        this.enabled = true;
        /** Defines whether this extension is required */
        this.required = false;
        this._wasUsed = false;
        this._exporter = exporter;
    }
    /** Dispose */
    KHR_materials_transmission.prototype.dispose = function () { };
    Object.defineProperty(KHR_materials_transmission.prototype, "wasUsed", {
        /** @internal */
        get: function () {
            return this._wasUsed;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * After exporting a material, deal with additional textures
     * @param context GLTF context of the material
     * @param node exported GLTF node
     * @param babylonMaterial corresponding babylon material
     * @returns array of additional textures to export
     */
    KHR_materials_transmission.prototype.postExportMaterialAdditionalTextures = function (context, node, babylonMaterial) {
        var additionalTextures = [];
        if (babylonMaterial instanceof babylonjs_Materials_PBR_pbrMaterial__WEBPACK_IMPORTED_MODULE_1__.PBRMaterial) {
            if (this._isExtensionEnabled(babylonMaterial)) {
                if (babylonMaterial.subSurface.thicknessTexture) {
                    additionalTextures.push(babylonMaterial.subSurface.thicknessTexture);
                }
                return additionalTextures;
            }
        }
        return additionalTextures;
    };
    KHR_materials_transmission.prototype._isExtensionEnabled = function (mat) {
        // This extension must not be used on a material that also uses KHR_materials_unlit
        if (mat.unlit) {
            return false;
        }
        var subs = mat.subSurface;
        return (subs.isRefractionEnabled && subs.refractionIntensity != undefined && subs.refractionIntensity != 0) || this._hasTexturesExtension(mat);
    };
    KHR_materials_transmission.prototype._hasTexturesExtension = function (mat) {
        return mat.subSurface.refractionIntensityTexture != null;
    };
    /**
     * After exporting a material
     * @param context GLTF context of the material
     * @param node exported GLTF node
     * @param babylonMaterial corresponding babylon material
     * @returns true if successful
     */
    KHR_materials_transmission.prototype.postExportMaterialAsync = function (context, node, babylonMaterial) {
        var _this = this;
        return new Promise(function (resolve) {
            var _a;
            if (babylonMaterial instanceof babylonjs_Materials_PBR_pbrMaterial__WEBPACK_IMPORTED_MODULE_1__.PBRMaterial && _this._isExtensionEnabled(babylonMaterial)) {
                _this._wasUsed = true;
                var subs = babylonMaterial.subSurface;
                var transmissionFactor = subs.refractionIntensity === 0 ? undefined : subs.refractionIntensity;
                var transmissionTexture = (_a = _this._exporter._glTFMaterialExporter._getTextureInfo(subs.refractionIntensityTexture)) !== null && _a !== void 0 ? _a : undefined;
                var volumeInfo = {
                    transmissionFactor: transmissionFactor,
                    transmissionTexture: transmissionTexture,
                    hasTextures: function () {
                        return _this._hasTexturesExtension(babylonMaterial);
                    },
                };
                node.extensions = node.extensions || {};
                node.extensions[NAME] = volumeInfo;
            }
            resolve(node);
        });
    };
    return KHR_materials_transmission;
}());

_glTFExporter__WEBPACK_IMPORTED_MODULE_0__._Exporter.RegisterExtension(NAME, function (exporter) { return new KHR_materials_transmission(exporter); });


/***/ }),

/***/ "../../../dev/serializers/src/glTF/2.0/Extensions/KHR_materials_unlit.ts":
/*!*******************************************************************************!*\
  !*** ../../../dev/serializers/src/glTF/2.0/Extensions/KHR_materials_unlit.ts ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KHR_materials_unlit: () => (/* binding */ KHR_materials_unlit)
/* harmony export */ });
/* harmony import */ var _glTFExporter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../glTFExporter */ "../../../dev/serializers/src/glTF/2.0/glTFExporter.ts");
/* harmony import */ var babylonjs_Materials_PBR_pbrMaterial__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! babylonjs/Materials/standardMaterial */ "babylonjs/Maths/math.vector");
/* harmony import */ var babylonjs_Materials_PBR_pbrMaterial__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(babylonjs_Materials_PBR_pbrMaterial__WEBPACK_IMPORTED_MODULE_1__);



var NAME = "KHR_materials_unlit";
/**
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
var KHR_materials_unlit = /** @class */ (function () {
    function KHR_materials_unlit() {
        /** Name of this extension */
        this.name = NAME;
        /** Defines whether this extension is enabled */
        this.enabled = true;
        /** Defines whether this extension is required */
        this.required = false;
        this._wasUsed = false;
    }
    Object.defineProperty(KHR_materials_unlit.prototype, "wasUsed", {
        /** @internal */
        get: function () {
            return this._wasUsed;
        },
        enumerable: false,
        configurable: true
    });
    KHR_materials_unlit.prototype.dispose = function () { };
    KHR_materials_unlit.prototype.postExportMaterialAsync = function (context, node, babylonMaterial) {
        var _this = this;
        return new Promise(function (resolve) {
            var unlitMaterial = false;
            if (babylonMaterial instanceof babylonjs_Materials_PBR_pbrMaterial__WEBPACK_IMPORTED_MODULE_1__.PBRMaterial) {
                unlitMaterial = babylonMaterial.unlit;
            }
            else if (babylonMaterial instanceof babylonjs_Materials_PBR_pbrMaterial__WEBPACK_IMPORTED_MODULE_1__.StandardMaterial) {
                unlitMaterial = babylonMaterial.disableLighting;
            }
            if (unlitMaterial) {
                _this._wasUsed = true;
                if (node.extensions == null) {
                    node.extensions = {};
                }
                node.extensions[NAME] = {};
            }
            resolve(node);
        });
    };
    return KHR_materials_unlit;
}());

_glTFExporter__WEBPACK_IMPORTED_MODULE_0__._Exporter.RegisterExtension(NAME, function () { return new KHR_materials_unlit(); });


/***/ }),

/***/ "../../../dev/serializers/src/glTF/2.0/Extensions/KHR_materials_volume.ts":
/*!********************************************************************************!*\
  !*** ../../../dev/serializers/src/glTF/2.0/Extensions/KHR_materials_volume.ts ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KHR_materials_volume: () => (/* binding */ KHR_materials_volume)
/* harmony export */ });
/* harmony import */ var _glTFExporter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../glTFExporter */ "../../../dev/serializers/src/glTF/2.0/glTFExporter.ts");
/* harmony import */ var babylonjs_Materials_PBR_pbrMaterial__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! babylonjs/Maths/math.color */ "babylonjs/Maths/math.vector");
/* harmony import */ var babylonjs_Materials_PBR_pbrMaterial__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(babylonjs_Materials_PBR_pbrMaterial__WEBPACK_IMPORTED_MODULE_1__);



var NAME = "KHR_materials_volume";
/**
 * [Specification](https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_materials_volume/README.md)
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
var KHR_materials_volume = /** @class */ (function () {
    function KHR_materials_volume(exporter) {
        /** Name of this extension */
        this.name = NAME;
        /** Defines whether this extension is enabled */
        this.enabled = true;
        /** Defines whether this extension is required */
        this.required = false;
        this._wasUsed = false;
        this._exporter = exporter;
    }
    KHR_materials_volume.prototype.dispose = function () { };
    Object.defineProperty(KHR_materials_volume.prototype, "wasUsed", {
        /** @internal */
        get: function () {
            return this._wasUsed;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * After exporting a material, deal with additional textures
     * @param context GLTF context of the material
     * @param node exported GLTF node
     * @param babylonMaterial corresponding babylon material
     * @returns array of additional textures to export
     */
    KHR_materials_volume.prototype.postExportMaterialAdditionalTextures = function (context, node, babylonMaterial) {
        var additionalTextures = [];
        if (babylonMaterial instanceof babylonjs_Materials_PBR_pbrMaterial__WEBPACK_IMPORTED_MODULE_1__.PBRMaterial) {
            if (this._isExtensionEnabled(babylonMaterial)) {
                if (babylonMaterial.subSurface.thicknessTexture) {
                    additionalTextures.push(babylonMaterial.subSurface.thicknessTexture);
                }
                return additionalTextures;
            }
        }
        return additionalTextures;
    };
    KHR_materials_volume.prototype._isExtensionEnabled = function (mat) {
        // This extension must not be used on a material that also uses KHR_materials_unlit
        if (mat.unlit) {
            return false;
        }
        var subs = mat.subSurface;
        // this extension requires either the KHR_materials_transmission or KHR_materials_diffuse_transmission extensions.
        if (!subs.isRefractionEnabled && !subs.isTranslucencyEnabled) {
            return false;
        }
        return ((subs.maximumThickness != undefined && subs.maximumThickness != 0) ||
            (subs.tintColorAtDistance != undefined && subs.tintColorAtDistance != Number.POSITIVE_INFINITY) ||
            (subs.tintColor != undefined && subs.tintColor != babylonjs_Materials_PBR_pbrMaterial__WEBPACK_IMPORTED_MODULE_1__.Color3.White()) ||
            this._hasTexturesExtension(mat));
    };
    KHR_materials_volume.prototype._hasTexturesExtension = function (mat) {
        return mat.subSurface.thicknessTexture != null;
    };
    /**
     * After exporting a material
     * @param context GLTF context of the material
     * @param node exported GLTF node
     * @param babylonMaterial corresponding babylon material
     * @returns promise that resolves with the updated node
     */
    KHR_materials_volume.prototype.postExportMaterialAsync = function (context, node, babylonMaterial) {
        var _this = this;
        return new Promise(function (resolve) {
            var _a;
            if (babylonMaterial instanceof babylonjs_Materials_PBR_pbrMaterial__WEBPACK_IMPORTED_MODULE_1__.PBRMaterial && _this._isExtensionEnabled(babylonMaterial)) {
                _this._wasUsed = true;
                var subs = babylonMaterial.subSurface;
                var thicknessFactor = subs.maximumThickness == 0 ? undefined : subs.maximumThickness;
                var thicknessTexture = (_a = _this._exporter._glTFMaterialExporter._getTextureInfo(subs.thicknessTexture)) !== null && _a !== void 0 ? _a : undefined;
                var attenuationDistance = subs.tintColorAtDistance == Number.POSITIVE_INFINITY ? undefined : subs.tintColorAtDistance;
                var attenuationColor = subs.tintColor.equalsFloats(1.0, 1.0, 1.0) ? undefined : subs.tintColor.asArray();
                var volumeInfo = {
                    thicknessFactor: thicknessFactor,
                    thicknessTexture: thicknessTexture,
                    attenuationDistance: attenuationDistance,
                    attenuationColor: attenuationColor,
                    hasTextures: function () {
                        return _this._hasTexturesExtension(babylonMaterial);
                    },
                };
                node.extensions = node.extensions || {};
                node.extensions[NAME] = volumeInfo;
            }
            resolve(node);
        });
    };
    return KHR_materials_volume;
}());

_glTFExporter__WEBPACK_IMPORTED_MODULE_0__._Exporter.RegisterExtension(NAME, function (exporter) { return new KHR_materials_volume(exporter); });


/***/ }),

/***/ "../../../dev/serializers/src/glTF/2.0/Extensions/KHR_texture_transform.ts":
/*!*********************************************************************************!*\
  !*** ../../../dev/serializers/src/glTF/2.0/Extensions/KHR_texture_transform.ts ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KHR_texture_transform: () => (/* binding */ KHR_texture_transform)
/* harmony export */ });
/* harmony import */ var babylonjs_Misc_tools__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! babylonjs/Misc/tools */ "babylonjs/Maths/math.vector");
/* harmony import */ var babylonjs_Misc_tools__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(babylonjs_Misc_tools__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _glTFExporter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../glTFExporter */ "../../../dev/serializers/src/glTF/2.0/glTFExporter.ts");


var NAME = "KHR_texture_transform";
/**
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
var KHR_texture_transform = /** @class */ (function () {
    function KHR_texture_transform() {
        /** Name of this extension */
        this.name = NAME;
        /** Defines whether this extension is enabled */
        this.enabled = true;
        /** Defines whether this extension is required */
        this.required = false;
        /** Reference to the glTF exporter */
        this._wasUsed = false;
    }
    KHR_texture_transform.prototype.dispose = function () { };
    Object.defineProperty(KHR_texture_transform.prototype, "wasUsed", {
        /** @internal */
        get: function () {
            return this._wasUsed;
        },
        enumerable: false,
        configurable: true
    });
    KHR_texture_transform.prototype.postExportTexture = function (context, textureInfo, babylonTexture) {
        var canUseExtension = babylonTexture &&
            ((babylonTexture.uAng === 0 && babylonTexture.wAng === 0 && babylonTexture.vAng === 0) ||
                (babylonTexture.uRotationCenter === 0 && babylonTexture.vRotationCenter === 0));
        if (canUseExtension) {
            var textureTransform = {};
            var transformIsRequired = false;
            if (babylonTexture.uOffset !== 0 || babylonTexture.vOffset !== 0) {
                textureTransform.offset = [babylonTexture.uOffset, babylonTexture.vOffset];
                transformIsRequired = true;
            }
            if (babylonTexture.uScale !== 1 || babylonTexture.vScale !== 1) {
                textureTransform.scale = [babylonTexture.uScale, babylonTexture.vScale];
                transformIsRequired = true;
            }
            if (babylonTexture.wAng !== 0) {
                textureTransform.rotation = -babylonTexture.wAng;
                transformIsRequired = true;
            }
            if (babylonTexture.coordinatesIndex !== 0) {
                textureTransform.texCoord = babylonTexture.coordinatesIndex;
                transformIsRequired = true;
            }
            if (!transformIsRequired) {
                return;
            }
            this._wasUsed = true;
            if (!textureInfo.extensions) {
                textureInfo.extensions = {};
            }
            textureInfo.extensions[NAME] = textureTransform;
        }
    };
    KHR_texture_transform.prototype.preExportTextureAsync = function (context, babylonTexture) {
        return new Promise(function (resolve, reject) {
            var scene = babylonTexture.getScene();
            if (!scene) {
                reject("".concat(context, ": \"scene\" is not defined for Babylon texture ").concat(babylonTexture.name, "!"));
                return;
            }
            /*
             * The KHR_texture_transform schema only supports w rotation around the origin.
             * See https://github.com/KhronosGroup/glTF/tree/main/extensions/2.0/Khronos/KHR_texture_transform#gltf-schema-updates.
             */
            if (babylonTexture.uAng !== 0 || babylonTexture.vAng !== 0) {
                babylonjs_Misc_tools__WEBPACK_IMPORTED_MODULE_0__.Tools.Warn("".concat(context, ": Texture ").concat(babylonTexture.name, " with rotation in the u or v axis is not supported in glTF."));
                resolve(null);
            }
            else if (babylonTexture.wAng !== 0 && (babylonTexture.uRotationCenter !== 0 || babylonTexture.vRotationCenter !== 0)) {
                babylonjs_Misc_tools__WEBPACK_IMPORTED_MODULE_0__.Tools.Warn("".concat(context, ": Texture ").concat(babylonTexture.name, " with rotation not centered at the origin cannot be exported with ").concat(NAME));
                resolve(null);
            }
            else {
                resolve(babylonTexture);
            }
        });
    };
    return KHR_texture_transform;
}());

_glTFExporter__WEBPACK_IMPORTED_MODULE_1__._Exporter.RegisterExtension(NAME, function () { return new KHR_texture_transform(); });


/***/ }),

/***/ "../../../dev/serializers/src/glTF/2.0/Extensions/index.ts":
/*!*****************************************************************!*\
  !*** ../../../dev/serializers/src/glTF/2.0/Extensions/index.ts ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EXT_mesh_gpu_instancing: () => (/* reexport safe */ _EXT_mesh_gpu_instancing__WEBPACK_IMPORTED_MODULE_12__.EXT_mesh_gpu_instancing),
/* harmony export */   KHR_lights_punctual: () => (/* reexport safe */ _KHR_lights_punctual__WEBPACK_IMPORTED_MODULE_1__.KHR_lights_punctual),
/* harmony export */   KHR_materials_anisotropy: () => (/* reexport safe */ _KHR_materials_anisotropy__WEBPACK_IMPORTED_MODULE_4__.KHR_materials_anisotropy),
/* harmony export */   KHR_materials_clearcoat: () => (/* reexport safe */ _KHR_materials_clearcoat__WEBPACK_IMPORTED_MODULE_2__.KHR_materials_clearcoat),
/* harmony export */   KHR_materials_diffuse_transmission: () => (/* reexport safe */ _KHR_materials_diffuse_transmission__WEBPACK_IMPORTED_MODULE_14__.KHR_materials_diffuse_transmission),
/* harmony export */   KHR_materials_dispersion: () => (/* reexport safe */ _KHR_materials_dispersion__WEBPACK_IMPORTED_MODULE_10__.KHR_materials_dispersion),
/* harmony export */   KHR_materials_emissive_strength: () => (/* reexport safe */ _KHR_materials_emissive_strength__WEBPACK_IMPORTED_MODULE_13__.KHR_materials_emissive_strength),
/* harmony export */   KHR_materials_ior: () => (/* reexport safe */ _KHR_materials_ior__WEBPACK_IMPORTED_MODULE_7__.KHR_materials_ior),
/* harmony export */   KHR_materials_iridescence: () => (/* reexport safe */ _KHR_materials_iridescence__WEBPACK_IMPORTED_MODULE_3__.KHR_materials_iridescence),
/* harmony export */   KHR_materials_sheen: () => (/* reexport safe */ _KHR_materials_sheen__WEBPACK_IMPORTED_MODULE_5__.KHR_materials_sheen),
/* harmony export */   KHR_materials_specular: () => (/* reexport safe */ _KHR_materials_specular__WEBPACK_IMPORTED_MODULE_8__.KHR_materials_specular),
/* harmony export */   KHR_materials_transmission: () => (/* reexport safe */ _KHR_materials_transmission__WEBPACK_IMPORTED_MODULE_11__.KHR_materials_transmission),
/* harmony export */   KHR_materials_unlit: () => (/* reexport safe */ _KHR_materials_unlit__WEBPACK_IMPORTED_MODULE_6__.KHR_materials_unlit),
/* harmony export */   KHR_materials_volume: () => (/* reexport safe */ _KHR_materials_volume__WEBPACK_IMPORTED_MODULE_9__.KHR_materials_volume),
/* harmony export */   KHR_texture_transform: () => (/* reexport safe */ _KHR_texture_transform__WEBPACK_IMPORTED_MODULE_0__.KHR_texture_transform)
/* harmony export */ });
/* harmony import */ var _KHR_texture_transform__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./KHR_texture_transform */ "../../../dev/serializers/src/glTF/2.0/Extensions/KHR_texture_transform.ts");
/* harmony import */ var _KHR_lights_punctual__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./KHR_lights_punctual */ "../../../dev/serializers/src/glTF/2.0/Extensions/KHR_lights_punctual.ts");
/* harmony import */ var _KHR_materials_clearcoat__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./KHR_materials_clearcoat */ "../../../dev/serializers/src/glTF/2.0/Extensions/KHR_materials_clearcoat.ts");
/* harmony import */ var _KHR_materials_iridescence__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./KHR_materials_iridescence */ "../../../dev/serializers/src/glTF/2.0/Extensions/KHR_materials_iridescence.ts");
/* harmony import */ var _KHR_materials_anisotropy__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./KHR_materials_anisotropy */ "../../../dev/serializers/src/glTF/2.0/Extensions/KHR_materials_anisotropy.ts");
/* harmony import */ var _KHR_materials_sheen__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./KHR_materials_sheen */ "../../../dev/serializers/src/glTF/2.0/Extensions/KHR_materials_sheen.ts");
/* harmony import */ var _KHR_materials_unlit__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./KHR_materials_unlit */ "../../../dev/serializers/src/glTF/2.0/Extensions/KHR_materials_unlit.ts");
/* harmony import */ var _KHR_materials_ior__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./KHR_materials_ior */ "../../../dev/serializers/src/glTF/2.0/Extensions/KHR_materials_ior.ts");
/* harmony import */ var _KHR_materials_specular__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./KHR_materials_specular */ "../../../dev/serializers/src/glTF/2.0/Extensions/KHR_materials_specular.ts");
/* harmony import */ var _KHR_materials_volume__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./KHR_materials_volume */ "../../../dev/serializers/src/glTF/2.0/Extensions/KHR_materials_volume.ts");
/* harmony import */ var _KHR_materials_dispersion__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./KHR_materials_dispersion */ "../../../dev/serializers/src/glTF/2.0/Extensions/KHR_materials_dispersion.ts");
/* harmony import */ var _KHR_materials_transmission__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./KHR_materials_transmission */ "../../../dev/serializers/src/glTF/2.0/Extensions/KHR_materials_transmission.ts");
/* harmony import */ var _EXT_mesh_gpu_instancing__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./EXT_mesh_gpu_instancing */ "../../../dev/serializers/src/glTF/2.0/Extensions/EXT_mesh_gpu_instancing.ts");
/* harmony import */ var _KHR_materials_emissive_strength__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./KHR_materials_emissive_strength */ "../../../dev/serializers/src/glTF/2.0/Extensions/KHR_materials_emissive_strength.ts");
/* harmony import */ var _KHR_materials_diffuse_transmission__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./KHR_materials_diffuse_transmission */ "../../../dev/serializers/src/glTF/2.0/Extensions/KHR_materials_diffuse_transmission.ts");

















/***/ }),

/***/ "../../../dev/serializers/src/glTF/2.0/glTFAnimation.ts":
/*!**************************************************************!*\
  !*** ../../../dev/serializers/src/glTF/2.0/glTFAnimation.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   _GLTFAnimation: () => (/* binding */ _GLTFAnimation)
/* harmony export */ });
/* harmony import */ var babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! babylonjs/Lights/light */ "babylonjs/Maths/math.vector");
/* harmony import */ var babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _glTFUtilities__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./glTFUtilities */ "../../../dev/serializers/src/glTF/2.0/glTFUtilities.ts");









/**
 * @internal
 * Enum for handling in tangent and out tangent.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
var _TangentType;
(function (_TangentType) {
    /**
     * Specifies that input tangents are used.
     */
    _TangentType[_TangentType["INTANGENT"] = 0] = "INTANGENT";
    /**
     * Specifies that output tangents are used.
     */
    _TangentType[_TangentType["OUTTANGENT"] = 1] = "OUTTANGENT";
})(_TangentType || (_TangentType = {}));
/**
 * @internal
 * Utility class for generating glTF animation data from BabylonJS.
 */
var _GLTFAnimation = /** @class */ (function () {
    function _GLTFAnimation() {
    }
    /**
     * Determine if a node is transformable - ie has properties it should be part of animation of transformation.
     * @param babylonNode the node to test
     * @returns true if can be animated, false otherwise. False if the parameter is null or undefined.
     */
    _GLTFAnimation._IsTransformable = function (babylonNode) {
        return babylonNode && (babylonNode instanceof babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.TransformNode || babylonNode instanceof babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Camera || babylonNode instanceof babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Light);
    };
    /**
     * @ignore
     *
     * Creates glTF channel animation from BabylonJS animation.
     * @param babylonTransformNode - BabylonJS mesh.
     * @param animation - animation.
     * @param animationChannelTargetPath - The target animation channel.
     * @param useQuaternion - Specifies if quaternions are used.
     * @returns nullable IAnimationData
     */
    _GLTFAnimation._CreateNodeAnimation = function (babylonTransformNode, animation, animationChannelTargetPath, useQuaternion, animationSampleRate) {
        if (this._IsTransformable(babylonTransformNode)) {
            var inputs = [];
            var outputs = [];
            var keyFrames = animation.getKeys();
            var minMaxKeyFrames = _GLTFAnimation._CalculateMinMaxKeyFrames(keyFrames);
            var interpolationOrBake = _GLTFAnimation._DeduceInterpolation(keyFrames, animationChannelTargetPath, useQuaternion);
            var interpolation = interpolationOrBake.interpolationType;
            var shouldBakeAnimation = interpolationOrBake.shouldBakeAnimation;
            if (shouldBakeAnimation) {
                _GLTFAnimation._CreateBakedAnimation(babylonTransformNode, animation, animationChannelTargetPath, minMaxKeyFrames.min, minMaxKeyFrames.max, animation.framePerSecond, animationSampleRate, inputs, outputs, minMaxKeyFrames, useQuaternion);
            }
            else {
                if (interpolation === "LINEAR" /* AnimationSamplerInterpolation.LINEAR */ || interpolation === "STEP" /* AnimationSamplerInterpolation.STEP */) {
                    _GLTFAnimation._CreateLinearOrStepAnimation(babylonTransformNode, animation, animationChannelTargetPath, inputs, outputs, useQuaternion);
                }
                else if (interpolation === "CUBICSPLINE" /* AnimationSamplerInterpolation.CUBICSPLINE */) {
                    _GLTFAnimation._CreateCubicSplineAnimation(babylonTransformNode, animation, animationChannelTargetPath, inputs, outputs, useQuaternion);
                }
                else {
                    _GLTFAnimation._CreateBakedAnimation(babylonTransformNode, animation, animationChannelTargetPath, minMaxKeyFrames.min, minMaxKeyFrames.max, animation.framePerSecond, animationSampleRate, inputs, outputs, minMaxKeyFrames, useQuaternion);
                }
            }
            if (inputs.length && outputs.length) {
                var result = {
                    inputs: inputs,
                    outputs: outputs,
                    samplerInterpolation: interpolation,
                    inputsMin: shouldBakeAnimation ? minMaxKeyFrames.min : babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Tools.FloatRound(minMaxKeyFrames.min / animation.framePerSecond),
                    inputsMax: shouldBakeAnimation ? minMaxKeyFrames.max : babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Tools.FloatRound(minMaxKeyFrames.max / animation.framePerSecond),
                };
                return result;
            }
        }
        return null;
    };
    _GLTFAnimation._DeduceAnimationInfo = function (animation) {
        var animationChannelTargetPath = null;
        var dataAccessorType = "VEC3" /* AccessorType.VEC3 */;
        var useQuaternion = false;
        var property = animation.targetProperty.split(".");
        switch (property[0]) {
            case "scaling": {
                animationChannelTargetPath = "scale" /* AnimationChannelTargetPath.SCALE */;
                break;
            }
            case "position": {
                animationChannelTargetPath = "translation" /* AnimationChannelTargetPath.TRANSLATION */;
                break;
            }
            case "rotation": {
                dataAccessorType = "VEC4" /* AccessorType.VEC4 */;
                animationChannelTargetPath = "rotation" /* AnimationChannelTargetPath.ROTATION */;
                break;
            }
            case "rotationQuaternion": {
                dataAccessorType = "VEC4" /* AccessorType.VEC4 */;
                useQuaternion = true;
                animationChannelTargetPath = "rotation" /* AnimationChannelTargetPath.ROTATION */;
                break;
            }
            case "influence": {
                dataAccessorType = "SCALAR" /* AccessorType.SCALAR */;
                animationChannelTargetPath = "weights" /* AnimationChannelTargetPath.WEIGHTS */;
                break;
            }
            default: {
                babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Tools.Error("Unsupported animatable property ".concat(property[0]));
            }
        }
        if (animationChannelTargetPath) {
            return { animationChannelTargetPath: animationChannelTargetPath, dataAccessorType: dataAccessorType, useQuaternion: useQuaternion };
        }
        else {
            babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Tools.Error("animation channel target path and data accessor type could be deduced");
        }
        return null;
    };
    /**
     * @ignore
     * Create node animations from the transform node animations
     * @param babylonNode
     * @param runtimeGLTFAnimation
     * @param idleGLTFAnimations
     * @param nodeMap
     * @param nodes
     * @param binaryWriter
     * @param bufferViews
     * @param accessors
     * @param animationSampleRate
     */
    _GLTFAnimation._CreateNodeAnimationFromNodeAnimations = function (babylonNode, runtimeGLTFAnimation, idleGLTFAnimations, nodeMap, nodes, binaryWriter, bufferViews, accessors, animationSampleRate, shouldExportAnimation) {
        var glTFAnimation;
        if (_GLTFAnimation._IsTransformable(babylonNode)) {
            if (babylonNode.animations) {
                for (var _i = 0, _a = babylonNode.animations; _i < _a.length; _i++) {
                    var animation = _a[_i];
                    if (shouldExportAnimation && !shouldExportAnimation(animation)) {
                        continue;
                    }
                    var animationInfo = _GLTFAnimation._DeduceAnimationInfo(animation);
                    if (animationInfo) {
                        glTFAnimation = {
                            name: animation.name,
                            samplers: [],
                            channels: [],
                        };
                        _GLTFAnimation._AddAnimation("".concat(animation.name), animation.hasRunningRuntimeAnimations ? runtimeGLTFAnimation : glTFAnimation, babylonNode, animation, animationInfo.dataAccessorType, animationInfo.animationChannelTargetPath, nodeMap, binaryWriter, bufferViews, accessors, animationInfo.useQuaternion, animationSampleRate);
                        if (glTFAnimation.samplers.length && glTFAnimation.channels.length) {
                            idleGLTFAnimations.push(glTFAnimation);
                        }
                    }
                }
            }
        }
    };
    /**
     * @ignore
     * Create individual morph animations from the mesh's morph target animation tracks
     * @param babylonNode
     * @param runtimeGLTFAnimation
     * @param idleGLTFAnimations
     * @param nodeMap
     * @param nodes
     * @param binaryWriter
     * @param bufferViews
     * @param accessors
     * @param animationSampleRate
     */
    _GLTFAnimation._CreateMorphTargetAnimationFromMorphTargetAnimations = function (babylonNode, runtimeGLTFAnimation, idleGLTFAnimations, nodeMap, nodes, binaryWriter, bufferViews, accessors, animationSampleRate, shouldExportAnimation) {
        var glTFAnimation;
        if (babylonNode instanceof babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Mesh) {
            var morphTargetManager = babylonNode.morphTargetManager;
            if (morphTargetManager) {
                for (var i = 0; i < morphTargetManager.numTargets; ++i) {
                    var morphTarget = morphTargetManager.getTarget(i);
                    for (var _i = 0, _a = morphTarget.animations; _i < _a.length; _i++) {
                        var animation = _a[_i];
                        if (shouldExportAnimation && !shouldExportAnimation(animation)) {
                            continue;
                        }
                        var combinedAnimation = new babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Animation("".concat(animation.name), "influence", animation.framePerSecond, animation.dataType, animation.loopMode, animation.enableBlending);
                        var combinedAnimationKeys = [];
                        var animationKeys = animation.getKeys();
                        for (var j = 0; j < animationKeys.length; ++j) {
                            var animationKey = animationKeys[j];
                            for (var k = 0; k < morphTargetManager.numTargets; ++k) {
                                if (k == i) {
                                    combinedAnimationKeys.push(animationKey);
                                }
                                else {
                                    combinedAnimationKeys.push({ frame: animationKey.frame, value: 0 });
                                }
                            }
                        }
                        combinedAnimation.setKeys(combinedAnimationKeys);
                        var animationInfo = _GLTFAnimation._DeduceAnimationInfo(combinedAnimation);
                        if (animationInfo) {
                            glTFAnimation = {
                                name: combinedAnimation.name,
                                samplers: [],
                                channels: [],
                            };
                            _GLTFAnimation._AddAnimation(animation.name, animation.hasRunningRuntimeAnimations ? runtimeGLTFAnimation : glTFAnimation, babylonNode, combinedAnimation, animationInfo.dataAccessorType, animationInfo.animationChannelTargetPath, nodeMap, binaryWriter, bufferViews, accessors, animationInfo.useQuaternion, animationSampleRate, morphTargetManager.numTargets);
                            if (glTFAnimation.samplers.length && glTFAnimation.channels.length) {
                                idleGLTFAnimations.push(glTFAnimation);
                            }
                        }
                    }
                }
            }
        }
    };
    /**
     * @internal
     * Create node and morph animations from the animation groups
     * @param babylonScene
     * @param glTFAnimations
     * @param nodeMap
     * @param nodes
     * @param binaryWriter
     * @param bufferViews
     * @param accessors
     * @param animationSampleRate
     */
    _GLTFAnimation._CreateNodeAndMorphAnimationFromAnimationGroups = function (babylonScene, glTFAnimations, nodeMap, binaryWriter, bufferViews, accessors, animationSampleRate, shouldExportAnimation) {
        var _a;
        var glTFAnimation;
        if (babylonScene.animationGroups) {
            var animationGroups = babylonScene.animationGroups;
            var _loop_1 = function (animationGroup) {
                var morphAnimations = new Map();
                var sampleAnimations = new Map();
                var morphAnimationMeshes = new Set();
                var animationGroupFrameDiff = animationGroup.to - animationGroup.from;
                glTFAnimation = {
                    name: animationGroup.name,
                    channels: [],
                    samplers: [],
                };
                var _loop_2 = function (i) {
                    var targetAnimation = animationGroup.targetedAnimations[i];
                    var target = targetAnimation.target;
                    var animation = targetAnimation.animation;
                    if (shouldExportAnimation && !shouldExportAnimation(animation)) {
                        return "continue";
                    }
                    if (this_1._IsTransformable(target) || (target.length === 1 && this_1._IsTransformable(target[0]))) {
                        var animationInfo = _GLTFAnimation._DeduceAnimationInfo(targetAnimation.animation);
                        if (animationInfo) {
                            var babylonTransformNode = this_1._IsTransformable(target) ? target : this_1._IsTransformable(target[0]) ? target[0] : null;
                            if (babylonTransformNode) {
                                _GLTFAnimation._AddAnimation("".concat(animation.name), glTFAnimation, babylonTransformNode, animation, animationInfo.dataAccessorType, animationInfo.animationChannelTargetPath, nodeMap, binaryWriter, bufferViews, accessors, animationInfo.useQuaternion, animationSampleRate);
                            }
                        }
                    }
                    else if (target instanceof babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.MorphTarget || (target.length === 1 && target[0] instanceof babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.MorphTarget)) {
                        var animationInfo = _GLTFAnimation._DeduceAnimationInfo(targetAnimation.animation);
                        if (animationInfo) {
                            var babylonMorphTarget_1 = target instanceof babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.MorphTarget ? target : target[0];
                            if (babylonMorphTarget_1) {
                                var babylonMorphTargetManager_1 = babylonScene.morphTargetManagers.find(function (morphTargetManager) {
                                    for (var j = 0; j < morphTargetManager.numTargets; ++j) {
                                        if (morphTargetManager.getTarget(j) === babylonMorphTarget_1) {
                                            return true;
                                        }
                                    }
                                    return false;
                                });
                                if (babylonMorphTargetManager_1) {
                                    var babylonMesh = babylonScene.meshes.find(function (mesh) {
                                        return mesh.morphTargetManager === babylonMorphTargetManager_1;
                                    });
                                    if (babylonMesh) {
                                        if (!morphAnimations.has(babylonMesh)) {
                                            morphAnimations.set(babylonMesh, new Map());
                                        }
                                        (_a = morphAnimations.get(babylonMesh)) === null || _a === void 0 ? void 0 : _a.set(babylonMorphTarget_1, animation);
                                        morphAnimationMeshes.add(babylonMesh);
                                        sampleAnimations.set(babylonMesh, animation);
                                    }
                                }
                            }
                        }
                    }
                    else {
                        // this is the place for the KHR_animation_pointer.
                    }
                };
                for (var i = 0; i < animationGroup.targetedAnimations.length; ++i) {
                    _loop_2(i);
                }
                morphAnimationMeshes.forEach(function (mesh) {
                    var morphTargetManager = mesh.morphTargetManager;
                    var combinedAnimationGroup = null;
                    var animationKeys = [];
                    var sampleAnimation = sampleAnimations.get(mesh);
                    var sampleAnimationKeys = sampleAnimation.getKeys();
                    var numAnimationKeys = sampleAnimationKeys.length;
                    /*
                        Due to how glTF expects morph target animation data to be formatted, we need to rearrange the individual morph target animation tracks,
                        such that we have a single animation, where a given keyframe input value has successive output values for each morph target belonging to the manager.
                        See: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#animations

                        We do this via constructing a new Animation track, and interleaving the frames of each morph target animation track in the current Animation Group
                        We reuse the Babylon Animation data structure for ease of handling export of cubic spline animation keys, and to reuse the
                        existing _GLTFAnimation.AddAnimation codepath with minimal modification, however the constructed Babylon Animation is NOT intended for use in-engine.
                    */
                    for (var i = 0; i < numAnimationKeys; ++i) {
                        for (var j = 0; j < morphTargetManager.numTargets; ++j) {
                            var morphTarget = morphTargetManager.getTarget(j);
                            var animationsByMorphTarget = morphAnimations.get(mesh);
                            if (animationsByMorphTarget) {
                                var morphTargetAnimation = animationsByMorphTarget.get(morphTarget);
                                if (morphTargetAnimation) {
                                    if (!combinedAnimationGroup) {
                                        combinedAnimationGroup = new babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Animation("".concat(animationGroup.name, "_").concat(mesh.name, "_MorphWeightAnimation"), "influence", morphTargetAnimation.framePerSecond, babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Animation.ANIMATIONTYPE_FLOAT, morphTargetAnimation.loopMode, morphTargetAnimation.enableBlending);
                                    }
                                    animationKeys.push(morphTargetAnimation.getKeys()[i]);
                                }
                                else {
                                    animationKeys.push({
                                        frame: animationGroup.from + (animationGroupFrameDiff / numAnimationKeys) * i,
                                        value: morphTarget.influence,
                                        inTangent: sampleAnimationKeys[0].inTangent ? 0 : undefined,
                                        outTangent: sampleAnimationKeys[0].outTangent ? 0 : undefined,
                                    });
                                }
                            }
                        }
                    }
                    combinedAnimationGroup.setKeys(animationKeys);
                    var animationInfo = _GLTFAnimation._DeduceAnimationInfo(combinedAnimationGroup);
                    if (animationInfo) {
                        _GLTFAnimation._AddAnimation("".concat(animationGroup.name, "_").concat(mesh.name, "_MorphWeightAnimation"), glTFAnimation, mesh, combinedAnimationGroup, animationInfo.dataAccessorType, animationInfo.animationChannelTargetPath, nodeMap, binaryWriter, bufferViews, accessors, animationInfo.useQuaternion, animationSampleRate, morphTargetManager === null || morphTargetManager === void 0 ? void 0 : morphTargetManager.numTargets);
                    }
                });
                if (glTFAnimation.channels.length && glTFAnimation.samplers.length) {
                    glTFAnimations.push(glTFAnimation);
                }
            };
            var this_1 = this;
            for (var _i = 0, animationGroups_1 = animationGroups; _i < animationGroups_1.length; _i++) {
                var animationGroup = animationGroups_1[_i];
                _loop_1(animationGroup);
            }
        }
    };
    _GLTFAnimation._AddAnimation = function (name, glTFAnimation, babylonTransformNode, animation, dataAccessorType, animationChannelTargetPath, nodeMap, binaryWriter, bufferViews, accessors, useQuaternion, animationSampleRate, morphAnimationChannels) {
        var animationData = _GLTFAnimation._CreateNodeAnimation(babylonTransformNode, animation, animationChannelTargetPath, useQuaternion, animationSampleRate);
        var bufferView;
        var accessor;
        var keyframeAccessorIndex;
        var dataAccessorIndex;
        var outputLength;
        var animationSampler;
        var animationChannel;
        if (animationData) {
            /*
             * Now that we have the glTF converted morph target animation data,
             * we can remove redundant input data so that we have n input frames,
             * and morphAnimationChannels * n output frames
             */
            if (morphAnimationChannels) {
                var index = 0;
                var currentInput = 0;
                var newInputs = [];
                while (animationData.inputs.length > 0) {
                    currentInput = animationData.inputs.shift();
                    if (index % morphAnimationChannels == 0) {
                        newInputs.push(currentInput);
                    }
                    index++;
                }
                animationData.inputs = newInputs;
            }
            var nodeIndex = nodeMap[babylonTransformNode.uniqueId];
            // Creates buffer view and accessor for key frames.
            var byteLength = animationData.inputs.length * 4;
            bufferView = _glTFUtilities__WEBPACK_IMPORTED_MODULE_1__._GLTFUtilities._CreateBufferView(0, binaryWriter.getByteOffset(), byteLength, undefined, "".concat(name, "  keyframe data view"));
            bufferViews.push(bufferView);
            animationData.inputs.forEach(function (input) {
                binaryWriter.setFloat32(input);
            });
            accessor = _glTFUtilities__WEBPACK_IMPORTED_MODULE_1__._GLTFUtilities._CreateAccessor(bufferViews.length - 1, "".concat(name, "  keyframes"), "SCALAR" /* AccessorType.SCALAR */, 5126 /* AccessorComponentType.FLOAT */, animationData.inputs.length, null, [animationData.inputsMin], [animationData.inputsMax]);
            accessors.push(accessor);
            keyframeAccessorIndex = accessors.length - 1;
            // create bufferview and accessor for keyed values.
            outputLength = animationData.outputs.length;
            byteLength = _glTFUtilities__WEBPACK_IMPORTED_MODULE_1__._GLTFUtilities._GetDataAccessorElementCount(dataAccessorType) * 4 * animationData.outputs.length;
            // check for in and out tangents
            bufferView = _glTFUtilities__WEBPACK_IMPORTED_MODULE_1__._GLTFUtilities._CreateBufferView(0, binaryWriter.getByteOffset(), byteLength, undefined, "".concat(name, "  data view"));
            bufferViews.push(bufferView);
            animationData.outputs.forEach(function (output) {
                output.forEach(function (entry) {
                    binaryWriter.setFloat32(entry);
                });
            });
            accessor = _glTFUtilities__WEBPACK_IMPORTED_MODULE_1__._GLTFUtilities._CreateAccessor(bufferViews.length - 1, "".concat(name, "  data"), dataAccessorType, 5126 /* AccessorComponentType.FLOAT */, outputLength, null, null, null);
            accessors.push(accessor);
            dataAccessorIndex = accessors.length - 1;
            // create sampler
            animationSampler = {
                interpolation: animationData.samplerInterpolation,
                input: keyframeAccessorIndex,
                output: dataAccessorIndex,
            };
            glTFAnimation.samplers.push(animationSampler);
            // create channel
            animationChannel = {
                sampler: glTFAnimation.samplers.length - 1,
                target: {
                    node: nodeIndex,
                    path: animationChannelTargetPath,
                },
            };
            glTFAnimation.channels.push(animationChannel);
        }
    };
    /**
     * Create a baked animation
     * @param babylonTransformNode BabylonJS mesh
     * @param animation BabylonJS animation corresponding to the BabylonJS mesh
     * @param animationChannelTargetPath animation target channel
     * @param minFrame minimum animation frame
     * @param maxFrame maximum animation frame
     * @param fps frames per second of the animation
     * @param sampleRate
     * @param inputs input key frames of the animation
     * @param outputs output key frame data of the animation
     * @param minMaxFrames
     * @param minMaxFrames.min
     * @param minMaxFrames.max
     * @param useQuaternion specifies if quaternions should be used
     */
    _GLTFAnimation._CreateBakedAnimation = function (babylonTransformNode, animation, animationChannelTargetPath, minFrame, maxFrame, fps, sampleRate, inputs, outputs, minMaxFrames, useQuaternion) {
        var value;
        var quaternionCache = babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Quaternion.Identity();
        var previousTime = null;
        var time;
        var maxUsedFrame = null;
        var currKeyFrame = null;
        var nextKeyFrame = null;
        var prevKeyFrame = null;
        var endFrame = null;
        minMaxFrames.min = babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Tools.FloatRound(minFrame / fps);
        var keyFrames = animation.getKeys();
        for (var i = 0, length_1 = keyFrames.length; i < length_1; ++i) {
            endFrame = null;
            currKeyFrame = keyFrames[i];
            if (i + 1 < length_1) {
                nextKeyFrame = keyFrames[i + 1];
                if ((currKeyFrame.value.equals && currKeyFrame.value.equals(nextKeyFrame.value)) || currKeyFrame.value === nextKeyFrame.value) {
                    if (i === 0) {
                        // set the first frame to itself
                        endFrame = currKeyFrame.frame;
                    }
                    else {
                        continue;
                    }
                }
                else {
                    endFrame = nextKeyFrame.frame;
                }
            }
            else {
                // at the last key frame
                prevKeyFrame = keyFrames[i - 1];
                if ((currKeyFrame.value.equals && currKeyFrame.value.equals(prevKeyFrame.value)) || currKeyFrame.value === prevKeyFrame.value) {
                    continue;
                }
                else {
                    endFrame = maxFrame;
                }
            }
            if (endFrame) {
                for (var f = currKeyFrame.frame; f <= endFrame; f += sampleRate) {
                    time = babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Tools.FloatRound(f / fps);
                    if (time === previousTime) {
                        continue;
                    }
                    previousTime = time;
                    maxUsedFrame = time;
                    var state = {
                        key: 0,
                        repeatCount: 0,
                        loopMode: animation.loopMode,
                    };
                    value = animation._interpolate(f, state);
                    _GLTFAnimation._SetInterpolatedValue(babylonTransformNode, value, time, animation, animationChannelTargetPath, quaternionCache, inputs, outputs, useQuaternion);
                }
            }
        }
        if (maxUsedFrame) {
            minMaxFrames.max = maxUsedFrame;
        }
    };
    _GLTFAnimation._ConvertFactorToVector3OrQuaternion = function (factor, babylonTransformNode, animation, animationChannelTargetPath, useQuaternion) {
        var basePositionRotationOrScale = _GLTFAnimation._GetBasePositionRotationOrScale(babylonTransformNode, animationChannelTargetPath, useQuaternion);
        // handles single component x, y, z or w component animation by using a base property and animating over a component.
        var property = animation.targetProperty.split(".");
        var componentName = property ? property[1] : ""; // x, y, z, or w component
        var value = useQuaternion ? babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Quaternion.FromArray(basePositionRotationOrScale).normalize() : babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Vector3.FromArray(basePositionRotationOrScale);
        switch (componentName) {
            case "x":
            case "y":
            case "z": {
                value[componentName] = factor;
                break;
            }
            case "w": {
                value.w = factor;
                break;
            }
            default: {
                babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Tools.Error("glTFAnimation: Unsupported component name \"".concat(componentName, "\"!"));
            }
        }
        return value;
    };
    _GLTFAnimation._SetInterpolatedValue = function (babylonTransformNode, value, time, animation, animationChannelTargetPath, quaternionCache, inputs, outputs, useQuaternion) {
        var cacheValue;
        inputs.push(time);
        if (animationChannelTargetPath === "weights" /* AnimationChannelTargetPath.WEIGHTS */) {
            outputs.push([value]);
            return;
        }
        if (animation.dataType === babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Animation.ANIMATIONTYPE_FLOAT) {
            value = this._ConvertFactorToVector3OrQuaternion(value, babylonTransformNode, animation, animationChannelTargetPath, useQuaternion);
        }
        if (animationChannelTargetPath === "rotation" /* AnimationChannelTargetPath.ROTATION */) {
            if (useQuaternion) {
                quaternionCache = value;
            }
            else {
                cacheValue = value;
                babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Quaternion.RotationYawPitchRollToRef(cacheValue.y, cacheValue.x, cacheValue.z, quaternionCache);
            }
            outputs.push(quaternionCache.asArray());
        }
        else {
            // scaling and position animation
            cacheValue = value;
            outputs.push(cacheValue.asArray());
        }
    };
    /**
     * Creates linear animation from the animation key frames
     * @param babylonTransformNode BabylonJS mesh
     * @param animation BabylonJS animation
     * @param animationChannelTargetPath The target animation channel
     * @param inputs Array to store the key frame times
     * @param outputs Array to store the key frame data
     * @param useQuaternion Specifies if quaternions are used in the animation
     */
    _GLTFAnimation._CreateLinearOrStepAnimation = function (babylonTransformNode, animation, animationChannelTargetPath, inputs, outputs, useQuaternion) {
        for (var _i = 0, _a = animation.getKeys(); _i < _a.length; _i++) {
            var keyFrame = _a[_i];
            inputs.push(keyFrame.frame / animation.framePerSecond); // keyframes in seconds.
            _GLTFAnimation._AddKeyframeValue(keyFrame, animation, outputs, animationChannelTargetPath, babylonTransformNode, useQuaternion);
        }
    };
    /**
     * Creates cubic spline animation from the animation key frames
     * @param babylonTransformNode BabylonJS mesh
     * @param animation BabylonJS animation
     * @param animationChannelTargetPath The target animation channel
     * @param inputs Array to store the key frame times
     * @param outputs Array to store the key frame data
     * @param useQuaternion Specifies if quaternions are used in the animation
     */
    _GLTFAnimation._CreateCubicSplineAnimation = function (babylonTransformNode, animation, animationChannelTargetPath, inputs, outputs, useQuaternion) {
        animation.getKeys().forEach(function (keyFrame) {
            inputs.push(keyFrame.frame / animation.framePerSecond); // keyframes in seconds.
            _GLTFAnimation._AddSplineTangent(_TangentType.INTANGENT, outputs, animationChannelTargetPath, "CUBICSPLINE" /* AnimationSamplerInterpolation.CUBICSPLINE */, keyFrame, useQuaternion);
            _GLTFAnimation._AddKeyframeValue(keyFrame, animation, outputs, animationChannelTargetPath, babylonTransformNode, useQuaternion);
            _GLTFAnimation._AddSplineTangent(_TangentType.OUTTANGENT, outputs, animationChannelTargetPath, "CUBICSPLINE" /* AnimationSamplerInterpolation.CUBICSPLINE */, keyFrame, useQuaternion);
        });
    };
    _GLTFAnimation._GetBasePositionRotationOrScale = function (babylonTransformNode, animationChannelTargetPath, useQuaternion) {
        var basePositionRotationOrScale;
        if (animationChannelTargetPath === "rotation" /* AnimationChannelTargetPath.ROTATION */) {
            if (useQuaternion) {
                var q = babylonTransformNode.rotationQuaternion;
                basePositionRotationOrScale = (q !== null && q !== void 0 ? q : babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Quaternion.Identity()).asArray();
            }
            else {
                var r = babylonTransformNode.rotation;
                basePositionRotationOrScale = (r !== null && r !== void 0 ? r : babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Vector3.Zero()).asArray();
            }
        }
        else if (animationChannelTargetPath === "translation" /* AnimationChannelTargetPath.TRANSLATION */) {
            var p = babylonTransformNode.position;
            basePositionRotationOrScale = (p !== null && p !== void 0 ? p : babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Vector3.Zero()).asArray();
        }
        else {
            // scale
            var s = babylonTransformNode.scaling;
            basePositionRotationOrScale = (s !== null && s !== void 0 ? s : babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Vector3.One()).asArray();
        }
        return basePositionRotationOrScale;
    };
    /**
     * Adds a key frame value
     * @param keyFrame
     * @param animation
     * @param outputs
     * @param animationChannelTargetPath
     * @param babylonTransformNode
     * @param useQuaternion
     */
    _GLTFAnimation._AddKeyframeValue = function (keyFrame, animation, outputs, animationChannelTargetPath, babylonTransformNode, useQuaternion) {
        var newPositionRotationOrScale;
        var animationType = animation.dataType;
        if (animationType === babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Animation.ANIMATIONTYPE_VECTOR3) {
            var value = keyFrame.value.asArray();
            if (animationChannelTargetPath === "rotation" /* AnimationChannelTargetPath.ROTATION */) {
                var array = babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Vector3.FromArray(value);
                var rotationQuaternion = babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Quaternion.RotationYawPitchRoll(array.y, array.x, array.z);
                value = rotationQuaternion.asArray();
            }
            outputs.push(value); // scale  vector.
        }
        else if (animationType === babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Animation.ANIMATIONTYPE_FLOAT) {
            if (animationChannelTargetPath === "weights" /* AnimationChannelTargetPath.WEIGHTS */) {
                outputs.push([keyFrame.value]);
            }
            else {
                // handles single component x, y, z or w component animation by using a base property and animating over a component.
                newPositionRotationOrScale = this._ConvertFactorToVector3OrQuaternion(keyFrame.value, babylonTransformNode, animation, animationChannelTargetPath, useQuaternion);
                if (newPositionRotationOrScale) {
                    if (animationChannelTargetPath === "rotation" /* AnimationChannelTargetPath.ROTATION */) {
                        var posRotScale = useQuaternion
                            ? newPositionRotationOrScale
                            : babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Quaternion.RotationYawPitchRoll(newPositionRotationOrScale.y, newPositionRotationOrScale.x, newPositionRotationOrScale.z).normalize();
                        outputs.push(posRotScale.asArray());
                    }
                    outputs.push(newPositionRotationOrScale.asArray());
                }
            }
        }
        else if (animationType === babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Animation.ANIMATIONTYPE_QUATERNION) {
            outputs.push(keyFrame.value.normalize().asArray());
        }
        else {
            babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Tools.Error("glTFAnimation: Unsupported key frame values for animation!");
        }
    };
    /**
     * @internal
     * Determine the interpolation based on the key frames
     * @param keyFrames
     * @param animationChannelTargetPath
     * @param useQuaternion
     */
    _GLTFAnimation._DeduceInterpolation = function (keyFrames, animationChannelTargetPath, useQuaternion) {
        var interpolationType;
        var shouldBakeAnimation = false;
        var key;
        if (animationChannelTargetPath === "rotation" /* AnimationChannelTargetPath.ROTATION */ && !useQuaternion) {
            return { interpolationType: "LINEAR" /* AnimationSamplerInterpolation.LINEAR */, shouldBakeAnimation: true };
        }
        for (var i = 0, length_2 = keyFrames.length; i < length_2; ++i) {
            key = keyFrames[i];
            if (key.inTangent || key.outTangent) {
                if (interpolationType) {
                    if (interpolationType !== "CUBICSPLINE" /* AnimationSamplerInterpolation.CUBICSPLINE */) {
                        interpolationType = "LINEAR" /* AnimationSamplerInterpolation.LINEAR */;
                        shouldBakeAnimation = true;
                        break;
                    }
                }
                else {
                    interpolationType = "CUBICSPLINE" /* AnimationSamplerInterpolation.CUBICSPLINE */;
                }
            }
            else {
                if (interpolationType) {
                    if (interpolationType === "CUBICSPLINE" /* AnimationSamplerInterpolation.CUBICSPLINE */ ||
                        (key.interpolation && key.interpolation === 1 /* AnimationKeyInterpolation.STEP */ && interpolationType !== "STEP" /* AnimationSamplerInterpolation.STEP */)) {
                        interpolationType = "LINEAR" /* AnimationSamplerInterpolation.LINEAR */;
                        shouldBakeAnimation = true;
                        break;
                    }
                }
                else {
                    if (key.interpolation && key.interpolation === 1 /* AnimationKeyInterpolation.STEP */) {
                        interpolationType = "STEP" /* AnimationSamplerInterpolation.STEP */;
                    }
                    else {
                        interpolationType = "LINEAR" /* AnimationSamplerInterpolation.LINEAR */;
                    }
                }
            }
        }
        if (!interpolationType) {
            interpolationType = "LINEAR" /* AnimationSamplerInterpolation.LINEAR */;
        }
        return { interpolationType: interpolationType, shouldBakeAnimation: shouldBakeAnimation };
    };
    /**
     * Adds an input tangent or output tangent to the output data
     * If an input tangent or output tangent is missing, it uses the zero vector or zero quaternion
     * @param tangentType Specifies which type of tangent to handle (inTangent or outTangent)
     * @param outputs The animation data by keyframe
     * @param animationChannelTargetPath The target animation channel
     * @param interpolation The interpolation type
     * @param keyFrame The key frame with the animation data
     * @param useQuaternion Specifies if quaternions are used
     */
    _GLTFAnimation._AddSplineTangent = function (tangentType, outputs, animationChannelTargetPath, interpolation, keyFrame, useQuaternion) {
        var tangent;
        var tangentValue = tangentType === _TangentType.INTANGENT ? keyFrame.inTangent : keyFrame.outTangent;
        if (interpolation === "CUBICSPLINE" /* AnimationSamplerInterpolation.CUBICSPLINE */) {
            if (animationChannelTargetPath === "rotation" /* AnimationChannelTargetPath.ROTATION */) {
                if (tangentValue) {
                    if (useQuaternion) {
                        tangent = tangentValue.asArray();
                    }
                    else {
                        var array = tangentValue;
                        tangent = babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Quaternion.RotationYawPitchRoll(array.y, array.x, array.z).asArray();
                    }
                }
                else {
                    tangent = [0, 0, 0, 0];
                }
            }
            else if (animationChannelTargetPath === "weights" /* AnimationChannelTargetPath.WEIGHTS */) {
                if (tangentValue) {
                    tangent = [tangentValue];
                }
                else {
                    tangent = [0];
                }
            }
            else {
                if (tangentValue) {
                    tangent = tangentValue.asArray();
                }
                else {
                    tangent = [0, 0, 0];
                }
            }
            outputs.push(tangent);
        }
    };
    /**
     * Get the minimum and maximum key frames' frame values
     * @param keyFrames animation key frames
     * @returns the minimum and maximum key frame value
     */
    _GLTFAnimation._CalculateMinMaxKeyFrames = function (keyFrames) {
        var min = Infinity;
        var max = -Infinity;
        keyFrames.forEach(function (keyFrame) {
            min = Math.min(min, keyFrame.frame);
            max = Math.max(max, keyFrame.frame);
        });
        return { min: min, max: max };
    };
    return _GLTFAnimation;
}());



/***/ }),

/***/ "../../../dev/serializers/src/glTF/2.0/glTFData.ts":
/*!*********************************************************!*\
  !*** ../../../dev/serializers/src/glTF/2.0/glTFData.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GLTFData: () => (/* binding */ GLTFData)
/* harmony export */ });
/**
 * Class for holding and downloading glTF file data
 */
var GLTFData = /** @class */ (function () {
    /**
     * Initializes the glTF file object
     */
    function GLTFData() {
        this.glTFFiles = {};
    }
    /**
     * Downloads the glTF data as files based on their names and data
     */
    GLTFData.prototype.downloadFiles = function () {
        /**
         * Checks for a matching suffix at the end of a string (for ES5 and lower)
         * @param str Source string
         * @param suffix Suffix to search for in the source string
         * @returns Boolean indicating whether the suffix was found (true) or not (false)
         */
        function endsWith(str, suffix) {
            return str.indexOf(suffix, str.length - suffix.length) !== -1;
        }
        for (var key in this.glTFFiles) {
            var link = document.createElement("a");
            document.body.appendChild(link);
            link.setAttribute("type", "hidden");
            link.download = key;
            var blob = this.glTFFiles[key];
            var mimeType = void 0;
            if (endsWith(key, ".glb")) {
                mimeType = { type: "model/gltf-binary" };
            }
            else if (endsWith(key, ".bin")) {
                mimeType = { type: "application/octet-stream" };
            }
            else if (endsWith(key, ".gltf")) {
                mimeType = { type: "model/gltf+json" };
            }
            else if (endsWith(key, ".jpeg") || endsWith(key, ".jpg")) {
                mimeType = { type: "image/jpeg" /* ImageMimeType.JPEG */ };
            }
            else if (endsWith(key, ".png")) {
                mimeType = { type: "image/png" /* ImageMimeType.PNG */ };
            }
            link.href = window.URL.createObjectURL(new Blob([blob], mimeType));
            link.click();
        }
    };
    return GLTFData;
}());



/***/ }),

/***/ "../../../dev/serializers/src/glTF/2.0/glTFExporter.ts":
/*!*************************************************************!*\
  !*** ../../../dev/serializers/src/glTF/2.0/glTFExporter.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   _BinaryWriter: () => (/* binding */ _BinaryWriter),
/* harmony export */   _Exporter: () => (/* binding */ _Exporter)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! tslib */ "../../../../node_modules/tslib/tslib.es6.mjs");
/* harmony import */ var babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! babylonjs/Materials/multiMaterial */ "babylonjs/Maths/math.vector");
/* harmony import */ var babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _glTFMaterialExporter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./glTFMaterialExporter */ "../../../dev/serializers/src/glTF/2.0/glTFMaterialExporter.ts");
/* harmony import */ var _glTFUtilities__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./glTFUtilities */ "../../../dev/serializers/src/glTF/2.0/glTFUtilities.ts");
/* harmony import */ var _glTFData__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./glTFData */ "../../../dev/serializers/src/glTF/2.0/glTFData.ts");
/* harmony import */ var _glTFAnimation__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./glTFAnimation */ "../../../dev/serializers/src/glTF/2.0/glTFAnimation.ts");


















// Matrix that converts handedness on the X-axis.
var convertHandednessMatrix = babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Matrix.Compose(new babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Vector3(-1, 1, 1), babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Quaternion.Identity(), babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Vector3.Zero());
// 180 degrees rotation in Y.
var rotation180Y = new babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Quaternion(0, 1, 0, 0);
function isNoopNode(node, useRightHandedSystem) {
    if (!(node instanceof babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.TransformNode)) {
        return false;
    }
    // Transform
    if (useRightHandedSystem) {
        var matrix = node.getWorldMatrix();
        if (!matrix.isIdentity()) {
            return false;
        }
    }
    else {
        var matrix = node.getWorldMatrix().multiplyToRef(convertHandednessMatrix, babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.TmpVectors.Matrix[0]);
        if (!matrix.isIdentity()) {
            return false;
        }
    }
    // Geometry
    if ((node instanceof babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Mesh && node.geometry) || (node instanceof babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.InstancedMesh && node.sourceMesh.geometry)) {
        return false;
    }
    return true;
}
function convertNodeHandedness(node) {
    var translation = babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Vector3.FromArrayToRef(node.translation || [0, 0, 0], 0, babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.TmpVectors.Vector3[0]);
    var rotation = babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Quaternion.FromArrayToRef(node.rotation || [0, 0, 0, 1], 0, babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.TmpVectors.Quaternion[0]);
    var scale = babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Vector3.FromArrayToRef(node.scale || [1, 1, 1], 0, babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.TmpVectors.Vector3[1]);
    var matrix = babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Matrix.ComposeToRef(scale, rotation, translation, babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.TmpVectors.Matrix[0]).multiplyToRef(convertHandednessMatrix, babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.TmpVectors.Matrix[0]);
    matrix.decompose(scale, rotation, translation);
    if (translation.equalsToFloats(0, 0, 0)) {
        delete node.translation;
    }
    else {
        node.translation = translation.asArray();
    }
    if (babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Quaternion.IsIdentity(rotation)) {
        delete node.rotation;
    }
    else {
        node.rotation = rotation.asArray();
    }
    if (scale.equalsToFloats(1, 1, 1)) {
        delete node.scale;
    }
    else {
        node.scale = scale.asArray();
    }
}
function getBinaryWriterFunc(binaryWriter, attributeComponentKind) {
    switch (attributeComponentKind) {
        case 5121 /* AccessorComponentType.UNSIGNED_BYTE */: {
            return binaryWriter.setUInt8.bind(binaryWriter);
        }
        case 5123 /* AccessorComponentType.UNSIGNED_SHORT */: {
            return binaryWriter.setUInt16.bind(binaryWriter);
        }
        case 5125 /* AccessorComponentType.UNSIGNED_INT */: {
            return binaryWriter.setUInt32.bind(binaryWriter);
        }
        case 5126 /* AccessorComponentType.FLOAT */: {
            return binaryWriter.setFloat32.bind(binaryWriter);
        }
        default: {
            babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Tools.Warn("Unsupported Attribute Component kind: " + attributeComponentKind);
            return null;
        }
    }
}
/**
 * Converts Babylon Scene into glTF 2.0.
 * @internal
 */
var _Exporter = /** @class */ (function () {
    /**
     * Creates a glTF Exporter instance, which can accept optional exporter options
     * @param babylonScene Babylon scene object
     * @param options Options to modify the behavior of the exporter
     */
    function _Exporter(babylonScene, options) {
        this._extensions = {};
        this._glTF = {
            asset: { generator: "Babylon.js v".concat(babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Engine.Version), version: "2.0" },
        };
        babylonScene = babylonScene || babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.EngineStore.LastCreatedScene;
        if (!babylonScene) {
            return;
        }
        this._babylonScene = babylonScene;
        this._bufferViews = [];
        this._accessors = [];
        this._meshes = [];
        this._scenes = [];
        this._cameras = [];
        this._nodes = [];
        this._images = [];
        this._materials = [];
        this._materialMap = [];
        this._textures = [];
        this._samplers = [];
        this._skins = [];
        this._animations = [];
        this._imageData = {};
        this._orderedImageData = [];
        this._options = options || {};
        this._animationSampleRate = this._options.animationSampleRate || 1 / 60;
        this._glTFMaterialExporter = new _glTFMaterialExporter__WEBPACK_IMPORTED_MODULE_1__._GLTFMaterialExporter(this);
        this._loadExtensions();
    }
    _Exporter.prototype._applyExtension = function (node, extensions, index, actionAsync) {
        var _this = this;
        if (index >= extensions.length) {
            return Promise.resolve(node);
        }
        var currentPromise = actionAsync(extensions[index], node);
        if (!currentPromise) {
            return this._applyExtension(node, extensions, index + 1, actionAsync);
        }
        return currentPromise.then(function (newNode) { return _this._applyExtension(newNode, extensions, index + 1, actionAsync); });
    };
    _Exporter.prototype._applyExtensions = function (node, actionAsync) {
        var extensions = [];
        for (var _i = 0, _a = _Exporter._ExtensionNames; _i < _a.length; _i++) {
            var name_1 = _a[_i];
            extensions.push(this._extensions[name_1]);
        }
        return this._applyExtension(node, extensions, 0, actionAsync);
    };
    _Exporter.prototype._extensionsPreExportTextureAsync = function (context, babylonTexture, mimeType) {
        return this._applyExtensions(babylonTexture, function (extension, node) { return extension.preExportTextureAsync && extension.preExportTextureAsync(context, node, mimeType); });
    };
    _Exporter.prototype._extensionsPostExportMeshPrimitiveAsync = function (context, meshPrimitive, babylonSubMesh, binaryWriter) {
        return this._applyExtensions(meshPrimitive, function (extension, node) { return extension.postExportMeshPrimitiveAsync && extension.postExportMeshPrimitiveAsync(context, node, babylonSubMesh, binaryWriter); });
    };
    _Exporter.prototype._extensionsPostExportNodeAsync = function (context, node, babylonNode, nodeMap, binaryWriter) {
        return this._applyExtensions(node, function (extension, node) { return extension.postExportNodeAsync && extension.postExportNodeAsync(context, node, babylonNode, nodeMap, binaryWriter); });
    };
    _Exporter.prototype._extensionsPostExportMaterialAsync = function (context, material, babylonMaterial) {
        return this._applyExtensions(material, function (extension, node) { return extension.postExportMaterialAsync && extension.postExportMaterialAsync(context, node, babylonMaterial); });
    };
    _Exporter.prototype._extensionsPostExportMaterialAdditionalTextures = function (context, material, babylonMaterial) {
        var output = [];
        for (var _i = 0, _a = _Exporter._ExtensionNames; _i < _a.length; _i++) {
            var name_2 = _a[_i];
            var extension = this._extensions[name_2];
            if (extension.postExportMaterialAdditionalTextures) {
                output.push.apply(output, extension.postExportMaterialAdditionalTextures(context, material, babylonMaterial));
            }
        }
        return output;
    };
    _Exporter.prototype._extensionsPostExportTextures = function (context, textureInfo, babylonTexture) {
        for (var _i = 0, _a = _Exporter._ExtensionNames; _i < _a.length; _i++) {
            var name_3 = _a[_i];
            var extension = this._extensions[name_3];
            if (extension.postExportTexture) {
                extension.postExportTexture(context, textureInfo, babylonTexture);
            }
        }
    };
    _Exporter.prototype._forEachExtensions = function (action) {
        for (var _i = 0, _a = _Exporter._ExtensionNames; _i < _a.length; _i++) {
            var name_4 = _a[_i];
            var extension = this._extensions[name_4];
            if (extension.enabled) {
                action(extension);
            }
        }
    };
    _Exporter.prototype._extensionsOnExporting = function () {
        var _this = this;
        this._forEachExtensions(function (extension) {
            if (extension.wasUsed) {
                if (_this._glTF.extensionsUsed == null) {
                    _this._glTF.extensionsUsed = [];
                }
                if (_this._glTF.extensionsUsed.indexOf(extension.name) === -1) {
                    _this._glTF.extensionsUsed.push(extension.name);
                }
                if (extension.required) {
                    if (_this._glTF.extensionsRequired == null) {
                        _this._glTF.extensionsRequired = [];
                    }
                    if (_this._glTF.extensionsRequired.indexOf(extension.name) === -1) {
                        _this._glTF.extensionsRequired.push(extension.name);
                    }
                }
                if (_this._glTF.extensions == null) {
                    _this._glTF.extensions = {};
                }
                if (extension.onExporting) {
                    extension.onExporting();
                }
            }
        });
    };
    /**
     * Load glTF serializer extensions
     */
    _Exporter.prototype._loadExtensions = function () {
        for (var _i = 0, _a = _Exporter._ExtensionNames; _i < _a.length; _i++) {
            var name_5 = _a[_i];
            var extension = _Exporter._ExtensionFactories[name_5](this);
            this._extensions[name_5] = extension;
        }
    };
    _Exporter.prototype.dispose = function () {
        for (var extensionKey in this._extensions) {
            var extension = this._extensions[extensionKey];
            extension.dispose();
        }
    };
    Object.defineProperty(_Exporter.prototype, "options", {
        get: function () {
            return this._options;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Registers a glTF exporter extension
     * @param name Name of the extension to export
     * @param factory The factory function that creates the exporter extension
     */
    _Exporter.RegisterExtension = function (name, factory) {
        if (_Exporter.UnregisterExtension(name)) {
            babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Tools.Warn("Extension with the name ".concat(name, " already exists"));
        }
        _Exporter._ExtensionFactories[name] = factory;
        _Exporter._ExtensionNames.push(name);
    };
    /**
     * Un-registers an exporter extension
     * @param name The name fo the exporter extension
     * @returns A boolean indicating whether the extension has been un-registered
     */
    _Exporter.UnregisterExtension = function (name) {
        if (!_Exporter._ExtensionFactories[name]) {
            return false;
        }
        delete _Exporter._ExtensionFactories[name];
        var index = _Exporter._ExtensionNames.indexOf(name);
        if (index !== -1) {
            _Exporter._ExtensionNames.splice(index, 1);
        }
        return true;
    };
    _Exporter.prototype._reorderIndicesBasedOnPrimitiveMode = function (submesh, primitiveMode, babylonIndices, byteOffset, binaryWriter) {
        switch (primitiveMode) {
            case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Material.TriangleFillMode: {
                if (!byteOffset) {
                    byteOffset = 0;
                }
                for (var i = submesh.indexStart, length_1 = submesh.indexStart + submesh.indexCount; i < length_1; i = i + 3) {
                    var index = byteOffset + i * 4;
                    // swap the second and third indices
                    var secondIndex = binaryWriter.getUInt32(index + 4);
                    var thirdIndex = binaryWriter.getUInt32(index + 8);
                    binaryWriter.setUInt32(thirdIndex, index + 4);
                    binaryWriter.setUInt32(secondIndex, index + 8);
                }
                break;
            }
            case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Material.TriangleFanDrawMode: {
                for (var i = submesh.indexStart + submesh.indexCount - 1, start = submesh.indexStart; i >= start; --i) {
                    binaryWriter.setUInt32(babylonIndices[i], byteOffset);
                    byteOffset += 4;
                }
                break;
            }
            case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Material.TriangleStripDrawMode: {
                if (submesh.indexCount >= 3) {
                    binaryWriter.setUInt32(babylonIndices[submesh.indexStart + 2], byteOffset + 4);
                    binaryWriter.setUInt32(babylonIndices[submesh.indexStart + 1], byteOffset + 8);
                }
                break;
            }
        }
    };
    /**
     * Reorders the vertex attribute data based on the primitive mode.  This is necessary when indices are not available and the winding order is
     * clock-wise during export to glTF
     * @param submesh BabylonJS submesh
     * @param primitiveMode Primitive mode of the mesh
     * @param vertexBufferKind The type of vertex attribute
     * @param meshAttributeArray The vertex attribute data
     * @param byteOffset The offset to the binary data
     * @param binaryWriter The binary data for the glTF file
     */
    _Exporter.prototype._reorderVertexAttributeDataBasedOnPrimitiveMode = function (submesh, primitiveMode, vertexBufferKind, meshAttributeArray, byteOffset, binaryWriter) {
        switch (primitiveMode) {
            case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Material.TriangleFillMode: {
                this._reorderTriangleFillMode(submesh, vertexBufferKind, meshAttributeArray, byteOffset, binaryWriter);
                break;
            }
            case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Material.TriangleStripDrawMode: {
                this._reorderTriangleStripDrawMode(submesh, vertexBufferKind, meshAttributeArray, byteOffset, binaryWriter);
                break;
            }
            case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Material.TriangleFanDrawMode: {
                this._reorderTriangleFanMode(submesh, vertexBufferKind, meshAttributeArray, byteOffset, binaryWriter);
                break;
            }
        }
    };
    /**
     * Reorders the vertex attributes in the correct triangle mode order .  This is necessary when indices are not available and the winding order is
     * clock-wise during export to glTF
     * @param submesh BabylonJS submesh
     * @param vertexBufferKind The type of vertex attribute
     * @param meshAttributeArray The vertex attribute data
     * @param byteOffset The offset to the binary data
     * @param binaryWriter The binary data for the glTF file
     */
    _Exporter.prototype._reorderTriangleFillMode = function (submesh, vertexBufferKind, meshAttributeArray, byteOffset, binaryWriter) {
        var vertexBuffer = this._getVertexBufferFromMesh(vertexBufferKind, submesh.getMesh());
        if (vertexBuffer) {
            var stride = vertexBuffer.byteStride / babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.GetTypeByteLength(vertexBuffer.type);
            if (submesh.verticesCount % 3 !== 0) {
                babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Tools.Error("The submesh vertices for the triangle fill mode is not divisible by 3!");
            }
            else {
                var vertexData = [];
                var index = 0;
                switch (vertexBufferKind) {
                    case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.PositionKind:
                    case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.NormalKind: {
                        for (var x = submesh.verticesStart; x < submesh.verticesStart + submesh.verticesCount; x = x + 3) {
                            index = x * stride;
                            vertexData.push(babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Vector3.FromArray(meshAttributeArray, index));
                            vertexData.push(babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Vector3.FromArray(meshAttributeArray, index + 2 * stride));
                            vertexData.push(babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Vector3.FromArray(meshAttributeArray, index + stride));
                        }
                        break;
                    }
                    case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.TangentKind: {
                        for (var x = submesh.verticesStart; x < submesh.verticesStart + submesh.verticesCount; x = x + 3) {
                            index = x * stride;
                            vertexData.push(babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Vector4.FromArray(meshAttributeArray, index));
                            vertexData.push(babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Vector4.FromArray(meshAttributeArray, index + 2 * stride));
                            vertexData.push(babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Vector4.FromArray(meshAttributeArray, index + stride));
                        }
                        break;
                    }
                    case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.ColorKind: {
                        var size = vertexBuffer.getSize();
                        for (var x = submesh.verticesStart; x < submesh.verticesStart + submesh.verticesCount; x = x + size) {
                            index = x * stride;
                            if (size === 4) {
                                vertexData.push(babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Vector4.FromArray(meshAttributeArray, index));
                                vertexData.push(babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Vector4.FromArray(meshAttributeArray, index + 2 * stride));
                                vertexData.push(babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Vector4.FromArray(meshAttributeArray, index + stride));
                            }
                            else {
                                vertexData.push(babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Vector3.FromArray(meshAttributeArray, index));
                                vertexData.push(babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Vector3.FromArray(meshAttributeArray, index + 2 * stride));
                                vertexData.push(babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Vector3.FromArray(meshAttributeArray, index + stride));
                            }
                        }
                        break;
                    }
                    case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.UVKind:
                    case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.UV2Kind: {
                        for (var x = submesh.verticesStart; x < submesh.verticesStart + submesh.verticesCount; x = x + 3) {
                            index = x * stride;
                            vertexData.push(babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Vector2.FromArray(meshAttributeArray, index));
                            vertexData.push(babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Vector2.FromArray(meshAttributeArray, index + 2 * stride));
                            vertexData.push(babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Vector2.FromArray(meshAttributeArray, index + stride));
                        }
                        break;
                    }
                    default: {
                        babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Tools.Error("Unsupported Vertex Buffer type: ".concat(vertexBufferKind));
                    }
                }
                this._writeVertexAttributeData(vertexData, byteOffset, vertexBufferKind, binaryWriter);
            }
        }
        else {
            babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Tools.Warn("reorderTriangleFillMode: Vertex Buffer Kind ".concat(vertexBufferKind, " not present!"));
        }
    };
    /**
     * Reorders the vertex attributes in the correct triangle strip order.  This is necessary when indices are not available and the winding order is
     * clock-wise during export to glTF
     * @param submesh BabylonJS submesh
     * @param vertexBufferKind The type of vertex attribute
     * @param meshAttributeArray The vertex attribute data
     * @param byteOffset The offset to the binary data
     * @param binaryWriter The binary data for the glTF file
     */
    _Exporter.prototype._reorderTriangleStripDrawMode = function (submesh, vertexBufferKind, meshAttributeArray, byteOffset, binaryWriter) {
        var vertexBuffer = this._getVertexBufferFromMesh(vertexBufferKind, submesh.getMesh());
        if (vertexBuffer) {
            var stride = vertexBuffer.byteStride / babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.GetTypeByteLength(vertexBuffer.type);
            var vertexData = [];
            var index = 0;
            switch (vertexBufferKind) {
                case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.PositionKind:
                case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.NormalKind: {
                    index = submesh.verticesStart;
                    vertexData.push(babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Vector3.FromArray(meshAttributeArray, index + 2 * stride));
                    vertexData.push(babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Vector3.FromArray(meshAttributeArray, index + stride));
                    break;
                }
                case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.TangentKind: {
                    for (var x = submesh.verticesStart + submesh.verticesCount - 1; x >= submesh.verticesStart; --x) {
                        index = x * stride;
                        vertexData.push(babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Vector4.FromArray(meshAttributeArray, index));
                    }
                    break;
                }
                case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.ColorKind: {
                    for (var x = submesh.verticesStart + submesh.verticesCount - 1; x >= submesh.verticesStart; --x) {
                        index = x * stride;
                        vertexBuffer.getSize() === 4
                            ? vertexData.push(babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Vector4.FromArray(meshAttributeArray, index))
                            : vertexData.push(babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Vector3.FromArray(meshAttributeArray, index));
                    }
                    break;
                }
                case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.UVKind:
                case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.UV2Kind: {
                    for (var x = submesh.verticesStart + submesh.verticesCount - 1; x >= submesh.verticesStart; --x) {
                        index = x * stride;
                        vertexData.push(babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Vector2.FromArray(meshAttributeArray, index));
                    }
                    break;
                }
                default: {
                    babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Tools.Error("Unsupported Vertex Buffer type: ".concat(vertexBufferKind));
                }
            }
            this._writeVertexAttributeData(vertexData, byteOffset + 12, vertexBufferKind, binaryWriter);
        }
        else {
            babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Tools.Warn("reorderTriangleStripDrawMode: Vertex buffer kind ".concat(vertexBufferKind, " not present!"));
        }
    };
    /**
     * Reorders the vertex attributes in the correct triangle fan order.  This is necessary when indices are not available and the winding order is
     * clock-wise during export to glTF
     * @param submesh BabylonJS submesh
     * @param vertexBufferKind The type of vertex attribute
     * @param meshAttributeArray The vertex attribute data
     * @param byteOffset The offset to the binary data
     * @param binaryWriter The binary data for the glTF file
     */
    _Exporter.prototype._reorderTriangleFanMode = function (submesh, vertexBufferKind, meshAttributeArray, byteOffset, binaryWriter) {
        var vertexBuffer = this._getVertexBufferFromMesh(vertexBufferKind, submesh.getMesh());
        if (vertexBuffer) {
            var stride = vertexBuffer.byteStride / babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.GetTypeByteLength(vertexBuffer.type);
            var vertexData = [];
            var index = 0;
            switch (vertexBufferKind) {
                case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.PositionKind:
                case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.NormalKind: {
                    for (var x = submesh.verticesStart + submesh.verticesCount - 1; x >= submesh.verticesStart; --x) {
                        index = x * stride;
                        vertexData.push(babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Vector3.FromArray(meshAttributeArray, index));
                    }
                    break;
                }
                case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.TangentKind: {
                    for (var x = submesh.verticesStart + submesh.verticesCount - 1; x >= submesh.verticesStart; --x) {
                        index = x * stride;
                        vertexData.push(babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Vector4.FromArray(meshAttributeArray, index));
                    }
                    break;
                }
                case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.ColorKind: {
                    for (var x = submesh.verticesStart + submesh.verticesCount - 1; x >= submesh.verticesStart; --x) {
                        index = x * stride;
                        vertexData.push(babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Vector4.FromArray(meshAttributeArray, index));
                        vertexBuffer.getSize() === 4
                            ? vertexData.push(babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Vector4.FromArray(meshAttributeArray, index))
                            : vertexData.push(babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Vector3.FromArray(meshAttributeArray, index));
                    }
                    break;
                }
                case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.UVKind:
                case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.UV2Kind: {
                    for (var x = submesh.verticesStart + submesh.verticesCount - 1; x >= submesh.verticesStart; --x) {
                        index = x * stride;
                        vertexData.push(babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Vector2.FromArray(meshAttributeArray, index));
                    }
                    break;
                }
                default: {
                    babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Tools.Error("Unsupported Vertex Buffer type: ".concat(vertexBufferKind));
                }
            }
            this._writeVertexAttributeData(vertexData, byteOffset, vertexBufferKind, binaryWriter);
        }
        else {
            babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Tools.Warn("reorderTriangleFanMode: Vertex buffer kind ".concat(vertexBufferKind, " not present!"));
        }
    };
    /**
     * Writes the vertex attribute data to binary
     * @param vertices The vertices to write to the binary writer
     * @param byteOffset The offset into the binary writer to overwrite binary data
     * @param vertexAttributeKind The vertex attribute type
     * @param binaryWriter The writer containing the binary data
     */
    _Exporter.prototype._writeVertexAttributeData = function (vertices, byteOffset, vertexAttributeKind, binaryWriter) {
        for (var _i = 0, vertices_1 = vertices; _i < vertices_1.length; _i++) {
            var vertex = vertices_1[_i];
            if (vertexAttributeKind === babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.NormalKind) {
                vertex.normalize();
            }
            else if (vertexAttributeKind === babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.TangentKind && vertex instanceof babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Vector4) {
                _glTFUtilities__WEBPACK_IMPORTED_MODULE_2__._GLTFUtilities._NormalizeTangentFromRef(vertex);
            }
            for (var _a = 0, _b = vertex.asArray(); _a < _b.length; _a++) {
                var component = _b[_a];
                binaryWriter.setFloat32(component, byteOffset);
                byteOffset += 4;
            }
        }
    };
    /**
     * Writes mesh attribute data to a data buffer
     * Returns the bytelength of the data
     * @param vertexBufferKind Indicates what kind of vertex data is being passed in
     * @param attributeComponentKind
     * @param meshAttributeArray Array containing the attribute data
     * @param stride Specifies the space between data
     * @param binaryWriter The buffer to write the binary data to
     * @param babylonTransformNode
     */
    _Exporter.prototype._writeAttributeData = function (vertexBufferKind, attributeComponentKind, meshAttributeArray, stride, binaryWriter, babylonTransformNode) {
        var vertexAttributes = [];
        var index;
        switch (vertexBufferKind) {
            case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.PositionKind: {
                for (var k = 0, length_2 = meshAttributeArray.length / stride; k < length_2; ++k) {
                    index = k * stride;
                    var vertexData = babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Vector3.FromArray(meshAttributeArray, index);
                    vertexAttributes.push(vertexData.asArray());
                }
                break;
            }
            case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.NormalKind: {
                for (var k = 0, length_3 = meshAttributeArray.length / stride; k < length_3; ++k) {
                    index = k * stride;
                    var vertexData = babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Vector3.FromArray(meshAttributeArray, index);
                    vertexAttributes.push(vertexData.normalize().asArray());
                }
                break;
            }
            case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.TangentKind: {
                for (var k = 0, length_4 = meshAttributeArray.length / stride; k < length_4; ++k) {
                    index = k * stride;
                    var vertexData = babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Vector4.FromArray(meshAttributeArray, index);
                    _glTFUtilities__WEBPACK_IMPORTED_MODULE_2__._GLTFUtilities._NormalizeTangentFromRef(vertexData);
                    vertexAttributes.push(vertexData.asArray());
                }
                break;
            }
            case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.ColorKind: {
                var meshMaterial = babylonTransformNode.material;
                var convertToLinear = meshMaterial ? meshMaterial.getClassName() === "StandardMaterial" : true;
                var vertexData = stride === 3 ? new babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Color3() : new babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Color4();
                var useExactSrgbConversions = this._babylonScene.getEngine().useExactSrgbConversions;
                for (var k = 0, length_5 = meshAttributeArray.length / stride; k < length_5; ++k) {
                    index = k * stride;
                    if (stride === 3) {
                        babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Color3.FromArrayToRef(meshAttributeArray, index, vertexData);
                        if (convertToLinear) {
                            vertexData.toLinearSpaceToRef(vertexData, useExactSrgbConversions);
                        }
                    }
                    else {
                        babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Color4.FromArrayToRef(meshAttributeArray, index, vertexData);
                        if (convertToLinear) {
                            vertexData.toLinearSpaceToRef(vertexData, useExactSrgbConversions);
                        }
                    }
                    vertexAttributes.push(vertexData.asArray());
                }
                break;
            }
            case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.UVKind:
            case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.UV2Kind: {
                for (var k = 0, length_6 = meshAttributeArray.length / stride; k < length_6; ++k) {
                    index = k * stride;
                    var vertexData = babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Vector2.FromArray(meshAttributeArray, index);
                    vertexAttributes.push(vertexData.asArray());
                }
                break;
            }
            case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.MatricesIndicesKind:
            case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.MatricesIndicesExtraKind: {
                for (var k = 0, length_7 = meshAttributeArray.length / stride; k < length_7; ++k) {
                    index = k * stride;
                    var vertexData = babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Vector4.FromArray(meshAttributeArray, index);
                    vertexAttributes.push(vertexData.asArray());
                }
                break;
            }
            case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.MatricesWeightsKind:
            case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.MatricesWeightsExtraKind: {
                for (var k = 0, length_8 = meshAttributeArray.length / stride; k < length_8; ++k) {
                    index = k * stride;
                    var vertexData = babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Vector4.FromArray(meshAttributeArray, index);
                    vertexAttributes.push(vertexData.asArray());
                }
                break;
            }
            default: {
                babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Tools.Warn("Unsupported Vertex Buffer Type: " + vertexBufferKind);
                vertexAttributes = [];
            }
        }
        var writeBinaryFunc = getBinaryWriterFunc(binaryWriter, attributeComponentKind);
        if (writeBinaryFunc) {
            for (var _i = 0, vertexAttributes_1 = vertexAttributes; _i < vertexAttributes_1.length; _i++) {
                var vertexAttribute = vertexAttributes_1[_i];
                for (var _a = 0, vertexAttribute_1 = vertexAttribute; _a < vertexAttribute_1.length; _a++) {
                    var component = vertexAttribute_1[_a];
                    writeBinaryFunc(component);
                }
            }
        }
    };
    _Exporter.prototype._createMorphTargetBufferViewKind = function (vertexBufferKind, accessorType, attributeComponentKind, mesh, morphTarget, binaryWriter, byteStride) {
        var vertexCount;
        var minMax;
        var morphData = [];
        var difference = babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.TmpVectors.Vector3[0];
        switch (vertexBufferKind) {
            case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.PositionKind: {
                var morphPositions = morphTarget.getPositions();
                if (!morphPositions) {
                    return null;
                }
                var originalPositions = mesh.getVerticesData(babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.PositionKind, undefined, undefined, true);
                var vertexStart = 0;
                var min = new babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Vector3(Infinity, Infinity, Infinity);
                var max = new babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Vector3(-Infinity, -Infinity, -Infinity);
                vertexCount = originalPositions.length / 3;
                for (var i = vertexStart; i < vertexCount; ++i) {
                    var originalPosition = babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Vector3.FromArray(originalPositions, i * 3);
                    var morphPosition = babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Vector3.FromArray(morphPositions, i * 3);
                    morphPosition.subtractToRef(originalPosition, difference);
                    min.copyFromFloats(Math.min(difference.x, min.x), Math.min(difference.y, min.y), Math.min(difference.z, min.z));
                    max.copyFromFloats(Math.max(difference.x, max.x), Math.max(difference.y, max.y), Math.max(difference.z, max.z));
                    morphData.push(difference.x, difference.y, difference.z);
                }
                minMax = { min: min, max: max };
                break;
            }
            case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.NormalKind: {
                var morphNormals = morphTarget.getNormals();
                if (!morphNormals) {
                    return null;
                }
                var originalNormals = mesh.getVerticesData(babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.NormalKind, undefined, undefined, true);
                var vertexStart = 0;
                vertexCount = originalNormals.length / 3;
                for (var i = vertexStart; i < vertexCount; ++i) {
                    var originalNormal = babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Vector3.FromArray(originalNormals, i * 3).normalize();
                    var morphNormal = babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Vector3.FromArray(morphNormals, i * 3).normalize();
                    morphNormal.subtractToRef(originalNormal, difference);
                    morphData.push(difference.x, difference.y, difference.z);
                }
                break;
            }
            case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.TangentKind: {
                var morphTangents = morphTarget.getTangents();
                if (!morphTangents) {
                    return null;
                }
                // Handedness cannot be displaced, so morph target tangents omit the w component
                accessorType = "VEC3" /* AccessorType.VEC3 */;
                byteStride = 12; // 3 components (x/y/z) * 4 bytes (float32)
                var originalTangents = mesh.getVerticesData(babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.TangentKind, undefined, undefined, true);
                var vertexStart = 0;
                vertexCount = originalTangents.length / 4;
                for (var i = vertexStart; i < vertexCount; ++i) {
                    // Only read the x, y, z components and ignore w
                    var originalTangent = babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Vector3.FromArray(originalTangents, i * 4);
                    _glTFUtilities__WEBPACK_IMPORTED_MODULE_2__._GLTFUtilities._NormalizeTangentFromRef(originalTangent);
                    // Morph target tangents omit the w component so it won't be present in the data
                    var morphTangent = babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Vector3.FromArray(morphTangents, i * 3);
                    _glTFUtilities__WEBPACK_IMPORTED_MODULE_2__._GLTFUtilities._NormalizeTangentFromRef(morphTangent);
                    morphTangent.subtractToRef(originalTangent, difference);
                    morphData.push(difference.x, difference.y, difference.z);
                }
                break;
            }
            default: {
                return null;
            }
        }
        var binaryWriterFunc = getBinaryWriterFunc(binaryWriter, attributeComponentKind);
        if (!binaryWriterFunc) {
            return null;
        }
        var typeByteLength = babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.GetTypeByteLength(attributeComponentKind);
        var byteLength = morphData.length * typeByteLength;
        var bufferView = _glTFUtilities__WEBPACK_IMPORTED_MODULE_2__._GLTFUtilities._CreateBufferView(0, binaryWriter.getByteOffset(), byteLength, byteStride, "".concat(vertexBufferKind, " - ").concat(morphTarget.name, " (Morph Target)"));
        this._bufferViews.push(bufferView);
        var bufferViewIndex = this._bufferViews.length - 1;
        for (var _i = 0, morphData_1 = morphData; _i < morphData_1.length; _i++) {
            var value = morphData_1[_i];
            binaryWriterFunc(value);
        }
        return { bufferViewIndex: bufferViewIndex, vertexCount: vertexCount, accessorType: accessorType, minMax: minMax };
    };
    /**
     * Generates glTF json data
     * @param shouldUseGlb Indicates whether the json should be written for a glb file
     * @param glTFPrefix Text to use when prefixing a glTF file
     * @param prettyPrint Indicates whether the json file should be pretty printed (true) or not (false)
     * @returns json data as string
     */
    _Exporter.prototype._generateJSON = function (shouldUseGlb, glTFPrefix, prettyPrint) {
        var _this = this;
        var buffer = { byteLength: this._totalByteLength };
        var imageName;
        var imageData;
        var bufferView;
        var byteOffset = this._totalByteLength;
        if (buffer.byteLength) {
            this._glTF.buffers = [buffer];
        }
        if (this._nodes && this._nodes.length) {
            this._glTF.nodes = this._nodes;
        }
        if (this._meshes && this._meshes.length) {
            this._glTF.meshes = this._meshes;
        }
        if (this._scenes && this._scenes.length) {
            this._glTF.scenes = this._scenes;
            this._glTF.scene = 0;
        }
        if (this._cameras && this._cameras.length) {
            this._glTF.cameras = this._cameras;
        }
        if (this._bufferViews && this._bufferViews.length) {
            this._glTF.bufferViews = this._bufferViews;
        }
        if (this._accessors && this._accessors.length) {
            this._glTF.accessors = this._accessors;
        }
        if (this._animations && this._animations.length) {
            this._glTF.animations = this._animations;
        }
        if (this._materials && this._materials.length) {
            this._glTF.materials = this._materials;
        }
        if (this._textures && this._textures.length) {
            this._glTF.textures = this._textures;
        }
        if (this._samplers && this._samplers.length) {
            this._glTF.samplers = this._samplers;
        }
        if (this._skins && this._skins.length) {
            this._glTF.skins = this._skins;
        }
        if (this._images && this._images.length) {
            if (!shouldUseGlb) {
                this._glTF.images = this._images;
            }
            else {
                this._glTF.images = [];
                this._images.forEach(function (image) {
                    if (image.uri) {
                        imageData = _this._imageData[image.uri];
                        _this._orderedImageData.push(imageData);
                        imageName = image.uri.split(".")[0] + " image";
                        bufferView = _glTFUtilities__WEBPACK_IMPORTED_MODULE_2__._GLTFUtilities._CreateBufferView(0, byteOffset, imageData.data.byteLength, undefined, imageName);
                        byteOffset += imageData.data.byteLength;
                        _this._bufferViews.push(bufferView);
                        image.bufferView = _this._bufferViews.length - 1;
                        image.name = imageName;
                        image.mimeType = imageData.mimeType;
                        image.uri = undefined;
                        if (!_this._glTF.images) {
                            _this._glTF.images = [];
                        }
                        _this._glTF.images.push(image);
                    }
                });
                // Replace uri with bufferview and mime type for glb
                buffer.byteLength = byteOffset;
            }
        }
        if (!shouldUseGlb) {
            buffer.uri = glTFPrefix + ".bin";
        }
        var jsonText = prettyPrint ? JSON.stringify(this._glTF, null, 2) : JSON.stringify(this._glTF);
        return jsonText;
    };
    /**
     * Generates data for .gltf and .bin files based on the glTF prefix string
     * @param glTFPrefix Text to use when prefixing a glTF file
     * @param dispose Dispose the exporter
     * @returns GLTFData with glTF file data
     */
    _Exporter.prototype._generateGLTFAsync = function (glTFPrefix, dispose) {
        var _this = this;
        if (dispose === void 0) { dispose = true; }
        return this._generateBinaryAsync().then(function (binaryBuffer) {
            _this._extensionsOnExporting();
            var jsonText = _this._generateJSON(false, glTFPrefix, true);
            var bin = new Blob([binaryBuffer], { type: "application/octet-stream" });
            var glTFFileName = glTFPrefix + ".gltf";
            var glTFBinFile = glTFPrefix + ".bin";
            var container = new _glTFData__WEBPACK_IMPORTED_MODULE_3__.GLTFData();
            container.glTFFiles[glTFFileName] = jsonText;
            container.glTFFiles[glTFBinFile] = bin;
            if (_this._imageData) {
                for (var image in _this._imageData) {
                    container.glTFFiles[image] = new Blob([_this._imageData[image].data], { type: _this._imageData[image].mimeType });
                }
            }
            if (dispose) {
                _this.dispose();
            }
            return container;
        });
    };
    /**
     * Creates a binary buffer for glTF
     * @returns array buffer for binary data
     */
    _Exporter.prototype._generateBinaryAsync = function () {
        var _this = this;
        var binaryWriter = new _BinaryWriter(4);
        return this._createSceneAsync(binaryWriter).then(function () {
            if (_this._localEngine) {
                _this._localEngine.dispose();
            }
            return binaryWriter.getArrayBuffer();
        });
    };
    /**
     * Pads the number to a multiple of 4
     * @param num number to pad
     * @returns padded number
     */
    _Exporter.prototype._getPadding = function (num) {
        var remainder = num % 4;
        var padding = remainder === 0 ? remainder : 4 - remainder;
        return padding;
    };
    /**
     * @internal
     */
    _Exporter.prototype._generateGLBAsync = function (glTFPrefix, dispose) {
        var _this = this;
        if (dispose === void 0) { dispose = true; }
        return this._generateBinaryAsync().then(function (binaryBuffer) {
            _this._extensionsOnExporting();
            var jsonText = _this._generateJSON(true);
            var glbFileName = glTFPrefix + ".glb";
            var headerLength = 12;
            var chunkLengthPrefix = 8;
            var jsonLength = jsonText.length;
            var encodedJsonText;
            var imageByteLength = 0;
            // make use of TextEncoder when available
            if (typeof TextEncoder !== "undefined") {
                var encoder = new TextEncoder();
                encodedJsonText = encoder.encode(jsonText);
                jsonLength = encodedJsonText.length;
            }
            for (var i = 0; i < _this._orderedImageData.length; ++i) {
                imageByteLength += _this._orderedImageData[i].data.byteLength;
            }
            var jsonPadding = _this._getPadding(jsonLength);
            var binPadding = _this._getPadding(binaryBuffer.byteLength);
            var imagePadding = _this._getPadding(imageByteLength);
            var byteLength = headerLength + 2 * chunkLengthPrefix + jsonLength + jsonPadding + binaryBuffer.byteLength + binPadding + imageByteLength + imagePadding;
            //header
            var headerBuffer = new ArrayBuffer(headerLength);
            var headerBufferView = new DataView(headerBuffer);
            headerBufferView.setUint32(0, 0x46546c67, true); //glTF
            headerBufferView.setUint32(4, 2, true); // version
            headerBufferView.setUint32(8, byteLength, true); // total bytes in file
            //json chunk
            var jsonChunkBuffer = new ArrayBuffer(chunkLengthPrefix + jsonLength + jsonPadding);
            var jsonChunkBufferView = new DataView(jsonChunkBuffer);
            jsonChunkBufferView.setUint32(0, jsonLength + jsonPadding, true);
            jsonChunkBufferView.setUint32(4, 0x4e4f534a, true);
            //json chunk bytes
            var jsonData = new Uint8Array(jsonChunkBuffer, chunkLengthPrefix);
            // if TextEncoder was available, we can simply copy the encoded array
            if (encodedJsonText) {
                jsonData.set(encodedJsonText);
            }
            else {
                var blankCharCode = "_".charCodeAt(0);
                for (var i = 0; i < jsonLength; ++i) {
                    var charCode = jsonText.charCodeAt(i);
                    // if the character doesn't fit into a single UTF-16 code unit, just put a blank character
                    if (charCode != jsonText.codePointAt(i)) {
                        jsonData[i] = blankCharCode;
                    }
                    else {
                        jsonData[i] = charCode;
                    }
                }
            }
            //json padding
            var jsonPaddingView = new Uint8Array(jsonChunkBuffer, chunkLengthPrefix + jsonLength);
            for (var i = 0; i < jsonPadding; ++i) {
                jsonPaddingView[i] = 0x20;
            }
            //binary chunk
            var binaryChunkBuffer = new ArrayBuffer(chunkLengthPrefix);
            var binaryChunkBufferView = new DataView(binaryChunkBuffer);
            binaryChunkBufferView.setUint32(0, binaryBuffer.byteLength + imageByteLength + imagePadding, true);
            binaryChunkBufferView.setUint32(4, 0x004e4942, true);
            // binary padding
            var binPaddingBuffer = new ArrayBuffer(binPadding);
            var binPaddingView = new Uint8Array(binPaddingBuffer);
            for (var i = 0; i < binPadding; ++i) {
                binPaddingView[i] = 0;
            }
            var imagePaddingBuffer = new ArrayBuffer(imagePadding);
            var imagePaddingView = new Uint8Array(imagePaddingBuffer);
            for (var i = 0; i < imagePadding; ++i) {
                imagePaddingView[i] = 0;
            }
            var glbData = [headerBuffer, jsonChunkBuffer, binaryChunkBuffer, binaryBuffer];
            // binary data
            for (var i = 0; i < _this._orderedImageData.length; ++i) {
                glbData.push(_this._orderedImageData[i].data);
            }
            glbData.push(binPaddingBuffer);
            glbData.push(imagePaddingBuffer);
            var glbFile = new Blob(glbData, { type: "application/octet-stream" });
            var container = new _glTFData__WEBPACK_IMPORTED_MODULE_3__.GLTFData();
            container.glTFFiles[glbFileName] = glbFile;
            if (_this._localEngine != null) {
                _this._localEngine.dispose();
            }
            if (dispose) {
                _this.dispose();
            }
            return container;
        });
    };
    /**
     * Sets the TRS for each node
     * @param node glTF Node for storing the transformation data
     * @param babylonTransformNode Babylon mesh used as the source for the transformation data
     */
    _Exporter.prototype._setNodeTransformation = function (node, babylonTransformNode) {
        if (!babylonTransformNode.getPivotPoint().equalsToFloats(0, 0, 0)) {
            babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Tools.Warn("Pivot points are not supported in the glTF serializer");
        }
        if (!babylonTransformNode.position.equalsToFloats(0, 0, 0)) {
            node.translation = babylonTransformNode.position.asArray();
        }
        if (!babylonTransformNode.scaling.equalsToFloats(1, 1, 1)) {
            node.scale = babylonTransformNode.scaling.asArray();
        }
        var rotationQuaternion = babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Quaternion.FromEulerAngles(babylonTransformNode.rotation.x, babylonTransformNode.rotation.y, babylonTransformNode.rotation.z);
        if (babylonTransformNode.rotationQuaternion) {
            rotationQuaternion.multiplyInPlace(babylonTransformNode.rotationQuaternion);
        }
        if (!babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Quaternion.IsIdentity(rotationQuaternion)) {
            node.rotation = rotationQuaternion.normalize().asArray();
        }
    };
    _Exporter.prototype._setCameraTransformation = function (node, babylonCamera) {
        var translation = babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.TmpVectors.Vector3[0];
        var rotation = babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.TmpVectors.Quaternion[0];
        babylonCamera.getWorldMatrix().decompose(undefined, rotation, translation);
        if (!translation.equalsToFloats(0, 0, 0)) {
            node.translation = translation.asArray();
        }
        // // Rotation by 180 as glTF has a different convention than Babylon.
        rotation.multiplyInPlace(rotation180Y);
        if (!babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Quaternion.IsIdentity(rotation)) {
            node.rotation = rotation.asArray();
        }
    };
    _Exporter.prototype._getVertexBufferFromMesh = function (attributeKind, bufferMesh) {
        if (bufferMesh.isVerticesDataPresent(attributeKind, true)) {
            var vertexBuffer = bufferMesh.getVertexBuffer(attributeKind, true);
            if (vertexBuffer) {
                return vertexBuffer;
            }
        }
        return null;
    };
    /**
     * Creates a bufferview based on the vertices type for the Babylon mesh
     * @param kind Indicates the type of vertices data
     * @param attributeComponentKind Indicates the numerical type used to store the data
     * @param babylonTransformNode The Babylon mesh to get the vertices data from
     * @param binaryWriter The buffer to write the bufferview data to
     * @param byteStride
     */
    _Exporter.prototype._createBufferViewKind = function (kind, attributeComponentKind, babylonTransformNode, binaryWriter, byteStride) {
        var bufferMesh = babylonTransformNode instanceof babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Mesh
            ? babylonTransformNode
            : babylonTransformNode instanceof babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.InstancedMesh
                ? babylonTransformNode.sourceMesh
                : null;
        if (bufferMesh) {
            var vertexBuffer = bufferMesh.getVertexBuffer(kind, true);
            var vertexData = bufferMesh.getVerticesData(kind, undefined, undefined, true);
            if (vertexBuffer && vertexData) {
                var typeByteLength = babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.GetTypeByteLength(attributeComponentKind);
                var byteLength = vertexData.length * typeByteLength;
                var bufferView = _glTFUtilities__WEBPACK_IMPORTED_MODULE_2__._GLTFUtilities._CreateBufferView(0, binaryWriter.getByteOffset(), byteLength, byteStride, kind + " - " + bufferMesh.name);
                this._bufferViews.push(bufferView);
                this._writeAttributeData(kind, attributeComponentKind, vertexData, byteStride / typeByteLength, binaryWriter, babylonTransformNode);
            }
        }
    };
    /**
     * The primitive mode of the Babylon mesh
     * @param babylonMesh The BabylonJS mesh
     * @returns Unsigned integer of the primitive mode or null
     */
    _Exporter.prototype._getMeshPrimitiveMode = function (babylonMesh) {
        if (babylonMesh instanceof babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.LinesMesh) {
            return babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Material.LineListDrawMode;
        }
        if (babylonMesh instanceof babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.InstancedMesh || babylonMesh instanceof babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Mesh) {
            var baseMesh = babylonMesh instanceof babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Mesh ? babylonMesh : babylonMesh.sourceMesh;
            if (typeof baseMesh.overrideRenderingFillMode === "number") {
                return baseMesh.overrideRenderingFillMode;
            }
        }
        return babylonMesh.material ? babylonMesh.material.fillMode : babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Material.TriangleFillMode;
    };
    /**
     * Sets the primitive mode of the glTF mesh primitive
     * @param meshPrimitive glTF mesh primitive
     * @param primitiveMode The primitive mode
     */
    _Exporter.prototype._setPrimitiveMode = function (meshPrimitive, primitiveMode) {
        switch (primitiveMode) {
            case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Material.TriangleFillMode: {
                // glTF defaults to using Triangle Mode
                break;
            }
            case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Material.TriangleStripDrawMode: {
                meshPrimitive.mode = 5 /* MeshPrimitiveMode.TRIANGLE_STRIP */;
                break;
            }
            case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Material.TriangleFanDrawMode: {
                meshPrimitive.mode = 6 /* MeshPrimitiveMode.TRIANGLE_FAN */;
                break;
            }
            case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Material.PointListDrawMode: {
                meshPrimitive.mode = 0 /* MeshPrimitiveMode.POINTS */;
                break;
            }
            case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Material.PointFillMode: {
                meshPrimitive.mode = 0 /* MeshPrimitiveMode.POINTS */;
                break;
            }
            case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Material.LineLoopDrawMode: {
                meshPrimitive.mode = 2 /* MeshPrimitiveMode.LINE_LOOP */;
                break;
            }
            case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Material.LineListDrawMode: {
                meshPrimitive.mode = 1 /* MeshPrimitiveMode.LINES */;
                break;
            }
            case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Material.LineStripDrawMode: {
                meshPrimitive.mode = 3 /* MeshPrimitiveMode.LINE_STRIP */;
                break;
            }
        }
    };
    /**
     * Sets the vertex attribute accessor based of the glTF mesh primitive
     * @param meshPrimitive glTF mesh primitive
     * @param attributeKind vertex attribute
     */
    _Exporter.prototype._setAttributeKind = function (attributes, attributeKind) {
        switch (attributeKind) {
            case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.PositionKind: {
                attributes.POSITION = this._accessors.length - 1;
                break;
            }
            case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.NormalKind: {
                attributes.NORMAL = this._accessors.length - 1;
                break;
            }
            case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.ColorKind: {
                attributes.COLOR_0 = this._accessors.length - 1;
                break;
            }
            case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.TangentKind: {
                attributes.TANGENT = this._accessors.length - 1;
                break;
            }
            case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.UVKind: {
                attributes.TEXCOORD_0 = this._accessors.length - 1;
                break;
            }
            case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.UV2Kind: {
                attributes.TEXCOORD_1 = this._accessors.length - 1;
                break;
            }
            case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.MatricesIndicesKind: {
                attributes.JOINTS_0 = this._accessors.length - 1;
                break;
            }
            case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.MatricesIndicesExtraKind: {
                attributes.JOINTS_1 = this._accessors.length - 1;
                break;
            }
            case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.MatricesWeightsKind: {
                attributes.WEIGHTS_0 = this._accessors.length - 1;
                break;
            }
            case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.MatricesWeightsExtraKind: {
                attributes.WEIGHTS_1 = this._accessors.length - 1;
                break;
            }
            default: {
                babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Tools.Warn("Unsupported Vertex Buffer Type: " + attributeKind);
            }
        }
    };
    /**
     * Sets data for the primitive attributes of each submesh
     * @param mesh glTF Mesh object to store the primitive attribute information
     * @param babylonTransformNode Babylon mesh to get the primitive attribute data from
     * @param binaryWriter Buffer to write the attribute data to
     * @returns promise that resolves when done setting the primitive attributes
     */
    _Exporter.prototype._setPrimitiveAttributesAsync = function (mesh, babylonTransformNode, binaryWriter) {
        var _a, _b, _c, _d, _e, _f, _g;
        var promises = [];
        var bufferMesh = null;
        var bufferView;
        var minMax;
        if (babylonTransformNode instanceof babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Mesh) {
            bufferMesh = babylonTransformNode;
        }
        else if (babylonTransformNode instanceof babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.InstancedMesh) {
            bufferMesh = babylonTransformNode.sourceMesh;
        }
        var attributeData = [
            { kind: babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.PositionKind, accessorType: "VEC3" /* AccessorType.VEC3 */, accessorComponentType: 5126 /* AccessorComponentType.FLOAT */, byteStride: 12 },
            { kind: babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.NormalKind, accessorType: "VEC3" /* AccessorType.VEC3 */, accessorComponentType: 5126 /* AccessorComponentType.FLOAT */, byteStride: 12 },
            { kind: babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.ColorKind, accessorType: "VEC4" /* AccessorType.VEC4 */, accessorComponentType: 5126 /* AccessorComponentType.FLOAT */, byteStride: 16 },
            { kind: babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.TangentKind, accessorType: "VEC4" /* AccessorType.VEC4 */, accessorComponentType: 5126 /* AccessorComponentType.FLOAT */, byteStride: 16 },
            { kind: babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.UVKind, accessorType: "VEC2" /* AccessorType.VEC2 */, accessorComponentType: 5126 /* AccessorComponentType.FLOAT */, byteStride: 8 },
            { kind: babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.UV2Kind, accessorType: "VEC2" /* AccessorType.VEC2 */, accessorComponentType: 5126 /* AccessorComponentType.FLOAT */, byteStride: 8 },
            { kind: babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.MatricesIndicesKind, accessorType: "VEC4" /* AccessorType.VEC4 */, accessorComponentType: 5123 /* AccessorComponentType.UNSIGNED_SHORT */, byteStride: 8 },
            { kind: babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.MatricesIndicesExtraKind, accessorType: "VEC4" /* AccessorType.VEC4 */, accessorComponentType: 5123 /* AccessorComponentType.UNSIGNED_SHORT */, byteStride: 8 },
            { kind: babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.MatricesWeightsKind, accessorType: "VEC4" /* AccessorType.VEC4 */, accessorComponentType: 5126 /* AccessorComponentType.FLOAT */, byteStride: 16 },
            { kind: babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.MatricesWeightsExtraKind, accessorType: "VEC4" /* AccessorType.VEC4 */, accessorComponentType: 5126 /* AccessorComponentType.FLOAT */, byteStride: 16 },
        ];
        if (bufferMesh) {
            var indexBufferViewIndex = null;
            var primitiveMode = this._getMeshPrimitiveMode(bufferMesh);
            var vertexAttributeBufferViews = {};
            var morphTargetManager = bufferMesh.morphTargetManager;
            // For each BabylonMesh, create bufferviews for each 'kind'
            for (var _i = 0, attributeData_1 = attributeData; _i < attributeData_1.length; _i++) {
                var attribute = attributeData_1[_i];
                var attributeKind = attribute.kind;
                var attributeComponentKind = attribute.accessorComponentType;
                if (bufferMesh.isVerticesDataPresent(attributeKind, true)) {
                    var vertexBuffer = this._getVertexBufferFromMesh(attributeKind, bufferMesh);
                    attribute.byteStride = vertexBuffer
                        ? vertexBuffer.getSize() * babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.GetTypeByteLength(attribute.accessorComponentType)
                        : babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.DeduceStride(attributeKind) * 4;
                    if (attribute.byteStride === 12) {
                        attribute.accessorType = "VEC3" /* AccessorType.VEC3 */;
                    }
                    this._createBufferViewKind(attributeKind, attributeComponentKind, babylonTransformNode, binaryWriter, attribute.byteStride);
                    attribute.bufferViewIndex = this._bufferViews.length - 1;
                    vertexAttributeBufferViews[attributeKind] = attribute.bufferViewIndex;
                    // Write any morph target data to the buffer and create an associated buffer view
                    if (morphTargetManager) {
                        for (var i = 0; i < morphTargetManager.numTargets; ++i) {
                            var morphTarget = morphTargetManager.getTarget(i);
                            var morphTargetInfo = this._createMorphTargetBufferViewKind(attributeKind, attribute.accessorType, attributeComponentKind, bufferMesh, morphTarget, binaryWriter, attribute.byteStride);
                            // Store info about the morph target that will be needed later when creating per-submesh accessors
                            if (morphTargetInfo) {
                                if (!attribute.morphTargetInfo) {
                                    attribute.morphTargetInfo = [];
                                }
                                attribute.morphTargetInfo[i] = morphTargetInfo;
                            }
                        }
                    }
                }
            }
            if (bufferMesh.getTotalIndices()) {
                var indices = bufferMesh.getIndices();
                if (indices) {
                    var byteLength = indices.length * 4;
                    bufferView = _glTFUtilities__WEBPACK_IMPORTED_MODULE_2__._GLTFUtilities._CreateBufferView(0, binaryWriter.getByteOffset(), byteLength, undefined, "Indices - " + bufferMesh.name);
                    this._bufferViews.push(bufferView);
                    indexBufferViewIndex = this._bufferViews.length - 1;
                    for (var k = 0, length_9 = indices.length; k < length_9; ++k) {
                        binaryWriter.setUInt32(indices[k]);
                    }
                }
            }
            if (bufferMesh.subMeshes) {
                // go through all mesh primitives (submeshes)
                for (var _h = 0, _j = bufferMesh.subMeshes; _h < _j.length; _h++) {
                    var submesh = _j[_h];
                    var babylonMaterial = submesh.getMaterial() || bufferMesh.getScene().defaultMaterial;
                    var materialIndex = null;
                    if (babylonMaterial) {
                        if (bufferMesh instanceof babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.LinesMesh) {
                            // get the color from the lines mesh and set it in the material
                            var material = {
                                name: bufferMesh.name + " material",
                            };
                            if (!bufferMesh.color.equals(babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Color3.White()) || bufferMesh.alpha < 1) {
                                material.pbrMetallicRoughness = {
                                    baseColorFactor: bufferMesh.color.asArray().concat([bufferMesh.alpha]),
                                };
                            }
                            this._materials.push(material);
                            materialIndex = this._materials.length - 1;
                        }
                        else if (babylonMaterial instanceof babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.MultiMaterial) {
                            var subMaterial = babylonMaterial.subMaterials[submesh.materialIndex];
                            if (subMaterial) {
                                babylonMaterial = subMaterial;
                                materialIndex = this._materialMap[babylonMaterial.uniqueId];
                            }
                        }
                        else {
                            materialIndex = this._materialMap[babylonMaterial.uniqueId];
                        }
                    }
                    var glTFMaterial = materialIndex != null ? this._materials[materialIndex] : null;
                    var meshPrimitive = { attributes: {} };
                    this._setPrimitiveMode(meshPrimitive, primitiveMode);
                    for (var _k = 0, attributeData_2 = attributeData; _k < attributeData_2.length; _k++) {
                        var attribute = attributeData_2[_k];
                        var attributeKind = attribute.kind;
                        if ((attributeKind === babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.UVKind || attributeKind === babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.UV2Kind) && !this._options.exportUnusedUVs) {
                            if (!glTFMaterial || !this._glTFMaterialExporter._hasTexturesPresent(glTFMaterial)) {
                                continue;
                            }
                        }
                        var vertexData = bufferMesh.getVerticesData(attributeKind, undefined, undefined, true);
                        if (vertexData) {
                            var vertexBuffer = this._getVertexBufferFromMesh(attributeKind, bufferMesh);
                            if (vertexBuffer) {
                                var stride = vertexBuffer.getSize();
                                var bufferViewIndex = attribute.bufferViewIndex;
                                if (bufferViewIndex != undefined) {
                                    // check to see if bufferviewindex has a numeric value assigned.
                                    minMax = { min: null, max: null };
                                    if (attributeKind == babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.PositionKind) {
                                        minMax = _glTFUtilities__WEBPACK_IMPORTED_MODULE_2__._GLTFUtilities._CalculateMinMaxPositions(vertexData, 0, vertexData.length / stride);
                                    }
                                    var accessor = _glTFUtilities__WEBPACK_IMPORTED_MODULE_2__._GLTFUtilities._CreateAccessor(bufferViewIndex, attributeKind + " - " + babylonTransformNode.name, attribute.accessorType, attribute.accessorComponentType, vertexData.length / stride, 0, minMax.min, minMax.max);
                                    this._accessors.push(accessor);
                                    this._setAttributeKind(meshPrimitive.attributes, attributeKind);
                                }
                            }
                        }
                    }
                    if (indexBufferViewIndex) {
                        // Create accessor
                        var accessor = _glTFUtilities__WEBPACK_IMPORTED_MODULE_2__._GLTFUtilities._CreateAccessor(indexBufferViewIndex, "indices - " + babylonTransformNode.name, "SCALAR" /* AccessorType.SCALAR */, 5125 /* AccessorComponentType.UNSIGNED_INT */, submesh.indexCount, submesh.indexStart * 4, null, null);
                        this._accessors.push(accessor);
                        meshPrimitive.indices = this._accessors.length - 1;
                    }
                    if (Object.keys(meshPrimitive.attributes).length > 0) {
                        var sideOrientation = babylonMaterial._getEffectiveOrientation(bufferMesh);
                        if (sideOrientation === (this._babylonScene.useRightHandedSystem ? babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Material.ClockWiseSideOrientation : babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Material.CounterClockWiseSideOrientation)) {
                            var byteOffset = indexBufferViewIndex != null ? this._bufferViews[indexBufferViewIndex].byteOffset : null;
                            if (byteOffset == null) {
                                byteOffset = 0;
                            }
                            var babylonIndices = null;
                            if (indexBufferViewIndex != null) {
                                babylonIndices = bufferMesh.getIndices();
                            }
                            if (babylonIndices) {
                                this._reorderIndicesBasedOnPrimitiveMode(submesh, primitiveMode, babylonIndices, byteOffset, binaryWriter);
                            }
                            else {
                                for (var _l = 0, attributeData_3 = attributeData; _l < attributeData_3.length; _l++) {
                                    var attribute = attributeData_3[_l];
                                    var vertexData = bufferMesh.getVerticesData(attribute.kind, undefined, undefined, true);
                                    if (vertexData) {
                                        var byteOffset_1 = this._bufferViews[vertexAttributeBufferViews[attribute.kind]].byteOffset || 0;
                                        this._reorderVertexAttributeDataBasedOnPrimitiveMode(submesh, primitiveMode, attribute.kind, vertexData, byteOffset_1, binaryWriter);
                                    }
                                }
                            }
                        }
                        if (materialIndex != null) {
                            meshPrimitive.material = materialIndex;
                        }
                    }
                    // If there are morph targets, write out targets and associated accessors
                    if (morphTargetManager) {
                        // By convention, morph target names are stored in the mesh extras.
                        if (!mesh.extras) {
                            mesh.extras = {};
                        }
                        mesh.extras.targetNames = [];
                        for (var i = 0; i < morphTargetManager.numTargets; ++i) {
                            var morphTarget = morphTargetManager.getTarget(i);
                            mesh.extras.targetNames.push(morphTarget.name);
                            for (var _m = 0, attributeData_4 = attributeData; _m < attributeData_4.length; _m++) {
                                var attribute = attributeData_4[_m];
                                var morphTargetInfo = (_a = attribute.morphTargetInfo) === null || _a === void 0 ? void 0 : _a[i];
                                if (morphTargetInfo) {
                                    // Write the accessor
                                    var byteOffset = 0;
                                    var accessor = _glTFUtilities__WEBPACK_IMPORTED_MODULE_2__._GLTFUtilities._CreateAccessor(morphTargetInfo.bufferViewIndex, "".concat(attribute.kind, " - ").concat(morphTarget.name, " (Morph Target)"), morphTargetInfo.accessorType, attribute.accessorComponentType, morphTargetInfo.vertexCount, byteOffset, (_d = (_c = (_b = morphTargetInfo.minMax) === null || _b === void 0 ? void 0 : _b.min) === null || _c === void 0 ? void 0 : _c.asArray()) !== null && _d !== void 0 ? _d : null, (_g = (_f = (_e = morphTargetInfo.minMax) === null || _e === void 0 ? void 0 : _e.max) === null || _f === void 0 ? void 0 : _f.asArray()) !== null && _g !== void 0 ? _g : null);
                                    this._accessors.push(accessor);
                                    // Create a target that references the new accessor
                                    if (!meshPrimitive.targets) {
                                        meshPrimitive.targets = [];
                                    }
                                    if (!meshPrimitive.targets[i]) {
                                        meshPrimitive.targets[i] = {};
                                    }
                                    this._setAttributeKind(meshPrimitive.targets[i], attribute.kind);
                                }
                            }
                        }
                    }
                    mesh.primitives.push(meshPrimitive);
                    this._extensionsPostExportMeshPrimitiveAsync("postExport", meshPrimitive, submesh, binaryWriter);
                    promises.push();
                }
            }
        }
        return Promise.all(promises).then(function () {
            /* do nothing */
        });
    };
    /**
     * Creates a glTF scene based on the array of meshes
     * Returns the total byte offset
     * @param binaryWriter Buffer to write binary data to
     * @returns a promise that resolves when done
     */
    _Exporter.prototype._createSceneAsync = function (binaryWriter) {
        var _a;
        var _this = this;
        var _b;
        var scene = { nodes: [] };
        var glTFNodeIndex;
        var glTFNode;
        var directDescendents;
        var nodes = (0,tslib__WEBPACK_IMPORTED_MODULE_5__.__spreadArray)((0,tslib__WEBPACK_IMPORTED_MODULE_5__.__spreadArray)((0,tslib__WEBPACK_IMPORTED_MODULE_5__.__spreadArray)((0,tslib__WEBPACK_IMPORTED_MODULE_5__.__spreadArray)([], this._babylonScene.transformNodes, true), this._babylonScene.meshes, true), this._babylonScene.lights, true), this._babylonScene.cameras, true);
        var removedRootNodes = new Set();
        // Scene metadata
        if (this._babylonScene.metadata) {
            if (this._options.metadataSelector) {
                scene.extras = this._options.metadataSelector(this._babylonScene.metadata);
            }
            else if (this._babylonScene.metadata.gltf) {
                scene.extras = this._babylonScene.metadata.gltf.extras;
            }
        }
        // Remove no-op root nodes
        if (((_b = this._options.removeNoopRootNodes) !== null && _b !== void 0 ? _b : true) && !this._options.includeCoordinateSystemConversionNodes) {
            for (var _i = 0, _c = this._babylonScene.rootNodes; _i < _c.length; _i++) {
                var rootNode = _c[_i];
                if (isNoopNode(rootNode, this._babylonScene.useRightHandedSystem)) {
                    removedRootNodes.add(rootNode);
                    // Exclude the node from list of nodes to export
                    nodes.splice(nodes.indexOf(rootNode), 1);
                }
            }
        }
        // Export babylon cameras to glTFCamera
        var cameraMap = new Map();
        this._babylonScene.cameras.forEach(function (camera) {
            if (_this._options.shouldExportNode && !_this._options.shouldExportNode(camera)) {
                return;
            }
            var glTFCamera = {
                type: camera.mode === babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Camera.PERSPECTIVE_CAMERA ? "perspective" /* CameraType.PERSPECTIVE */ : "orthographic" /* CameraType.ORTHOGRAPHIC */,
            };
            if (camera.name) {
                glTFCamera.name = camera.name;
            }
            if (glTFCamera.type === "perspective" /* CameraType.PERSPECTIVE */) {
                glTFCamera.perspective = {
                    aspectRatio: camera.getEngine().getAspectRatio(camera),
                    yfov: camera.fovMode === babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Camera.FOVMODE_VERTICAL_FIXED ? camera.fov : camera.fov * camera.getEngine().getAspectRatio(camera),
                    znear: camera.minZ,
                    zfar: camera.maxZ,
                };
            }
            else if (glTFCamera.type === "orthographic" /* CameraType.ORTHOGRAPHIC */) {
                var halfWidth = camera.orthoLeft && camera.orthoRight ? 0.5 * (camera.orthoRight - camera.orthoLeft) : camera.getEngine().getRenderWidth() * 0.5;
                var halfHeight = camera.orthoBottom && camera.orthoTop ? 0.5 * (camera.orthoTop - camera.orthoBottom) : camera.getEngine().getRenderHeight() * 0.5;
                glTFCamera.orthographic = {
                    xmag: halfWidth,
                    ymag: halfHeight,
                    znear: camera.minZ,
                    zfar: camera.maxZ,
                };
            }
            cameraMap.set(camera, _this._cameras.length);
            _this._cameras.push(glTFCamera);
        });
        var exportNodes = (_a = this._getExportNodes(nodes), _a[0]), exportMaterials = _a[1];
        return this._glTFMaterialExporter._convertMaterialsToGLTFAsync(exportMaterials, "image/png" /* ImageMimeType.PNG */, true).then(function () {
            return _this._createNodeMapAndAnimationsAsync(exportNodes, binaryWriter).then(function (nodeMap) {
                return _this._createSkinsAsync(nodeMap, binaryWriter).then(function (skinMap) {
                    _this._nodeMap = nodeMap;
                    _this._totalByteLength = binaryWriter.getByteOffset();
                    if (_this._totalByteLength == undefined) {
                        throw new Error("undefined byte length!");
                    }
                    // Build Hierarchy with the node map.
                    for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
                        var babylonNode = nodes_1[_i];
                        glTFNodeIndex = _this._nodeMap[babylonNode.uniqueId];
                        if (glTFNodeIndex !== undefined) {
                            glTFNode = _this._nodes[glTFNodeIndex];
                            if (babylonNode.metadata) {
                                if (_this._options.metadataSelector) {
                                    glTFNode.extras = _this._options.metadataSelector(babylonNode.metadata);
                                }
                                else if (babylonNode.metadata.gltf) {
                                    glTFNode.extras = babylonNode.metadata.gltf.extras;
                                }
                            }
                            if (babylonNode instanceof babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Camera) {
                                glTFNode.camera = cameraMap.get(babylonNode);
                            }
                            if (_this._options.shouldExportNode && !_this._options.shouldExportNode(babylonNode)) {
                                babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Tools.Log("Omitting " + babylonNode.name + " from scene.");
                            }
                            else {
                                if (!babylonNode.parent && !_this._babylonScene.useRightHandedSystem) {
                                    convertNodeHandedness(glTFNode);
                                }
                                if (!babylonNode.parent || removedRootNodes.has(babylonNode.parent)) {
                                    scene.nodes.push(glTFNodeIndex);
                                }
                            }
                            if (babylonNode instanceof babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Mesh) {
                                if (babylonNode.skeleton) {
                                    glTFNode.skin = skinMap[babylonNode.skeleton.uniqueId];
                                }
                            }
                            directDescendents = babylonNode.getDescendants(true);
                            if (!glTFNode.children && directDescendents && directDescendents.length) {
                                var children = [];
                                for (var _a = 0, directDescendents_1 = directDescendents; _a < directDescendents_1.length; _a++) {
                                    var descendent = directDescendents_1[_a];
                                    if (_this._nodeMap[descendent.uniqueId] != null) {
                                        children.push(_this._nodeMap[descendent.uniqueId]);
                                    }
                                }
                                if (children.length) {
                                    glTFNode.children = children;
                                }
                            }
                        }
                    }
                    if (scene.nodes.length) {
                        _this._scenes.push(scene);
                    }
                });
            });
        });
    };
    /**
     * Getting the nodes and materials that would be exported.
     * @param nodes Babylon transform nodes
     * @returns Set of materials which would be exported.
     */
    _Exporter.prototype._getExportNodes = function (nodes) {
        var exportNodes = [];
        var exportMaterials = new Set();
        for (var _i = 0, nodes_2 = nodes; _i < nodes_2.length; _i++) {
            var babylonNode = nodes_2[_i];
            if (!this._options.shouldExportNode || this._options.shouldExportNode(babylonNode)) {
                exportNodes.push(babylonNode);
                var babylonMesh = babylonNode;
                if (babylonMesh.subMeshes && babylonMesh.subMeshes.length > 0) {
                    var material = babylonMesh.material || babylonMesh.getScene().defaultMaterial;
                    if (material instanceof babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.MultiMaterial) {
                        for (var _a = 0, _b = material.subMaterials; _a < _b.length; _a++) {
                            var subMaterial = _b[_a];
                            if (subMaterial) {
                                exportMaterials.add(subMaterial);
                            }
                        }
                    }
                    else {
                        exportMaterials.add(material);
                    }
                }
            }
            else {
                "Excluding node ".concat(babylonNode.name);
            }
        }
        return [exportNodes, exportMaterials];
    };
    /**
     * Creates a mapping of Node unique id to node index and handles animations
     * @param nodes Babylon transform nodes
     * @param binaryWriter Buffer to write binary data to
     * @returns Node mapping of unique id to index
     */
    _Exporter.prototype._createNodeMapAndAnimationsAsync = function (nodes, binaryWriter) {
        var _this = this;
        var promiseChain = Promise.resolve();
        var nodeMap = {};
        var nodeIndex;
        var runtimeGLTFAnimation = {
            name: "runtime animations",
            channels: [],
            samplers: [],
        };
        var idleGLTFAnimations = [];
        var _loop_1 = function (babylonNode) {
            promiseChain = promiseChain.then(function () {
                return _this._createNodeAsync(babylonNode, binaryWriter).then(function (node) {
                    var promise = _this._extensionsPostExportNodeAsync("createNodeAsync", node, babylonNode, nodeMap, binaryWriter);
                    if (promise == null) {
                        babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Tools.Warn("Not exporting node ".concat(babylonNode.name));
                        return Promise.resolve();
                    }
                    else {
                        return promise.then(function (node) {
                            if (!node) {
                                return;
                            }
                            _this._nodes.push(node);
                            nodeIndex = _this._nodes.length - 1;
                            nodeMap[babylonNode.uniqueId] = nodeIndex;
                            if (!_this._babylonScene.animationGroups.length) {
                                _glTFAnimation__WEBPACK_IMPORTED_MODULE_4__._GLTFAnimation._CreateMorphTargetAnimationFromMorphTargetAnimations(babylonNode, runtimeGLTFAnimation, idleGLTFAnimations, nodeMap, _this._nodes, binaryWriter, _this._bufferViews, _this._accessors, _this._animationSampleRate, _this._options.shouldExportAnimation);
                                if (babylonNode.animations.length) {
                                    _glTFAnimation__WEBPACK_IMPORTED_MODULE_4__._GLTFAnimation._CreateNodeAnimationFromNodeAnimations(babylonNode, runtimeGLTFAnimation, idleGLTFAnimations, nodeMap, _this._nodes, binaryWriter, _this._bufferViews, _this._accessors, _this._animationSampleRate, _this._options.shouldExportAnimation);
                                }
                            }
                        });
                    }
                });
            });
        };
        for (var _i = 0, nodes_3 = nodes; _i < nodes_3.length; _i++) {
            var babylonNode = nodes_3[_i];
            _loop_1(babylonNode);
        }
        return promiseChain.then(function () {
            if (runtimeGLTFAnimation.channels.length && runtimeGLTFAnimation.samplers.length) {
                _this._animations.push(runtimeGLTFAnimation);
            }
            idleGLTFAnimations.forEach(function (idleGLTFAnimation) {
                if (idleGLTFAnimation.channels.length && idleGLTFAnimation.samplers.length) {
                    _this._animations.push(idleGLTFAnimation);
                }
            });
            if (_this._babylonScene.animationGroups.length) {
                _glTFAnimation__WEBPACK_IMPORTED_MODULE_4__._GLTFAnimation._CreateNodeAndMorphAnimationFromAnimationGroups(_this._babylonScene, _this._animations, nodeMap, binaryWriter, _this._bufferViews, _this._accessors, _this._animationSampleRate, _this._options.shouldExportAnimation);
            }
            return nodeMap;
        });
    };
    /**
     * Creates a glTF node from a Babylon mesh
     * @param babylonNode Source Babylon mesh
     * @param binaryWriter Buffer for storing geometry data
     * @returns glTF node
     */
    _Exporter.prototype._createNodeAsync = function (babylonNode, binaryWriter) {
        var _this = this;
        return Promise.resolve().then(function () {
            // create node to hold translation/rotation/scale and the mesh
            var node = {};
            // create mesh
            var mesh = { primitives: [] };
            if (babylonNode.name) {
                node.name = babylonNode.name;
            }
            if (babylonNode instanceof babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.TransformNode) {
                // Set transformation
                _this._setNodeTransformation(node, babylonNode);
                if (babylonNode instanceof babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Mesh) {
                    var morphTargetManager = babylonNode.morphTargetManager;
                    if (morphTargetManager && morphTargetManager.numTargets > 0) {
                        mesh.weights = [];
                        for (var i = 0; i < morphTargetManager.numTargets; ++i) {
                            mesh.weights.push(morphTargetManager.getTarget(i).influence);
                        }
                    }
                }
                return _this._setPrimitiveAttributesAsync(mesh, babylonNode, binaryWriter).then(function () {
                    if (mesh.primitives.length) {
                        _this._meshes.push(mesh);
                        node.mesh = _this._meshes.length - 1;
                    }
                    return node;
                });
            }
            else if (babylonNode instanceof babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Camera) {
                _this._setCameraTransformation(node, babylonNode);
                return node;
            }
            else {
                return node;
            }
        });
    };
    /**
     * Creates a glTF skin from a Babylon skeleton
     * @param nodeMap Babylon transform nodes
     * @param binaryWriter Buffer to write binary data to
     * @returns Node mapping of unique id to index
     */
    _Exporter.prototype._createSkinsAsync = function (nodeMap, binaryWriter) {
        var _a;
        var promiseChain = Promise.resolve();
        var skinMap = {};
        for (var _i = 0, _b = this._babylonScene.skeletons; _i < _b.length; _i++) {
            var skeleton = _b[_i];
            if (skeleton.bones.length <= 0) {
                continue;
            }
            // create skin
            var skin = { joints: [] };
            var inverseBindMatrices = [];
            var boneIndexMap = {};
            var maxBoneIndex = -1;
            for (var i = 0; i < skeleton.bones.length; ++i) {
                var bone = skeleton.bones[i];
                var boneIndex = (_a = bone.getIndex()) !== null && _a !== void 0 ? _a : i;
                if (boneIndex !== -1) {
                    boneIndexMap[boneIndex] = bone;
                    if (boneIndex > maxBoneIndex) {
                        maxBoneIndex = boneIndex;
                    }
                }
            }
            for (var boneIndex = 0; boneIndex <= maxBoneIndex; ++boneIndex) {
                var bone = boneIndexMap[boneIndex];
                inverseBindMatrices.push(bone.getInvertedAbsoluteTransform());
                var transformNode = bone.getTransformNode();
                if (transformNode && nodeMap[transformNode.uniqueId] !== null && nodeMap[transformNode.uniqueId] !== undefined) {
                    skin.joints.push(nodeMap[transformNode.uniqueId]);
                }
                else {
                    babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Tools.Warn("Exporting a bone without a linked transform node is currently unsupported");
                }
            }
            if (skin.joints.length > 0) {
                // create buffer view for inverse bind matrices
                var byteStride = 64; // 4 x 4 matrix of 32 bit float
                var byteLength = inverseBindMatrices.length * byteStride;
                var bufferViewOffset = binaryWriter.getByteOffset();
                var bufferView = _glTFUtilities__WEBPACK_IMPORTED_MODULE_2__._GLTFUtilities._CreateBufferView(0, bufferViewOffset, byteLength, undefined, "InverseBindMatrices" + " - " + skeleton.name);
                this._bufferViews.push(bufferView);
                var bufferViewIndex = this._bufferViews.length - 1;
                var bindMatrixAccessor = _glTFUtilities__WEBPACK_IMPORTED_MODULE_2__._GLTFUtilities._CreateAccessor(bufferViewIndex, "InverseBindMatrices" + " - " + skeleton.name, "MAT4" /* AccessorType.MAT4 */, 5126 /* AccessorComponentType.FLOAT */, inverseBindMatrices.length, null, null, null);
                var inverseBindAccessorIndex = this._accessors.push(bindMatrixAccessor) - 1;
                skin.inverseBindMatrices = inverseBindAccessorIndex;
                this._skins.push(skin);
                skinMap[skeleton.uniqueId] = this._skins.length - 1;
                inverseBindMatrices.forEach(function (mat) {
                    mat.m.forEach(function (cell) {
                        binaryWriter.setFloat32(cell);
                    });
                });
            }
        }
        return promiseChain.then(function () {
            return skinMap;
        });
    };
    _Exporter._ExtensionNames = new Array();
    _Exporter._ExtensionFactories = {};
    return _Exporter;
}());
/**
 * @internal
 *
 * Stores glTF binary data.  If the array buffer byte length is exceeded, it doubles in size dynamically
 */
var _BinaryWriter = /** @class */ (function () {
    /**
     * Initialize binary writer with an initial byte length
     * @param byteLength Initial byte length of the array buffer
     */
    function _BinaryWriter(byteLength) {
        this._arrayBuffer = new ArrayBuffer(byteLength);
        this._dataView = new DataView(this._arrayBuffer);
        this._byteOffset = 0;
    }
    /**
     * Resize the array buffer to the specified byte length
     * @param byteLength The new byte length
     * @returns The resized array buffer
     */
    _BinaryWriter.prototype._resizeBuffer = function (byteLength) {
        var newBuffer = new ArrayBuffer(byteLength);
        var copyOldBufferSize = Math.min(this._arrayBuffer.byteLength, byteLength);
        var oldUint8Array = new Uint8Array(this._arrayBuffer, 0, copyOldBufferSize);
        var newUint8Array = new Uint8Array(newBuffer);
        newUint8Array.set(oldUint8Array, 0);
        this._arrayBuffer = newBuffer;
        this._dataView = new DataView(this._arrayBuffer);
        return newBuffer;
    };
    /**
     * Get an array buffer with the length of the byte offset
     * @returns ArrayBuffer resized to the byte offset
     */
    _BinaryWriter.prototype.getArrayBuffer = function () {
        return this._resizeBuffer(this.getByteOffset());
    };
    /**
     * Get the byte offset of the array buffer
     * @returns byte offset
     */
    _BinaryWriter.prototype.getByteOffset = function () {
        if (this._byteOffset == undefined) {
            throw new Error("Byte offset is undefined!");
        }
        return this._byteOffset;
    };
    /**
     * Stores an UInt8 in the array buffer
     * @param entry
     * @param byteOffset If defined, specifies where to set the value as an offset.
     */
    _BinaryWriter.prototype.setUInt8 = function (entry, byteOffset) {
        if (byteOffset != null) {
            if (byteOffset < this._byteOffset) {
                this._dataView.setUint8(byteOffset, entry);
            }
            else {
                babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Tools.Error("BinaryWriter: byteoffset is greater than the current binary buffer length!");
            }
        }
        else {
            if (this._byteOffset + 1 > this._arrayBuffer.byteLength) {
                this._resizeBuffer(this._arrayBuffer.byteLength * 2);
            }
            this._dataView.setUint8(this._byteOffset, entry);
            this._byteOffset += 1;
        }
    };
    /**
     * Stores an UInt16 in the array buffer
     * @param entry
     * @param byteOffset If defined, specifies where to set the value as an offset.
     */
    _BinaryWriter.prototype.setUInt16 = function (entry, byteOffset) {
        if (byteOffset != null) {
            if (byteOffset < this._byteOffset) {
                this._dataView.setUint16(byteOffset, entry, true);
            }
            else {
                babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Tools.Error("BinaryWriter: byteoffset is greater than the current binary buffer length!");
            }
        }
        else {
            if (this._byteOffset + 2 > this._arrayBuffer.byteLength) {
                this._resizeBuffer(this._arrayBuffer.byteLength * 2);
            }
            this._dataView.setUint16(this._byteOffset, entry, true);
            this._byteOffset += 2;
        }
    };
    /**
     * Gets an UInt32 in the array buffer
     * @param byteOffset If defined, specifies where to set the value as an offset.
     * @returns entry
     */
    _BinaryWriter.prototype.getUInt32 = function (byteOffset) {
        if (byteOffset < this._byteOffset) {
            return this._dataView.getUint32(byteOffset, true);
        }
        else {
            babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Tools.Error("BinaryWriter: byteoffset is greater than the current binary buffer length!");
            throw new Error("BinaryWriter: byteoffset is greater than the current binary buffer length!");
        }
    };
    _BinaryWriter.prototype.getVector3Float32FromRef = function (vector3, byteOffset) {
        if (byteOffset + 8 > this._byteOffset) {
            babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Tools.Error("BinaryWriter: byteoffset is greater than the current binary buffer length!");
        }
        else {
            vector3.x = this._dataView.getFloat32(byteOffset, true);
            vector3.y = this._dataView.getFloat32(byteOffset + 4, true);
            vector3.z = this._dataView.getFloat32(byteOffset + 8, true);
        }
    };
    _BinaryWriter.prototype.setVector3Float32FromRef = function (vector3, byteOffset) {
        if (byteOffset + 8 > this._byteOffset) {
            babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Tools.Error("BinaryWriter: byteoffset is greater than the current binary buffer length!");
        }
        else {
            this._dataView.setFloat32(byteOffset, vector3.x, true);
            this._dataView.setFloat32(byteOffset + 4, vector3.y, true);
            this._dataView.setFloat32(byteOffset + 8, vector3.z, true);
        }
    };
    _BinaryWriter.prototype.getVector4Float32FromRef = function (vector4, byteOffset) {
        if (byteOffset + 12 > this._byteOffset) {
            babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Tools.Error("BinaryWriter: byteoffset is greater than the current binary buffer length!");
        }
        else {
            vector4.x = this._dataView.getFloat32(byteOffset, true);
            vector4.y = this._dataView.getFloat32(byteOffset + 4, true);
            vector4.z = this._dataView.getFloat32(byteOffset + 8, true);
            vector4.w = this._dataView.getFloat32(byteOffset + 12, true);
        }
    };
    _BinaryWriter.prototype.setVector4Float32FromRef = function (vector4, byteOffset) {
        if (byteOffset + 12 > this._byteOffset) {
            babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Tools.Error("BinaryWriter: byteoffset is greater than the current binary buffer length!");
        }
        else {
            this._dataView.setFloat32(byteOffset, vector4.x, true);
            this._dataView.setFloat32(byteOffset + 4, vector4.y, true);
            this._dataView.setFloat32(byteOffset + 8, vector4.z, true);
            this._dataView.setFloat32(byteOffset + 12, vector4.w, true);
        }
    };
    /**
     * Stores a Float32 in the array buffer
     * @param entry
     * @param byteOffset
     */
    _BinaryWriter.prototype.setFloat32 = function (entry, byteOffset) {
        if (isNaN(entry)) {
            babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Tools.Error("Invalid data being written!");
        }
        if (byteOffset != null) {
            if (byteOffset < this._byteOffset) {
                this._dataView.setFloat32(byteOffset, entry, true);
            }
            else {
                babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Tools.Error("BinaryWriter: byteoffset is greater than the current binary length!");
            }
        }
        if (this._byteOffset + 4 > this._arrayBuffer.byteLength) {
            this._resizeBuffer(this._arrayBuffer.byteLength * 2);
        }
        this._dataView.setFloat32(this._byteOffset, entry, true);
        this._byteOffset += 4;
    };
    /**
     * Stores an UInt32 in the array buffer
     * @param entry
     * @param byteOffset If defined, specifies where to set the value as an offset.
     */
    _BinaryWriter.prototype.setUInt32 = function (entry, byteOffset) {
        if (byteOffset != null) {
            if (byteOffset < this._byteOffset) {
                this._dataView.setUint32(byteOffset, entry, true);
            }
            else {
                babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Tools.Error("BinaryWriter: byteoffset is greater than the current binary buffer length!");
            }
        }
        else {
            if (this._byteOffset + 4 > this._arrayBuffer.byteLength) {
                this._resizeBuffer(this._arrayBuffer.byteLength * 2);
            }
            this._dataView.setUint32(this._byteOffset, entry, true);
            this._byteOffset += 4;
        }
    };
    /**
     * Stores an Int16 in the array buffer
     * @param entry
     * @param byteOffset If defined, specifies where to set the value as an offset.
     */
    _BinaryWriter.prototype.setInt16 = function (entry, byteOffset) {
        if (byteOffset != null) {
            if (byteOffset < this._byteOffset) {
                this._dataView.setInt16(byteOffset, entry, true);
            }
            else {
                babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Tools.Error("BinaryWriter: byteoffset is greater than the current binary buffer length!");
            }
        }
        else {
            if (this._byteOffset + 2 > this._arrayBuffer.byteLength) {
                this._resizeBuffer(this._arrayBuffer.byteLength * 2);
            }
            this._dataView.setInt16(this._byteOffset, entry, true);
            this._byteOffset += 2;
        }
    };
    /**
     * Stores a byte in the array buffer
     * @param entry
     * @param byteOffset If defined, specifies where to set the value as an offset.
     */
    _BinaryWriter.prototype.setByte = function (entry, byteOffset) {
        if (byteOffset != null) {
            if (byteOffset < this._byteOffset) {
                this._dataView.setInt8(byteOffset, entry);
            }
            else {
                babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Tools.Error("BinaryWriter: byteoffset is greater than the current binary buffer length!");
            }
        }
        else {
            if (this._byteOffset + 1 > this._arrayBuffer.byteLength) {
                this._resizeBuffer(this._arrayBuffer.byteLength * 2);
            }
            this._dataView.setInt8(this._byteOffset, entry);
            this._byteOffset++;
        }
    };
    return _BinaryWriter;
}());



/***/ }),

/***/ "../../../dev/serializers/src/glTF/2.0/glTFExporterExtension.ts":
/*!**********************************************************************!*\
  !*** ../../../dev/serializers/src/glTF/2.0/glTFExporterExtension.ts ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __IGLTFExporterExtensionV2: () => (/* binding */ __IGLTFExporterExtensionV2)
/* harmony export */ });
/** @internal */
// eslint-disable-next-line no-var, @typescript-eslint/naming-convention
var __IGLTFExporterExtensionV2 = 0; // I am here to allow dts to be created


/***/ }),

/***/ "../../../dev/serializers/src/glTF/2.0/glTFMaterialExporter.ts":
/*!*********************************************************************!*\
  !*** ../../../dev/serializers/src/glTF/2.0/glTFMaterialExporter.ts ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   _GLTFMaterialExporter: () => (/* binding */ _GLTFMaterialExporter)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tslib */ "../../../../node_modules/tslib/tslib.es6.mjs");
/* harmony import */ var babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! babylonjs/Engines/Extensions/engine.readTexture */ "babylonjs/Maths/math.vector");
/* harmony import */ var babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__);











function getFileExtensionFromMimeType(mimeType) {
    switch (mimeType) {
        case "image/jpeg" /* ImageMimeType.JPEG */:
            return ".jpg";
        case "image/png" /* ImageMimeType.PNG */:
            return ".png";
        case "image/webp" /* ImageMimeType.WEBP */:
            return ".webp";
        case "image/avif" /* ImageMimeType.AVIF */:
            return ".avif";
    }
}
/**
 * Utility methods for working with glTF material conversion properties.  This class should only be used internally
 * @internal
 */
var _GLTFMaterialExporter = /** @class */ (function () {
    function _GLTFMaterialExporter(exporter) {
        /**
         * Mapping to store textures
         */
        this._textureMap = {};
        // Mapping of internal textures to images to avoid exporting duplicate images.
        this._internalTextureToImage = {};
        this._textureMap = {};
        this._exporter = exporter;
    }
    /**
     * Specifies if two colors are approximately equal in value
     * @param color1 first color to compare to
     * @param color2 second color to compare to
     * @param epsilon threshold value
     * @returns boolean specifying if the colors are approximately equal in value
     */
    _GLTFMaterialExporter._FuzzyEquals = function (color1, color2, epsilon) {
        return babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Scalar.WithinEpsilon(color1.r, color2.r, epsilon) && babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Scalar.WithinEpsilon(color1.g, color2.g, epsilon) && babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Scalar.WithinEpsilon(color1.b, color2.b, epsilon);
    };
    /**
     * Gets the materials from a Babylon scene and converts them to glTF materials
     * @param exportMaterials
     * @param mimeType texture mime type
     * @param hasTextureCoords specifies if texture coordinates are present on the material
     * @returns promise that resolves after all materials have been converted
     */
    _GLTFMaterialExporter.prototype._convertMaterialsToGLTFAsync = function (exportMaterials, mimeType, hasTextureCoords) {
        var _this = this;
        var promises = [];
        exportMaterials.forEach(function (material) {
            if (material.getClassName() === "StandardMaterial") {
                promises.push(_this._convertStandardMaterialAsync(material, mimeType, hasTextureCoords));
            }
            else if (material.getClassName().indexOf("PBR") !== -1) {
                promises.push(_this._convertPBRMaterialAsync(material, mimeType, hasTextureCoords));
            }
            else {
                babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Tools.Warn("Unsupported material type: ".concat(material.name));
            }
        });
        return Promise.all(promises).then(function () {
            /* do nothing */
        });
    };
    /**
     * Makes a copy of the glTF material without the texture parameters
     * @param originalMaterial original glTF material
     * @returns glTF material without texture parameters
     */
    _GLTFMaterialExporter.prototype._stripTexturesFromMaterial = function (originalMaterial) {
        var newMaterial = {};
        if (originalMaterial) {
            newMaterial.name = originalMaterial.name;
            newMaterial.doubleSided = originalMaterial.doubleSided;
            newMaterial.alphaMode = originalMaterial.alphaMode;
            newMaterial.alphaCutoff = originalMaterial.alphaCutoff;
            newMaterial.emissiveFactor = originalMaterial.emissiveFactor;
            var originalPBRMetallicRoughness = originalMaterial.pbrMetallicRoughness;
            if (originalPBRMetallicRoughness) {
                newMaterial.pbrMetallicRoughness = {};
                newMaterial.pbrMetallicRoughness.baseColorFactor = originalPBRMetallicRoughness.baseColorFactor;
                newMaterial.pbrMetallicRoughness.metallicFactor = originalPBRMetallicRoughness.metallicFactor;
                newMaterial.pbrMetallicRoughness.roughnessFactor = originalPBRMetallicRoughness.roughnessFactor;
            }
        }
        return newMaterial;
    };
    /**
     * Specifies if the material has any texture parameters present
     * @param material glTF Material
     * @returns boolean specifying if texture parameters are present
     */
    _GLTFMaterialExporter.prototype._hasTexturesPresent = function (material) {
        var _a;
        if (material.emissiveTexture || material.normalTexture || material.occlusionTexture) {
            return true;
        }
        var pbrMat = material.pbrMetallicRoughness;
        if (pbrMat) {
            if (pbrMat.baseColorTexture || pbrMat.metallicRoughnessTexture) {
                return true;
            }
        }
        if (material.extensions) {
            for (var extension in material.extensions) {
                var extensionObject = material.extensions[extension];
                if (extensionObject) {
                    return (_a = extensionObject.hasTextures) === null || _a === void 0 ? void 0 : _a.call(extensionObject);
                }
            }
        }
        return false;
    };
    _GLTFMaterialExporter.prototype._getTextureInfo = function (babylonTexture) {
        if (babylonTexture) {
            var textureUid = babylonTexture.uid;
            if (textureUid in this._textureMap) {
                return this._textureMap[textureUid];
            }
        }
        return null;
    };
    /**
     * Converts a Babylon StandardMaterial to a glTF Metallic Roughness Material
     * @param babylonStandardMaterial
     * @returns glTF Metallic Roughness Material representation
     */
    _GLTFMaterialExporter.prototype._convertToGLTFPBRMetallicRoughness = function (babylonStandardMaterial) {
        // Defines a cubic bezier curve where x is specular power and y is roughness
        var P0 = new babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Vector2(0, 1);
        var P1 = new babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Vector2(0, 0.1);
        var P2 = new babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Vector2(0, 0.1);
        var P3 = new babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Vector2(1300, 0.1);
        /**
         * Given the control points, solve for x based on a given t for a cubic bezier curve
         * @param t a value between 0 and 1
         * @param p0 first control point
         * @param p1 second control point
         * @param p2 third control point
         * @param p3 fourth control point
         * @returns number result of cubic bezier curve at the specified t
         */
        function cubicBezierCurve(t, p0, p1, p2, p3) {
            return (1 - t) * (1 - t) * (1 - t) * p0 + 3 * (1 - t) * (1 - t) * t * p1 + 3 * (1 - t) * t * t * p2 + t * t * t * p3;
        }
        /**
         * Evaluates a specified specular power value to determine the appropriate roughness value,
         * based on a pre-defined cubic bezier curve with specular on the abscissa axis (x-axis)
         * and roughness on the ordinant axis (y-axis)
         * @param specularPower specular power of standard material
         * @returns Number representing the roughness value
         */
        function solveForRoughness(specularPower) {
            // Given P0.x = 0, P1.x = 0, P2.x = 0
            //   x = t * t * t * P3.x
            //   t = (x / P3.x)^(1/3)
            var t = Math.pow(specularPower / P3.x, 0.333333);
            return cubicBezierCurve(t, P0.y, P1.y, P2.y, P3.y);
        }
        var diffuse = babylonStandardMaterial.diffuseColor.toLinearSpace(babylonStandardMaterial.getScene().getEngine().useExactSrgbConversions).scale(0.5);
        var opacity = babylonStandardMaterial.alpha;
        var specularPower = babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Scalar.Clamp(babylonStandardMaterial.specularPower, 0, _GLTFMaterialExporter._MaxSpecularPower);
        var roughness = solveForRoughness(specularPower);
        var glTFPbrMetallicRoughness = {
            baseColorFactor: [diffuse.r, diffuse.g, diffuse.b, opacity],
            metallicFactor: 0,
            roughnessFactor: roughness,
        };
        return glTFPbrMetallicRoughness;
    };
    /**
     * Computes the metallic factor
     * @param diffuse diffused value
     * @param specular specular value
     * @param oneMinusSpecularStrength one minus the specular strength
     * @returns metallic value
     */
    _GLTFMaterialExporter._SolveMetallic = function (diffuse, specular, oneMinusSpecularStrength) {
        if (specular < this._DielectricSpecular.r) {
            this._DielectricSpecular;
            return 0;
        }
        var a = this._DielectricSpecular.r;
        var b = (diffuse * oneMinusSpecularStrength) / (1.0 - this._DielectricSpecular.r) + specular - 2.0 * this._DielectricSpecular.r;
        var c = this._DielectricSpecular.r - specular;
        var D = b * b - 4.0 * a * c;
        return babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Scalar.Clamp((-b + Math.sqrt(D)) / (2.0 * a), 0, 1);
    };
    /**
     * Sets the glTF alpha mode to a glTF material from the Babylon Material
     * @param glTFMaterial glTF material
     * @param babylonMaterial Babylon material
     */
    _GLTFMaterialExporter._SetAlphaMode = function (glTFMaterial, babylonMaterial) {
        if (babylonMaterial.needAlphaBlending()) {
            glTFMaterial.alphaMode = "BLEND" /* MaterialAlphaMode.BLEND */;
        }
        else if (babylonMaterial.needAlphaTesting()) {
            glTFMaterial.alphaMode = "MASK" /* MaterialAlphaMode.MASK */;
            glTFMaterial.alphaCutoff = babylonMaterial.alphaCutOff;
        }
    };
    /**
     * Converts a Babylon Standard Material to a glTF Material
     * @param babylonStandardMaterial BJS Standard Material
     * @param mimeType mime type to use for the textures
     * @param hasTextureCoords specifies if texture coordinates are present on the submesh to determine if textures should be applied
     * @returns promise, resolved with the material
     */
    _GLTFMaterialExporter.prototype._convertStandardMaterialAsync = function (babylonStandardMaterial, mimeType, hasTextureCoords) {
        var materialMap = this._exporter._materialMap;
        var materials = this._exporter._materials;
        var promises = [];
        var pbrMetallicRoughness = this._convertToGLTFPBRMetallicRoughness(babylonStandardMaterial);
        var material = { name: babylonStandardMaterial.name };
        if (babylonStandardMaterial.backFaceCulling != null && !babylonStandardMaterial.backFaceCulling) {
            if (!babylonStandardMaterial.twoSidedLighting) {
                babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Tools.Warn(babylonStandardMaterial.name + ": Back-face culling disabled and two-sided lighting disabled is not supported in glTF.");
            }
            material.doubleSided = true;
        }
        if (hasTextureCoords) {
            if (babylonStandardMaterial.diffuseTexture) {
                promises.push(this._exportTextureAsync(babylonStandardMaterial.diffuseTexture, mimeType).then(function (textureInfo) {
                    if (textureInfo) {
                        pbrMetallicRoughness.baseColorTexture = textureInfo;
                    }
                }));
            }
            var bumpTexture_1 = babylonStandardMaterial.bumpTexture;
            if (bumpTexture_1) {
                promises.push(this._exportTextureAsync(bumpTexture_1, mimeType).then(function (textureInfo) {
                    if (textureInfo) {
                        material.normalTexture = textureInfo;
                        if (bumpTexture_1.level !== 1) {
                            material.normalTexture.scale = bumpTexture_1.level;
                        }
                    }
                }));
            }
            if (babylonStandardMaterial.emissiveTexture) {
                material.emissiveFactor = [1.0, 1.0, 1.0];
                promises.push(this._exportTextureAsync(babylonStandardMaterial.emissiveTexture, mimeType).then(function (textureInfo) {
                    if (textureInfo) {
                        material.emissiveTexture = textureInfo;
                    }
                }));
            }
            if (babylonStandardMaterial.ambientTexture) {
                promises.push(this._exportTextureAsync(babylonStandardMaterial.ambientTexture, mimeType).then(function (textureInfo) {
                    if (textureInfo) {
                        var occlusionTexture = {
                            index: textureInfo.index,
                        };
                        material.occlusionTexture = occlusionTexture;
                    }
                }));
            }
        }
        if (babylonStandardMaterial.alpha < 1.0 || babylonStandardMaterial.opacityTexture) {
            if (babylonStandardMaterial.alphaMode === babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Constants.ALPHA_COMBINE) {
                material.alphaMode = "BLEND" /* MaterialAlphaMode.BLEND */;
            }
            else {
                babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Tools.Warn(babylonStandardMaterial.name + ": glTF 2.0 does not support alpha mode: " + babylonStandardMaterial.alphaMode.toString());
            }
        }
        if (babylonStandardMaterial.emissiveColor && !_GLTFMaterialExporter._FuzzyEquals(babylonStandardMaterial.emissiveColor, babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Color3.Black(), _GLTFMaterialExporter._Epsilon)) {
            material.emissiveFactor = babylonStandardMaterial.emissiveColor.asArray();
        }
        material.pbrMetallicRoughness = pbrMetallicRoughness;
        _GLTFMaterialExporter._SetAlphaMode(material, babylonStandardMaterial);
        materials.push(material);
        materialMap[babylonStandardMaterial.uniqueId] = materials.length - 1;
        return this._finishMaterial(promises, material, babylonStandardMaterial, mimeType);
    };
    _GLTFMaterialExporter.prototype._finishMaterial = function (promises, glTFMaterial, babylonMaterial, mimeType) {
        var _this = this;
        return Promise.all(promises).then(function () {
            var textures = _this._exporter._extensionsPostExportMaterialAdditionalTextures("exportMaterial", glTFMaterial, babylonMaterial);
            var tasks = null;
            for (var _i = 0, textures_1 = textures; _i < textures_1.length; _i++) {
                var texture = textures_1[_i];
                if (!tasks) {
                    tasks = [];
                }
                tasks.push(_this._exportTextureAsync(texture, mimeType));
            }
            if (!tasks) {
                tasks = [Promise.resolve(null)];
            }
            return Promise.all(tasks).then(function () {
                var extensionWork = _this._exporter._extensionsPostExportMaterialAsync("exportMaterial", glTFMaterial, babylonMaterial);
                if (!extensionWork) {
                    return glTFMaterial;
                }
                return extensionWork.then(function () { return glTFMaterial; });
            });
        });
    };
    /**
     * Converts an image typed array buffer to a base64 image
     * @param buffer typed array buffer
     * @param width width of the image
     * @param height height of the image
     * @param mimeType mimetype of the image
     * @returns base64 image string
     */
    _GLTFMaterialExporter.prototype._getImageDataAsync = function (buffer, width, height, mimeType) {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__awaiter)(this, void 0, void 0, function () {
            var textureType, hostingScene, engine, tempTexture, data;
            return (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        textureType = babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Constants.TEXTURETYPE_UNSIGNED_INT;
                        hostingScene = this._exporter._babylonScene;
                        engine = hostingScene.getEngine();
                        tempTexture = engine.createRawTexture(buffer, width, height, babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Constants.TEXTUREFORMAT_RGBA, false, true, babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Texture.NEAREST_SAMPLINGMODE, null, textureType);
                        return [4 /*yield*/, babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.TextureTools.ApplyPostProcess("pass", tempTexture, hostingScene, textureType, babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Constants.TEXTURE_NEAREST_SAMPLINGMODE, babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Constants.TEXTUREFORMAT_RGBA)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, engine._readTexturePixels(tempTexture, width, height)];
                    case 2:
                        data = _a.sent();
                        return [4 /*yield*/, babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.DumpTools.DumpDataAsync(width, height, data, mimeType, undefined, true, true)];
                    case 3: return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    /**
     * Generates a white texture based on the specified width and height
     * @param width width of the texture in pixels
     * @param height height of the texture in pixels
     * @param scene babylonjs scene
     * @returns white texture
     */
    _GLTFMaterialExporter.prototype._createWhiteTexture = function (width, height, scene) {
        var data = new Uint8Array(width * height * 4);
        for (var i = 0; i < data.length; i = i + 4) {
            data[i] = data[i + 1] = data[i + 2] = data[i + 3] = 0xff;
        }
        var rawTexture = babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.RawTexture.CreateRGBATexture(data, width, height, scene);
        return rawTexture;
    };
    /**
     * Resizes the two source textures to the same dimensions.  If a texture is null, a default white texture is generated.  If both textures are null, returns null
     * @param texture1 first texture to resize
     * @param texture2 second texture to resize
     * @param scene babylonjs scene
     * @returns resized textures or null
     */
    _GLTFMaterialExporter.prototype._resizeTexturesToSameDimensions = function (texture1, texture2, scene) {
        var texture1Size = texture1 ? texture1.getSize() : { width: 0, height: 0 };
        var texture2Size = texture2 ? texture2.getSize() : { width: 0, height: 0 };
        var resizedTexture1;
        var resizedTexture2;
        if (texture1Size.width < texture2Size.width) {
            if (texture1 && texture1 instanceof babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Texture) {
                resizedTexture1 = babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.TextureTools.CreateResizedCopy(texture1, texture2Size.width, texture2Size.height, true);
            }
            else {
                resizedTexture1 = this._createWhiteTexture(texture2Size.width, texture2Size.height, scene);
            }
            resizedTexture2 = texture2;
        }
        else if (texture1Size.width > texture2Size.width) {
            if (texture2 && texture2 instanceof babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Texture) {
                resizedTexture2 = babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.TextureTools.CreateResizedCopy(texture2, texture1Size.width, texture1Size.height, true);
            }
            else {
                resizedTexture2 = this._createWhiteTexture(texture1Size.width, texture1Size.height, scene);
            }
            resizedTexture1 = texture1;
        }
        else {
            resizedTexture1 = texture1;
            resizedTexture2 = texture2;
        }
        return {
            texture1: resizedTexture1,
            texture2: resizedTexture2,
        };
    };
    /**
     * Converts an array of pixels to a Float32Array
     * Throws an error if the pixel format is not supported
     * @param pixels - array buffer containing pixel values
     * @returns Float32 of pixels
     */
    _GLTFMaterialExporter.prototype._convertPixelArrayToFloat32 = function (pixels) {
        if (pixels instanceof Uint8Array) {
            var length_1 = pixels.length;
            var buffer = new Float32Array(pixels.length);
            for (var i = 0; i < length_1; ++i) {
                buffer[i] = pixels[i] / 255;
            }
            return buffer;
        }
        else if (pixels instanceof Float32Array) {
            return pixels;
        }
        else {
            throw new Error("Unsupported pixel format!");
        }
    };
    /**
     * Convert Specular Glossiness Textures to Metallic Roughness
     * See link below for info on the material conversions from PBR Metallic/Roughness and Specular/Glossiness
     * @link https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Archived/KHR_materials_pbrSpecularGlossiness/examples/convert-between-workflows-bjs/js/babylon.pbrUtilities.js
     * @param diffuseTexture texture used to store diffuse information
     * @param specularGlossinessTexture texture used to store specular and glossiness information
     * @param factors specular glossiness material factors
     * @param mimeType the mime type to use for the texture
     * @returns pbr metallic roughness interface or null
     */
    _GLTFMaterialExporter.prototype._convertSpecularGlossinessTexturesToMetallicRoughnessAsync = function (diffuseTexture, specularGlossinessTexture, factors, mimeType) {
        var _a;
        return (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__awaiter)(this, void 0, void 0, function () {
            var promises, scene, resizedTextures, diffuseSize, diffuseBuffer, specularGlossinessBuffer, width, height, diffusePixels, specularPixels, byteLength, metallicRoughnessBuffer, baseColorBuffer, strideSize, maxBaseColor, maxMetallic, maxRoughness, h, w, offset, diffuseColor, specularColor, glossiness, specularGlossiness, metallicRoughness, metallicRoughnessFactors_1, writeOutMetallicRoughnessTexture, writeOutBaseColorTexture, h, w, destinationOffset, linearBaseColorPixel, sRGBBaseColorPixel, metallicRoughnessPixel;
            return (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        promises = new Array();
                        if (!(diffuseTexture || specularGlossinessTexture)) {
                            return [2 /*return*/, Promise.reject("_ConvertSpecularGlosinessTexturesToMetallicRoughness: diffuse and specular glossiness textures are not defined!")];
                        }
                        scene = diffuseTexture ? diffuseTexture.getScene() : specularGlossinessTexture ? specularGlossinessTexture.getScene() : null;
                        if (!scene) return [3 /*break*/, 3];
                        resizedTextures = this._resizeTexturesToSameDimensions(diffuseTexture, specularGlossinessTexture, scene);
                        diffuseSize = (_a = resizedTextures.texture1) === null || _a === void 0 ? void 0 : _a.getSize();
                        diffuseBuffer = void 0;
                        specularGlossinessBuffer = void 0;
                        width = diffuseSize.width;
                        height = diffuseSize.height;
                        return [4 /*yield*/, resizedTextures.texture1.readPixels()];
                    case 1:
                        diffusePixels = _b.sent();
                        return [4 /*yield*/, resizedTextures.texture2.readPixels()];
                    case 2:
                        specularPixels = _b.sent();
                        if (diffusePixels) {
                            diffuseBuffer = this._convertPixelArrayToFloat32(diffusePixels);
                        }
                        else {
                            return [2 /*return*/, Promise.reject("Failed to retrieve pixels from diffuse texture!")];
                        }
                        if (specularPixels) {
                            specularGlossinessBuffer = this._convertPixelArrayToFloat32(specularPixels);
                        }
                        else {
                            return [2 /*return*/, Promise.reject("Failed to retrieve pixels from specular glossiness texture!")];
                        }
                        byteLength = specularGlossinessBuffer.byteLength;
                        metallicRoughnessBuffer = new Uint8Array(byteLength);
                        baseColorBuffer = new Uint8Array(byteLength);
                        strideSize = 4;
                        maxBaseColor = babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Color3.Black();
                        maxMetallic = 0;
                        maxRoughness = 0;
                        for (h = 0; h < height; ++h) {
                            for (w = 0; w < width; ++w) {
                                offset = (width * h + w) * strideSize;
                                diffuseColor = new babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Color3(diffuseBuffer[offset], diffuseBuffer[offset + 1], diffuseBuffer[offset + 2])
                                    .toLinearSpace(scene.getEngine().useExactSrgbConversions)
                                    .multiply(factors.diffuseColor);
                                specularColor = new babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Color3(specularGlossinessBuffer[offset], specularGlossinessBuffer[offset + 1], specularGlossinessBuffer[offset + 2])
                                    .toLinearSpace(scene.getEngine().useExactSrgbConversions)
                                    .multiply(factors.specularColor);
                                glossiness = specularGlossinessBuffer[offset + 3] * factors.glossiness;
                                specularGlossiness = {
                                    diffuseColor: diffuseColor,
                                    specularColor: specularColor,
                                    glossiness: glossiness,
                                };
                                metallicRoughness = this._convertSpecularGlossinessToMetallicRoughness(specularGlossiness);
                                maxBaseColor.r = Math.max(maxBaseColor.r, metallicRoughness.baseColor.r);
                                maxBaseColor.g = Math.max(maxBaseColor.g, metallicRoughness.baseColor.g);
                                maxBaseColor.b = Math.max(maxBaseColor.b, metallicRoughness.baseColor.b);
                                maxMetallic = Math.max(maxMetallic, metallicRoughness.metallic);
                                maxRoughness = Math.max(maxRoughness, metallicRoughness.roughness);
                                baseColorBuffer[offset] = metallicRoughness.baseColor.r * 255;
                                baseColorBuffer[offset + 1] = metallicRoughness.baseColor.g * 255;
                                baseColorBuffer[offset + 2] = metallicRoughness.baseColor.b * 255;
                                baseColorBuffer[offset + 3] = resizedTextures.texture1.hasAlpha ? diffuseBuffer[offset + 3] * 255 : 255;
                                metallicRoughnessBuffer[offset] = 0;
                                metallicRoughnessBuffer[offset + 1] = metallicRoughness.roughness * 255;
                                metallicRoughnessBuffer[offset + 2] = metallicRoughness.metallic * 255;
                                metallicRoughnessBuffer[offset + 3] = 255;
                            }
                        }
                        metallicRoughnessFactors_1 = {
                            baseColor: maxBaseColor,
                            metallic: maxMetallic,
                            roughness: maxRoughness,
                        };
                        writeOutMetallicRoughnessTexture = false;
                        writeOutBaseColorTexture = false;
                        for (h = 0; h < height; ++h) {
                            for (w = 0; w < width; ++w) {
                                destinationOffset = (width * h + w) * strideSize;
                                baseColorBuffer[destinationOffset] /= metallicRoughnessFactors_1.baseColor.r > _GLTFMaterialExporter._Epsilon ? metallicRoughnessFactors_1.baseColor.r : 1;
                                baseColorBuffer[destinationOffset + 1] /= metallicRoughnessFactors_1.baseColor.g > _GLTFMaterialExporter._Epsilon ? metallicRoughnessFactors_1.baseColor.g : 1;
                                baseColorBuffer[destinationOffset + 2] /= metallicRoughnessFactors_1.baseColor.b > _GLTFMaterialExporter._Epsilon ? metallicRoughnessFactors_1.baseColor.b : 1;
                                linearBaseColorPixel = babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Color3.FromInts(baseColorBuffer[destinationOffset], baseColorBuffer[destinationOffset + 1], baseColorBuffer[destinationOffset + 2]);
                                sRGBBaseColorPixel = linearBaseColorPixel.toGammaSpace(scene.getEngine().useExactSrgbConversions);
                                baseColorBuffer[destinationOffset] = sRGBBaseColorPixel.r * 255;
                                baseColorBuffer[destinationOffset + 1] = sRGBBaseColorPixel.g * 255;
                                baseColorBuffer[destinationOffset + 2] = sRGBBaseColorPixel.b * 255;
                                if (!_GLTFMaterialExporter._FuzzyEquals(sRGBBaseColorPixel, babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Color3.White(), _GLTFMaterialExporter._Epsilon)) {
                                    writeOutBaseColorTexture = true;
                                }
                                metallicRoughnessBuffer[destinationOffset + 1] /=
                                    metallicRoughnessFactors_1.roughness > _GLTFMaterialExporter._Epsilon ? metallicRoughnessFactors_1.roughness : 1;
                                metallicRoughnessBuffer[destinationOffset + 2] /= metallicRoughnessFactors_1.metallic > _GLTFMaterialExporter._Epsilon ? metallicRoughnessFactors_1.metallic : 1;
                                metallicRoughnessPixel = babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Color3.FromInts(255, metallicRoughnessBuffer[destinationOffset + 1], metallicRoughnessBuffer[destinationOffset + 2]);
                                if (!_GLTFMaterialExporter._FuzzyEquals(metallicRoughnessPixel, babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Color3.White(), _GLTFMaterialExporter._Epsilon)) {
                                    writeOutMetallicRoughnessTexture = true;
                                }
                            }
                        }
                        if (writeOutMetallicRoughnessTexture) {
                            promises.push(this._getImageDataAsync(metallicRoughnessBuffer, width, height, mimeType).then(function (data) {
                                metallicRoughnessFactors_1.metallicRoughnessTextureData = data;
                            }));
                        }
                        if (writeOutBaseColorTexture) {
                            promises.push(this._getImageDataAsync(baseColorBuffer, width, height, mimeType).then(function (data) {
                                metallicRoughnessFactors_1.baseColorTextureData = data;
                            }));
                        }
                        return [2 /*return*/, Promise.all(promises).then(function () {
                                return metallicRoughnessFactors_1;
                            })];
                    case 3: return [2 /*return*/, Promise.reject("_ConvertSpecularGlossinessTexturesToMetallicRoughness: Scene from textures is missing!")];
                }
            });
        });
    };
    /**
     * Converts specular glossiness material properties to metallic roughness
     * @param specularGlossiness interface with specular glossiness material properties
     * @returns interface with metallic roughness material properties
     */
    _GLTFMaterialExporter.prototype._convertSpecularGlossinessToMetallicRoughness = function (specularGlossiness) {
        var diffusePerceivedBrightness = this._getPerceivedBrightness(specularGlossiness.diffuseColor);
        var specularPerceivedBrightness = this._getPerceivedBrightness(specularGlossiness.specularColor);
        var oneMinusSpecularStrength = 1 - this._getMaxComponent(specularGlossiness.specularColor);
        var metallic = _GLTFMaterialExporter._SolveMetallic(diffusePerceivedBrightness, specularPerceivedBrightness, oneMinusSpecularStrength);
        var baseColorFromDiffuse = specularGlossiness.diffuseColor.scale(oneMinusSpecularStrength / (1.0 - _GLTFMaterialExporter._DielectricSpecular.r) / Math.max(1 - metallic, _GLTFMaterialExporter._Epsilon));
        var baseColorFromSpecular = specularGlossiness.specularColor
            .subtract(_GLTFMaterialExporter._DielectricSpecular.scale(1 - metallic))
            .scale(1 / Math.max(metallic, _GLTFMaterialExporter._Epsilon));
        var baseColor = babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Color3.Lerp(baseColorFromDiffuse, baseColorFromSpecular, metallic * metallic);
        baseColor = baseColor.clampToRef(0, 1, baseColor);
        var metallicRoughness = {
            baseColor: baseColor,
            metallic: metallic,
            roughness: 1 - specularGlossiness.glossiness,
        };
        return metallicRoughness;
    };
    /**
     * Calculates the surface reflectance, independent of lighting conditions
     * @param color Color source to calculate brightness from
     * @returns number representing the perceived brightness, or zero if color is undefined
     */
    _GLTFMaterialExporter.prototype._getPerceivedBrightness = function (color) {
        if (color) {
            return Math.sqrt(0.299 * color.r * color.r + 0.587 * color.g * color.g + 0.114 * color.b * color.b);
        }
        return 0;
    };
    /**
     * Returns the maximum color component value
     * @param color
     * @returns maximum color component value, or zero if color is null or undefined
     */
    _GLTFMaterialExporter.prototype._getMaxComponent = function (color) {
        if (color) {
            return Math.max(color.r, Math.max(color.g, color.b));
        }
        return 0;
    };
    /**
     * Convert a PBRMaterial (Metallic/Roughness) to Metallic Roughness factors
     * @param babylonPBRMaterial BJS PBR Metallic Roughness Material
     * @param mimeType mime type to use for the textures
     * @param glTFPbrMetallicRoughness glTF PBR Metallic Roughness interface
     * @param hasTextureCoords specifies if texture coordinates are present on the submesh to determine if textures should be applied
     * @returns glTF PBR Metallic Roughness factors
     */
    _GLTFMaterialExporter.prototype._convertMetalRoughFactorsToMetallicRoughnessAsync = function (babylonPBRMaterial, mimeType, glTFPbrMetallicRoughness, hasTextureCoords) {
        var promises = [];
        var baseColor = babylonPBRMaterial._albedoColor;
        var metallic = babylonPBRMaterial._metallic;
        var roughness = babylonPBRMaterial._roughness;
        var metallicRoughness = {
            baseColor: baseColor,
            metallic: metallic,
            roughness: roughness,
        };
        if (hasTextureCoords) {
            var albedoTexture = babylonPBRMaterial._albedoTexture;
            if (albedoTexture) {
                promises.push(this._exportTextureAsync(babylonPBRMaterial._albedoTexture, mimeType).then(function (glTFTexture) {
                    if (glTFTexture) {
                        glTFPbrMetallicRoughness.baseColorTexture = glTFTexture;
                    }
                }));
            }
            var metallicTexture = babylonPBRMaterial._metallicTexture;
            if (metallicTexture) {
                promises.push(this._exportTextureAsync(metallicTexture, mimeType).then(function (glTFTexture) {
                    if (glTFTexture) {
                        glTFPbrMetallicRoughness.metallicRoughnessTexture = glTFTexture;
                    }
                }));
            }
        }
        return Promise.all(promises).then(function () {
            return metallicRoughness;
        });
    };
    _GLTFMaterialExporter.prototype._getTextureSampler = function (texture) {
        var sampler = {};
        if (!texture || !(texture instanceof babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Texture)) {
            return sampler;
        }
        var wrapS = this._getGLTFTextureWrapMode(texture.wrapU);
        if (wrapS !== 10497 /* TextureWrapMode.REPEAT */) {
            sampler.wrapS = wrapS;
        }
        var wrapT = this._getGLTFTextureWrapMode(texture.wrapV);
        if (wrapT !== 10497 /* TextureWrapMode.REPEAT */) {
            sampler.wrapT = wrapT;
        }
        switch (texture.samplingMode) {
            case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Texture.LINEAR_LINEAR: {
                sampler.magFilter = 9729 /* TextureMagFilter.LINEAR */;
                sampler.minFilter = 9729 /* TextureMinFilter.LINEAR */;
                break;
            }
            case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Texture.LINEAR_NEAREST: {
                sampler.magFilter = 9729 /* TextureMagFilter.LINEAR */;
                sampler.minFilter = 9728 /* TextureMinFilter.NEAREST */;
                break;
            }
            case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Texture.NEAREST_LINEAR: {
                sampler.magFilter = 9728 /* TextureMagFilter.NEAREST */;
                sampler.minFilter = 9729 /* TextureMinFilter.LINEAR */;
                break;
            }
            case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Texture.NEAREST_LINEAR_MIPLINEAR: {
                sampler.magFilter = 9728 /* TextureMagFilter.NEAREST */;
                sampler.minFilter = 9987 /* TextureMinFilter.LINEAR_MIPMAP_LINEAR */;
                break;
            }
            case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Texture.NEAREST_NEAREST: {
                sampler.magFilter = 9728 /* TextureMagFilter.NEAREST */;
                sampler.minFilter = 9728 /* TextureMinFilter.NEAREST */;
                break;
            }
            case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Texture.NEAREST_LINEAR_MIPNEAREST: {
                sampler.magFilter = 9728 /* TextureMagFilter.NEAREST */;
                sampler.minFilter = 9985 /* TextureMinFilter.LINEAR_MIPMAP_NEAREST */;
                break;
            }
            case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Texture.LINEAR_NEAREST_MIPNEAREST: {
                sampler.magFilter = 9729 /* TextureMagFilter.LINEAR */;
                sampler.minFilter = 9984 /* TextureMinFilter.NEAREST_MIPMAP_NEAREST */;
                break;
            }
            case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Texture.LINEAR_NEAREST_MIPLINEAR: {
                sampler.magFilter = 9729 /* TextureMagFilter.LINEAR */;
                sampler.minFilter = 9986 /* TextureMinFilter.NEAREST_MIPMAP_LINEAR */;
                break;
            }
            case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Texture.NEAREST_NEAREST_MIPLINEAR: {
                sampler.magFilter = 9728 /* TextureMagFilter.NEAREST */;
                sampler.minFilter = 9986 /* TextureMinFilter.NEAREST_MIPMAP_LINEAR */;
                break;
            }
            case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Texture.LINEAR_LINEAR_MIPLINEAR: {
                sampler.magFilter = 9729 /* TextureMagFilter.LINEAR */;
                sampler.minFilter = 9987 /* TextureMinFilter.LINEAR_MIPMAP_LINEAR */;
                break;
            }
            case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Texture.LINEAR_LINEAR_MIPNEAREST: {
                sampler.magFilter = 9729 /* TextureMagFilter.LINEAR */;
                sampler.minFilter = 9985 /* TextureMinFilter.LINEAR_MIPMAP_NEAREST */;
                break;
            }
            case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Texture.NEAREST_NEAREST_MIPNEAREST: {
                sampler.magFilter = 9728 /* TextureMagFilter.NEAREST */;
                sampler.minFilter = 9984 /* TextureMinFilter.NEAREST_MIPMAP_NEAREST */;
                break;
            }
        }
        return sampler;
    };
    _GLTFMaterialExporter.prototype._getGLTFTextureWrapMode = function (wrapMode) {
        switch (wrapMode) {
            case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Texture.WRAP_ADDRESSMODE: {
                return 10497 /* TextureWrapMode.REPEAT */;
            }
            case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Texture.CLAMP_ADDRESSMODE: {
                return 33071 /* TextureWrapMode.CLAMP_TO_EDGE */;
            }
            case babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Texture.MIRROR_ADDRESSMODE: {
                return 33648 /* TextureWrapMode.MIRRORED_REPEAT */;
            }
            default: {
                babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Tools.Error("Unsupported Texture Wrap Mode ".concat(wrapMode, "!"));
                return 10497 /* TextureWrapMode.REPEAT */;
            }
        }
    };
    /**
     * Convert a PBRMaterial (Specular/Glossiness) to Metallic Roughness factors
     * @param babylonPBRMaterial BJS PBR Metallic Roughness Material
     * @param mimeType mime type to use for the textures
     * @param pbrMetallicRoughness glTF PBR Metallic Roughness interface
     * @param hasTextureCoords specifies if texture coordinates are present on the submesh to determine if textures should be applied
     * @returns glTF PBR Metallic Roughness factors
     */
    _GLTFMaterialExporter.prototype._convertSpecGlossFactorsToMetallicRoughnessAsync = function (babylonPBRMaterial, mimeType, pbrMetallicRoughness, hasTextureCoords) {
        var _this = this;
        return Promise.resolve().then(function () {
            var specGloss = {
                diffuseColor: babylonPBRMaterial._albedoColor,
                specularColor: babylonPBRMaterial._reflectivityColor,
                glossiness: babylonPBRMaterial._microSurface,
            };
            var albedoTexture = babylonPBRMaterial._albedoTexture;
            var reflectivityTexture = babylonPBRMaterial._reflectivityTexture;
            var useMicrosurfaceFromReflectivityMapAlpha = babylonPBRMaterial._useMicroSurfaceFromReflectivityMapAlpha;
            if (reflectivityTexture && !useMicrosurfaceFromReflectivityMapAlpha) {
                return Promise.reject("_ConvertPBRMaterial: Glossiness values not included in the reflectivity texture are currently not supported");
            }
            if ((albedoTexture || reflectivityTexture) && hasTextureCoords) {
                var samplerIndex_1 = _this._exportTextureSampler(albedoTexture || reflectivityTexture);
                return _this._convertSpecularGlossinessTexturesToMetallicRoughnessAsync(albedoTexture, reflectivityTexture, specGloss, mimeType).then(function (metallicRoughnessFactors) {
                    var textures = _this._exporter._textures;
                    if (metallicRoughnessFactors.baseColorTextureData) {
                        var imageIndex = _this._exportImage("baseColor".concat(textures.length), mimeType, metallicRoughnessFactors.baseColorTextureData);
                        pbrMetallicRoughness.baseColorTexture = _this._exportTextureInfo(imageIndex, samplerIndex_1, albedoTexture === null || albedoTexture === void 0 ? void 0 : albedoTexture.coordinatesIndex);
                    }
                    if (metallicRoughnessFactors.metallicRoughnessTextureData) {
                        var imageIndex = _this._exportImage("metallicRoughness".concat(textures.length), mimeType, metallicRoughnessFactors.metallicRoughnessTextureData);
                        pbrMetallicRoughness.metallicRoughnessTexture = _this._exportTextureInfo(imageIndex, samplerIndex_1, reflectivityTexture === null || reflectivityTexture === void 0 ? void 0 : reflectivityTexture.coordinatesIndex);
                    }
                    return metallicRoughnessFactors;
                });
            }
            else {
                return _this._convertSpecularGlossinessToMetallicRoughness(specGloss);
            }
        });
    };
    /**
     * Converts a Babylon PBR Base Material to a glTF Material
     * @param babylonPBRMaterial BJS PBR Base Material
     * @param mimeType mime type to use for the textures
     * @param hasTextureCoords specifies if texture coordinates are present on the submesh to determine if textures should be applied
     * @returns async glTF Material representation
     */
    _GLTFMaterialExporter.prototype._convertPBRMaterialAsync = function (babylonPBRMaterial, mimeType, hasTextureCoords) {
        var _this = this;
        var glTFPbrMetallicRoughness = {};
        var glTFMaterial = {
            name: babylonPBRMaterial.name,
        };
        var useMetallicRoughness = babylonPBRMaterial.isMetallicWorkflow();
        if (useMetallicRoughness) {
            var albedoColor = babylonPBRMaterial._albedoColor;
            var alpha = babylonPBRMaterial.alpha;
            if (albedoColor) {
                glTFPbrMetallicRoughness.baseColorFactor = [albedoColor.r, albedoColor.g, albedoColor.b, alpha];
            }
            return this._convertMetalRoughFactorsToMetallicRoughnessAsync(babylonPBRMaterial, mimeType, glTFPbrMetallicRoughness, hasTextureCoords).then(function (metallicRoughness) {
                return _this._setMetallicRoughnessPbrMaterial(metallicRoughness, babylonPBRMaterial, glTFMaterial, glTFPbrMetallicRoughness, mimeType, hasTextureCoords);
            });
        }
        else {
            return this._convertSpecGlossFactorsToMetallicRoughnessAsync(babylonPBRMaterial, mimeType, glTFPbrMetallicRoughness, hasTextureCoords).then(function (metallicRoughness) {
                return _this._setMetallicRoughnessPbrMaterial(metallicRoughness, babylonPBRMaterial, glTFMaterial, glTFPbrMetallicRoughness, mimeType, hasTextureCoords);
            });
        }
    };
    _GLTFMaterialExporter.prototype._setMetallicRoughnessPbrMaterial = function (metallicRoughness, babylonPBRMaterial, glTFMaterial, glTFPbrMetallicRoughness, mimeType, hasTextureCoords) {
        var materialMap = this._exporter._materialMap;
        var materials = this._exporter._materials;
        var promises = [];
        if (metallicRoughness) {
            _GLTFMaterialExporter._SetAlphaMode(glTFMaterial, babylonPBRMaterial);
            if (!(_GLTFMaterialExporter._FuzzyEquals(metallicRoughness.baseColor, babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Color3.White(), _GLTFMaterialExporter._Epsilon) &&
                babylonPBRMaterial.alpha >= _GLTFMaterialExporter._Epsilon)) {
                glTFPbrMetallicRoughness.baseColorFactor = [metallicRoughness.baseColor.r, metallicRoughness.baseColor.g, metallicRoughness.baseColor.b, babylonPBRMaterial.alpha];
            }
            if (metallicRoughness.metallic != null && metallicRoughness.metallic !== 1) {
                glTFPbrMetallicRoughness.metallicFactor = metallicRoughness.metallic;
            }
            if (metallicRoughness.roughness != null && metallicRoughness.roughness !== 1) {
                glTFPbrMetallicRoughness.roughnessFactor = metallicRoughness.roughness;
            }
            if (babylonPBRMaterial.backFaceCulling != null && !babylonPBRMaterial.backFaceCulling) {
                if (!babylonPBRMaterial._twoSidedLighting) {
                    babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Tools.Warn(babylonPBRMaterial.name + ": Back-face culling disabled and two-sided lighting disabled is not supported in glTF.");
                }
                glTFMaterial.doubleSided = true;
            }
            if (hasTextureCoords) {
                var bumpTexture_2 = babylonPBRMaterial._bumpTexture;
                if (bumpTexture_2) {
                    var promise = this._exportTextureAsync(bumpTexture_2, mimeType).then(function (glTFTexture) {
                        if (glTFTexture) {
                            glTFMaterial.normalTexture = glTFTexture;
                            if (bumpTexture_2.level !== 1) {
                                glTFMaterial.normalTexture.scale = bumpTexture_2.level;
                            }
                        }
                    });
                    promises.push(promise);
                }
                var ambientTexture = babylonPBRMaterial._ambientTexture;
                if (ambientTexture) {
                    var promise = this._exportTextureAsync(ambientTexture, mimeType).then(function (glTFTexture) {
                        if (glTFTexture) {
                            var occlusionTexture = {
                                index: glTFTexture.index,
                                texCoord: glTFTexture.texCoord,
                                extensions: glTFTexture.extensions,
                            };
                            glTFMaterial.occlusionTexture = occlusionTexture;
                            var ambientTextureStrength = babylonPBRMaterial._ambientTextureStrength;
                            if (ambientTextureStrength) {
                                occlusionTexture.strength = ambientTextureStrength;
                            }
                        }
                    });
                    promises.push(promise);
                }
                var emissiveTexture = babylonPBRMaterial._emissiveTexture;
                if (emissiveTexture) {
                    var promise = this._exportTextureAsync(emissiveTexture, mimeType).then(function (glTFTexture) {
                        if (glTFTexture) {
                            glTFMaterial.emissiveTexture = glTFTexture;
                        }
                    });
                    promises.push(promise);
                }
            }
            var emissiveColor = babylonPBRMaterial._emissiveColor;
            if (!_GLTFMaterialExporter._FuzzyEquals(emissiveColor, babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Color3.Black(), _GLTFMaterialExporter._Epsilon)) {
                glTFMaterial.emissiveFactor = emissiveColor.asArray();
            }
            glTFMaterial.pbrMetallicRoughness = glTFPbrMetallicRoughness;
            materials.push(glTFMaterial);
            materialMap[babylonPBRMaterial.uniqueId] = materials.length - 1;
        }
        return this._finishMaterial(promises, glTFMaterial, babylonPBRMaterial, mimeType);
    };
    _GLTFMaterialExporter.prototype._getPixelsFromTexture = function (babylonTexture) {
        var pixels = babylonTexture.textureType === babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Constants.TEXTURETYPE_UNSIGNED_INT
            ? babylonTexture.readPixels()
            : babylonTexture.readPixels();
        return pixels;
    };
    /**
     * Extracts a texture from a Babylon texture into file data and glTF data
     * @param babylonTexture Babylon texture to extract
     * @param mimeType Mime Type of the babylonTexture
     * @returns glTF texture info, or null if the texture format is not supported
     */
    _GLTFMaterialExporter.prototype._exportTextureAsync = function (babylonTexture, mimeType) {
        var _this = this;
        var extensionPromise = this._exporter._extensionsPreExportTextureAsync("exporter", babylonTexture, mimeType);
        if (!extensionPromise) {
            return this._exportTextureInfoAsync(babylonTexture, mimeType);
        }
        return extensionPromise.then(function (texture) {
            if (!texture) {
                return _this._exportTextureInfoAsync(babylonTexture, mimeType);
            }
            return _this._exportTextureInfoAsync(texture, mimeType);
        });
    };
    _GLTFMaterialExporter.prototype._exportTextureInfoAsync = function (babylonTexture, mimeType) {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__awaiter)(this, void 0, void 0, function () {
            var textureUid, pixels_1, samplerIndex, textureMimeType, internalTextureToImage, internalTextureUniqueId, imageIndexPromise, size_1, textureInfo, _a;
            var _this = this;
            return (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        textureUid = babylonTexture.uid;
                        if (!!(textureUid in this._textureMap)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this._getPixelsFromTexture(babylonTexture)];
                    case 1:
                        pixels_1 = _b.sent();
                        if (!pixels_1) {
                            return [2 /*return*/, null];
                        }
                        samplerIndex = this._exportTextureSampler(babylonTexture);
                        textureMimeType = babylonTexture.mimeType;
                        if (textureMimeType) {
                            switch (textureMimeType) {
                                case "image/jpeg":
                                case "image/png":
                                case "image/webp":
                                    mimeType = textureMimeType;
                                    break;
                                default:
                                    babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Tools.Warn("Unsupported media type: ".concat(textureMimeType));
                                    break;
                            }
                        }
                        internalTextureToImage = this._internalTextureToImage;
                        internalTextureUniqueId = babylonTexture.getInternalTexture().uniqueId;
                        internalTextureToImage[internalTextureUniqueId] || (internalTextureToImage[internalTextureUniqueId] = {});
                        imageIndexPromise = internalTextureToImage[internalTextureUniqueId][mimeType];
                        if (imageIndexPromise === undefined) {
                            size_1 = babylonTexture.getSize();
                            imageIndexPromise = (function () { return (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__awaiter)(_this, void 0, void 0, function () {
                                var data;
                                return (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__generator)(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this._getImageDataAsync(pixels_1, size_1.width, size_1.height, mimeType)];
                                        case 1:
                                            data = _a.sent();
                                            return [2 /*return*/, this._exportImage(babylonTexture.name, mimeType, data)];
                                    }
                                });
                            }); })();
                            internalTextureToImage[internalTextureUniqueId][mimeType] = imageIndexPromise;
                        }
                        _a = this._exportTextureInfo;
                        return [4 /*yield*/, imageIndexPromise];
                    case 2:
                        textureInfo = _a.apply(this, [_b.sent(), samplerIndex, babylonTexture.coordinatesIndex]);
                        this._textureMap[textureUid] = textureInfo;
                        this._exporter._extensionsPostExportTextures("exporter", this._textureMap[textureUid], babylonTexture);
                        _b.label = 3;
                    case 3: return [2 /*return*/, this._textureMap[textureUid]];
                }
            });
        });
    };
    _GLTFMaterialExporter.prototype._exportImage = function (name, mimeType, data) {
        var imageData = this._exporter._imageData;
        var baseName = name.replace(/\.\/|\/|\.\\|\\/g, "_");
        var extension = getFileExtensionFromMimeType(mimeType);
        var fileName = baseName + extension;
        if (fileName in imageData) {
            fileName = "".concat(baseName, "_").concat(babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Tools.RandomId()).concat(extension);
        }
        imageData[fileName] = {
            data: data,
            mimeType: mimeType,
        };
        var images = this._exporter._images;
        images.push({
            name: name,
            uri: fileName,
        });
        return images.length - 1;
    };
    _GLTFMaterialExporter.prototype._exportTextureInfo = function (imageIndex, samplerIndex, coordinatesIndex) {
        var textures = this._exporter._textures;
        var textureIndex = textures.findIndex(function (t) { return t.sampler == samplerIndex && t.source === imageIndex; });
        if (textureIndex === -1) {
            textureIndex = textures.length;
            textures.push({
                source: imageIndex,
                sampler: samplerIndex,
            });
        }
        var textureInfo = { index: textureIndex };
        if (coordinatesIndex) {
            textureInfo.texCoord = coordinatesIndex;
        }
        return textureInfo;
    };
    _GLTFMaterialExporter.prototype._exportTextureSampler = function (texture) {
        var sampler = this._getTextureSampler(texture);
        // if a pre-existing sampler with identical parameters exists, then reuse the previous sampler
        var samplers = this._exporter._samplers;
        var samplerIndex = samplers.findIndex(function (s) { return s.minFilter === sampler.minFilter && s.magFilter === sampler.magFilter && s.wrapS === sampler.wrapS && s.wrapT === sampler.wrapT; });
        if (samplerIndex !== -1) {
            return samplerIndex;
        }
        samplers.push(sampler);
        return samplers.length - 1;
    };
    /**
     * Represents the dielectric specular values for R, G and B
     */
    _GLTFMaterialExporter._DielectricSpecular = new babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Color3(0.04, 0.04, 0.04);
    /**
     * Allows the maximum specular power to be defined for material calculations
     */
    _GLTFMaterialExporter._MaxSpecularPower = 1024;
    /**
     * Numeric tolerance value
     */
    _GLTFMaterialExporter._Epsilon = 1e-6;
    return _GLTFMaterialExporter;
}());


/***/ }),

/***/ "../../../dev/serializers/src/glTF/2.0/glTFSerializer.ts":
/*!***************************************************************!*\
  !*** ../../../dev/serializers/src/glTF/2.0/glTFSerializer.ts ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GLTF2Export: () => (/* binding */ GLTF2Export)
/* harmony export */ });
/* harmony import */ var _glTFExporter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./glTFExporter */ "../../../dev/serializers/src/glTF/2.0/glTFExporter.ts");

/**
 * Class for generating glTF data from a Babylon scene.
 */
var GLTF2Export = /** @class */ (function () {
    function GLTF2Export() {
    }
    /**
     * Exports the geometry of the scene to .gltf file format asynchronously
     * @param scene Babylon scene with scene hierarchy information
     * @param filePrefix File prefix to use when generating the glTF file
     * @param options Exporter options
     * @returns Returns an object with a .gltf file and associates texture names
     * as keys and their data and paths as values
     */
    GLTF2Export.GLTFAsync = function (scene, filePrefix, options) {
        return scene.whenReadyAsync().then(function () {
            var glTFPrefix = filePrefix.replace(/\.[^/.]+$/, "");
            var gltfGenerator = new _glTFExporter__WEBPACK_IMPORTED_MODULE_0__._Exporter(scene, options);
            return gltfGenerator._generateGLTFAsync(glTFPrefix);
        });
    };
    GLTF2Export._PreExportAsync = function (scene, options) {
        return Promise.resolve().then(function () {
            if (options && options.exportWithoutWaitingForScene) {
                return Promise.resolve();
            }
            else {
                return scene.whenReadyAsync();
            }
        });
    };
    GLTF2Export._PostExportAsync = function (scene, glTFData, options) {
        return Promise.resolve().then(function () {
            if (options && options.exportWithoutWaitingForScene) {
                return glTFData;
            }
            else {
                return glTFData;
            }
        });
    };
    /**
     * Exports the geometry of the scene to .glb file format asychronously
     * @param scene Babylon scene with scene hierarchy information
     * @param filePrefix File prefix to use when generating glb file
     * @param options Exporter options
     * @returns Returns an object with a .glb filename as key and data as value
     */
    GLTF2Export.GLBAsync = function (scene, filePrefix, options) {
        var _this = this;
        return this._PreExportAsync(scene, options).then(function () {
            var glTFPrefix = filePrefix.replace(/\.[^/.]+$/, "");
            var gltfGenerator = new _glTFExporter__WEBPACK_IMPORTED_MODULE_0__._Exporter(scene, options);
            return gltfGenerator._generateGLBAsync(glTFPrefix).then(function (glTFData) {
                return _this._PostExportAsync(scene, glTFData, options);
            });
        });
    };
    return GLTF2Export;
}());



/***/ }),

/***/ "../../../dev/serializers/src/glTF/2.0/glTFUtilities.ts":
/*!**************************************************************!*\
  !*** ../../../dev/serializers/src/glTF/2.0/glTFUtilities.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   _GLTFUtilities: () => (/* binding */ _GLTFUtilities)
/* harmony export */ });
/* harmony import */ var babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! babylonjs/Maths/math.vector */ "babylonjs/Maths/math.vector");
/* harmony import */ var babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__);

/**
 * @internal
 */
var _GLTFUtilities = /** @class */ (function () {
    function _GLTFUtilities() {
    }
    /**
     * Creates a buffer view based on the supplied arguments
     * @param bufferIndex index value of the specified buffer
     * @param byteOffset byte offset value
     * @param byteLength byte length of the bufferView
     * @param byteStride byte distance between conequential elements
     * @param name name of the buffer view
     * @returns bufferView for glTF
     */
    _GLTFUtilities._CreateBufferView = function (bufferIndex, byteOffset, byteLength, byteStride, name) {
        var bufferview = { buffer: bufferIndex, byteLength: byteLength };
        if (byteOffset) {
            bufferview.byteOffset = byteOffset;
        }
        if (name) {
            bufferview.name = name;
        }
        if (byteStride) {
            bufferview.byteStride = byteStride;
        }
        return bufferview;
    };
    /**
     * Creates an accessor based on the supplied arguments
     * @param bufferviewIndex The index of the bufferview referenced by this accessor
     * @param name The name of the accessor
     * @param type The type of the accessor
     * @param componentType The datatype of components in the attribute
     * @param count The number of attributes referenced by this accessor
     * @param byteOffset The offset relative to the start of the bufferView in bytes
     * @param min Minimum value of each component in this attribute
     * @param max Maximum value of each component in this attribute
     * @returns accessor for glTF
     */
    _GLTFUtilities._CreateAccessor = function (bufferviewIndex, name, type, componentType, count, byteOffset, min, max) {
        var accessor = { name: name, bufferView: bufferviewIndex, componentType: componentType, count: count, type: type };
        if (min != null) {
            accessor.min = min;
        }
        if (max != null) {
            accessor.max = max;
        }
        if (byteOffset != null) {
            accessor.byteOffset = byteOffset;
        }
        return accessor;
    };
    /**
     * Calculates the minimum and maximum values of an array of position floats
     * @param positions Positions array of a mesh
     * @param vertexStart Starting vertex offset to calculate min and max values
     * @param vertexCount Number of vertices to check for min and max values
     * @returns min number array and max number array
     */
    _GLTFUtilities._CalculateMinMaxPositions = function (positions, vertexStart, vertexCount) {
        var min = [Infinity, Infinity, Infinity];
        var max = [-Infinity, -Infinity, -Infinity];
        var positionStrideSize = 3;
        var indexOffset;
        var position;
        var vector;
        if (vertexCount) {
            for (var i = vertexStart, length_1 = vertexStart + vertexCount; i < length_1; ++i) {
                indexOffset = positionStrideSize * i;
                position = babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Vector3.FromArray(positions, indexOffset);
                vector = position.asArray();
                for (var j = 0; j < positionStrideSize; ++j) {
                    var num = vector[j];
                    if (num < min[j]) {
                        min[j] = num;
                    }
                    if (num > max[j]) {
                        max[j] = num;
                    }
                    ++indexOffset;
                }
            }
        }
        return { min: min, max: max };
    };
    _GLTFUtilities._NormalizeTangentFromRef = function (tangent) {
        var length = Math.sqrt(tangent.x * tangent.x + tangent.y * tangent.y + tangent.z * tangent.z);
        if (length > 0) {
            tangent.x /= length;
            tangent.y /= length;
            tangent.z /= length;
        }
    };
    _GLTFUtilities._GetDataAccessorElementCount = function (accessorType) {
        switch (accessorType) {
            case "MAT2" /* AccessorType.MAT2 */:
                return 4;
            case "MAT3" /* AccessorType.MAT3 */:
                return 9;
            case "MAT4" /* AccessorType.MAT4 */:
                return 16;
            case "SCALAR" /* AccessorType.SCALAR */:
                return 1;
            case "VEC2" /* AccessorType.VEC2 */:
                return 2;
            case "VEC3" /* AccessorType.VEC3 */:
                return 3;
            case "VEC4" /* AccessorType.VEC4 */:
                return 4;
        }
    };
    return _GLTFUtilities;
}());



/***/ }),

/***/ "../../../dev/serializers/src/glTF/2.0/index.ts":
/*!******************************************************!*\
  !*** ../../../dev/serializers/src/glTF/2.0/index.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EXT_mesh_gpu_instancing: () => (/* reexport safe */ _Extensions_index__WEBPACK_IMPORTED_MODULE_7__.EXT_mesh_gpu_instancing),
/* harmony export */   GLTF2Export: () => (/* reexport safe */ _glTFSerializer__WEBPACK_IMPORTED_MODULE_5__.GLTF2Export),
/* harmony export */   GLTFData: () => (/* reexport safe */ _glTFData__WEBPACK_IMPORTED_MODULE_1__.GLTFData),
/* harmony export */   KHR_lights_punctual: () => (/* reexport safe */ _Extensions_index__WEBPACK_IMPORTED_MODULE_7__.KHR_lights_punctual),
/* harmony export */   KHR_materials_anisotropy: () => (/* reexport safe */ _Extensions_index__WEBPACK_IMPORTED_MODULE_7__.KHR_materials_anisotropy),
/* harmony export */   KHR_materials_clearcoat: () => (/* reexport safe */ _Extensions_index__WEBPACK_IMPORTED_MODULE_7__.KHR_materials_clearcoat),
/* harmony export */   KHR_materials_diffuse_transmission: () => (/* reexport safe */ _Extensions_index__WEBPACK_IMPORTED_MODULE_7__.KHR_materials_diffuse_transmission),
/* harmony export */   KHR_materials_dispersion: () => (/* reexport safe */ _Extensions_index__WEBPACK_IMPORTED_MODULE_7__.KHR_materials_dispersion),
/* harmony export */   KHR_materials_emissive_strength: () => (/* reexport safe */ _Extensions_index__WEBPACK_IMPORTED_MODULE_7__.KHR_materials_emissive_strength),
/* harmony export */   KHR_materials_ior: () => (/* reexport safe */ _Extensions_index__WEBPACK_IMPORTED_MODULE_7__.KHR_materials_ior),
/* harmony export */   KHR_materials_iridescence: () => (/* reexport safe */ _Extensions_index__WEBPACK_IMPORTED_MODULE_7__.KHR_materials_iridescence),
/* harmony export */   KHR_materials_sheen: () => (/* reexport safe */ _Extensions_index__WEBPACK_IMPORTED_MODULE_7__.KHR_materials_sheen),
/* harmony export */   KHR_materials_specular: () => (/* reexport safe */ _Extensions_index__WEBPACK_IMPORTED_MODULE_7__.KHR_materials_specular),
/* harmony export */   KHR_materials_transmission: () => (/* reexport safe */ _Extensions_index__WEBPACK_IMPORTED_MODULE_7__.KHR_materials_transmission),
/* harmony export */   KHR_materials_unlit: () => (/* reexport safe */ _Extensions_index__WEBPACK_IMPORTED_MODULE_7__.KHR_materials_unlit),
/* harmony export */   KHR_materials_volume: () => (/* reexport safe */ _Extensions_index__WEBPACK_IMPORTED_MODULE_7__.KHR_materials_volume),
/* harmony export */   KHR_texture_transform: () => (/* reexport safe */ _Extensions_index__WEBPACK_IMPORTED_MODULE_7__.KHR_texture_transform),
/* harmony export */   _BinaryWriter: () => (/* reexport safe */ _glTFExporter__WEBPACK_IMPORTED_MODULE_2__._BinaryWriter),
/* harmony export */   _Exporter: () => (/* reexport safe */ _glTFExporter__WEBPACK_IMPORTED_MODULE_2__._Exporter),
/* harmony export */   _GLTFAnimation: () => (/* reexport safe */ _glTFAnimation__WEBPACK_IMPORTED_MODULE_0__._GLTFAnimation),
/* harmony export */   _GLTFMaterialExporter: () => (/* reexport safe */ _glTFMaterialExporter__WEBPACK_IMPORTED_MODULE_4__._GLTFMaterialExporter),
/* harmony export */   _GLTFUtilities: () => (/* reexport safe */ _glTFUtilities__WEBPACK_IMPORTED_MODULE_6__._GLTFUtilities),
/* harmony export */   __IGLTFExporterExtensionV2: () => (/* reexport safe */ _glTFExporterExtension__WEBPACK_IMPORTED_MODULE_3__.__IGLTFExporterExtensionV2)
/* harmony export */ });
/* harmony import */ var _glTFAnimation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./glTFAnimation */ "../../../dev/serializers/src/glTF/2.0/glTFAnimation.ts");
/* harmony import */ var _glTFData__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./glTFData */ "../../../dev/serializers/src/glTF/2.0/glTFData.ts");
/* harmony import */ var _glTFExporter__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./glTFExporter */ "../../../dev/serializers/src/glTF/2.0/glTFExporter.ts");
/* harmony import */ var _glTFExporterExtension__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./glTFExporterExtension */ "../../../dev/serializers/src/glTF/2.0/glTFExporterExtension.ts");
/* harmony import */ var _glTFMaterialExporter__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./glTFMaterialExporter */ "../../../dev/serializers/src/glTF/2.0/glTFMaterialExporter.ts");
/* harmony import */ var _glTFSerializer__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./glTFSerializer */ "../../../dev/serializers/src/glTF/2.0/glTFSerializer.ts");
/* harmony import */ var _glTFUtilities__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./glTFUtilities */ "../../../dev/serializers/src/glTF/2.0/glTFUtilities.ts");
/* harmony import */ var _Extensions_index__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./Extensions/index */ "../../../dev/serializers/src/glTF/2.0/Extensions/index.ts");
/* eslint-disable import/no-internal-modules */










/***/ }),

/***/ "../../../dev/serializers/src/glTF/glTFFileExporter.ts":
/*!*************************************************************!*\
  !*** ../../../dev/serializers/src/glTF/glTFFileExporter.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __IGLTFExporterExtension: () => (/* binding */ __IGLTFExporterExtension)
/* harmony export */ });
/** @internal */
// eslint-disable-next-line no-var, @typescript-eslint/naming-convention
var __IGLTFExporterExtension = 0; // I am here to allow dts to be created


/***/ }),

/***/ "../../../dev/serializers/src/glTF/index.ts":
/*!**************************************************!*\
  !*** ../../../dev/serializers/src/glTF/index.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EXT_mesh_gpu_instancing: () => (/* reexport safe */ _2_0_index__WEBPACK_IMPORTED_MODULE_1__.EXT_mesh_gpu_instancing),
/* harmony export */   GLTF2Export: () => (/* reexport safe */ _2_0_index__WEBPACK_IMPORTED_MODULE_1__.GLTF2Export),
/* harmony export */   GLTFData: () => (/* reexport safe */ _2_0_index__WEBPACK_IMPORTED_MODULE_1__.GLTFData),
/* harmony export */   KHR_lights_punctual: () => (/* reexport safe */ _2_0_index__WEBPACK_IMPORTED_MODULE_1__.KHR_lights_punctual),
/* harmony export */   KHR_materials_anisotropy: () => (/* reexport safe */ _2_0_index__WEBPACK_IMPORTED_MODULE_1__.KHR_materials_anisotropy),
/* harmony export */   KHR_materials_clearcoat: () => (/* reexport safe */ _2_0_index__WEBPACK_IMPORTED_MODULE_1__.KHR_materials_clearcoat),
/* harmony export */   KHR_materials_diffuse_transmission: () => (/* reexport safe */ _2_0_index__WEBPACK_IMPORTED_MODULE_1__.KHR_materials_diffuse_transmission),
/* harmony export */   KHR_materials_dispersion: () => (/* reexport safe */ _2_0_index__WEBPACK_IMPORTED_MODULE_1__.KHR_materials_dispersion),
/* harmony export */   KHR_materials_emissive_strength: () => (/* reexport safe */ _2_0_index__WEBPACK_IMPORTED_MODULE_1__.KHR_materials_emissive_strength),
/* harmony export */   KHR_materials_ior: () => (/* reexport safe */ _2_0_index__WEBPACK_IMPORTED_MODULE_1__.KHR_materials_ior),
/* harmony export */   KHR_materials_iridescence: () => (/* reexport safe */ _2_0_index__WEBPACK_IMPORTED_MODULE_1__.KHR_materials_iridescence),
/* harmony export */   KHR_materials_sheen: () => (/* reexport safe */ _2_0_index__WEBPACK_IMPORTED_MODULE_1__.KHR_materials_sheen),
/* harmony export */   KHR_materials_specular: () => (/* reexport safe */ _2_0_index__WEBPACK_IMPORTED_MODULE_1__.KHR_materials_specular),
/* harmony export */   KHR_materials_transmission: () => (/* reexport safe */ _2_0_index__WEBPACK_IMPORTED_MODULE_1__.KHR_materials_transmission),
/* harmony export */   KHR_materials_unlit: () => (/* reexport safe */ _2_0_index__WEBPACK_IMPORTED_MODULE_1__.KHR_materials_unlit),
/* harmony export */   KHR_materials_volume: () => (/* reexport safe */ _2_0_index__WEBPACK_IMPORTED_MODULE_1__.KHR_materials_volume),
/* harmony export */   KHR_texture_transform: () => (/* reexport safe */ _2_0_index__WEBPACK_IMPORTED_MODULE_1__.KHR_texture_transform),
/* harmony export */   _BinaryWriter: () => (/* reexport safe */ _2_0_index__WEBPACK_IMPORTED_MODULE_1__._BinaryWriter),
/* harmony export */   _Exporter: () => (/* reexport safe */ _2_0_index__WEBPACK_IMPORTED_MODULE_1__._Exporter),
/* harmony export */   _GLTFAnimation: () => (/* reexport safe */ _2_0_index__WEBPACK_IMPORTED_MODULE_1__._GLTFAnimation),
/* harmony export */   _GLTFMaterialExporter: () => (/* reexport safe */ _2_0_index__WEBPACK_IMPORTED_MODULE_1__._GLTFMaterialExporter),
/* harmony export */   _GLTFUtilities: () => (/* reexport safe */ _2_0_index__WEBPACK_IMPORTED_MODULE_1__._GLTFUtilities),
/* harmony export */   __IGLTFExporterExtension: () => (/* reexport safe */ _glTFFileExporter__WEBPACK_IMPORTED_MODULE_0__.__IGLTFExporterExtension),
/* harmony export */   __IGLTFExporterExtensionV2: () => (/* reexport safe */ _2_0_index__WEBPACK_IMPORTED_MODULE_1__.__IGLTFExporterExtensionV2)
/* harmony export */ });
/* harmony import */ var _glTFFileExporter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./glTFFileExporter */ "../../../dev/serializers/src/glTF/glTFFileExporter.ts");
/* harmony import */ var _2_0_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./2.0/index */ "../../../dev/serializers/src/glTF/2.0/index.ts");
/* eslint-disable import/no-internal-modules */




/***/ }),

/***/ "../../../dev/serializers/src/index.ts":
/*!*********************************************!*\
  !*** ../../../dev/serializers/src/index.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EXT_mesh_gpu_instancing: () => (/* reexport safe */ _glTF_index__WEBPACK_IMPORTED_MODULE_1__.EXT_mesh_gpu_instancing),
/* harmony export */   GLTF2Export: () => (/* reexport safe */ _glTF_index__WEBPACK_IMPORTED_MODULE_1__.GLTF2Export),
/* harmony export */   GLTFData: () => (/* reexport safe */ _glTF_index__WEBPACK_IMPORTED_MODULE_1__.GLTFData),
/* harmony export */   KHR_lights_punctual: () => (/* reexport safe */ _glTF_index__WEBPACK_IMPORTED_MODULE_1__.KHR_lights_punctual),
/* harmony export */   KHR_materials_anisotropy: () => (/* reexport safe */ _glTF_index__WEBPACK_IMPORTED_MODULE_1__.KHR_materials_anisotropy),
/* harmony export */   KHR_materials_clearcoat: () => (/* reexport safe */ _glTF_index__WEBPACK_IMPORTED_MODULE_1__.KHR_materials_clearcoat),
/* harmony export */   KHR_materials_diffuse_transmission: () => (/* reexport safe */ _glTF_index__WEBPACK_IMPORTED_MODULE_1__.KHR_materials_diffuse_transmission),
/* harmony export */   KHR_materials_dispersion: () => (/* reexport safe */ _glTF_index__WEBPACK_IMPORTED_MODULE_1__.KHR_materials_dispersion),
/* harmony export */   KHR_materials_emissive_strength: () => (/* reexport safe */ _glTF_index__WEBPACK_IMPORTED_MODULE_1__.KHR_materials_emissive_strength),
/* harmony export */   KHR_materials_ior: () => (/* reexport safe */ _glTF_index__WEBPACK_IMPORTED_MODULE_1__.KHR_materials_ior),
/* harmony export */   KHR_materials_iridescence: () => (/* reexport safe */ _glTF_index__WEBPACK_IMPORTED_MODULE_1__.KHR_materials_iridescence),
/* harmony export */   KHR_materials_sheen: () => (/* reexport safe */ _glTF_index__WEBPACK_IMPORTED_MODULE_1__.KHR_materials_sheen),
/* harmony export */   KHR_materials_specular: () => (/* reexport safe */ _glTF_index__WEBPACK_IMPORTED_MODULE_1__.KHR_materials_specular),
/* harmony export */   KHR_materials_transmission: () => (/* reexport safe */ _glTF_index__WEBPACK_IMPORTED_MODULE_1__.KHR_materials_transmission),
/* harmony export */   KHR_materials_unlit: () => (/* reexport safe */ _glTF_index__WEBPACK_IMPORTED_MODULE_1__.KHR_materials_unlit),
/* harmony export */   KHR_materials_volume: () => (/* reexport safe */ _glTF_index__WEBPACK_IMPORTED_MODULE_1__.KHR_materials_volume),
/* harmony export */   KHR_texture_transform: () => (/* reexport safe */ _glTF_index__WEBPACK_IMPORTED_MODULE_1__.KHR_texture_transform),
/* harmony export */   OBJExport: () => (/* reexport safe */ _OBJ_index__WEBPACK_IMPORTED_MODULE_0__.OBJExport),
/* harmony export */   STLExport: () => (/* reexport safe */ _stl_index__WEBPACK_IMPORTED_MODULE_2__.STLExport),
/* harmony export */   _BinaryWriter: () => (/* reexport safe */ _glTF_index__WEBPACK_IMPORTED_MODULE_1__._BinaryWriter),
/* harmony export */   _Exporter: () => (/* reexport safe */ _glTF_index__WEBPACK_IMPORTED_MODULE_1__._Exporter),
/* harmony export */   _GLTFAnimation: () => (/* reexport safe */ _glTF_index__WEBPACK_IMPORTED_MODULE_1__._GLTFAnimation),
/* harmony export */   _GLTFMaterialExporter: () => (/* reexport safe */ _glTF_index__WEBPACK_IMPORTED_MODULE_1__._GLTFMaterialExporter),
/* harmony export */   _GLTFUtilities: () => (/* reexport safe */ _glTF_index__WEBPACK_IMPORTED_MODULE_1__._GLTFUtilities),
/* harmony export */   __IGLTFExporterExtension: () => (/* reexport safe */ _glTF_index__WEBPACK_IMPORTED_MODULE_1__.__IGLTFExporterExtension),
/* harmony export */   __IGLTFExporterExtensionV2: () => (/* reexport safe */ _glTF_index__WEBPACK_IMPORTED_MODULE_1__.__IGLTFExporterExtensionV2)
/* harmony export */ });
/* harmony import */ var _OBJ_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./OBJ/index */ "../../../dev/serializers/src/OBJ/index.ts");
/* harmony import */ var _glTF_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./glTF/index */ "../../../dev/serializers/src/glTF/index.ts");
/* harmony import */ var _stl_index__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./stl/index */ "../../../dev/serializers/src/stl/index.ts");
/* eslint-disable import/no-internal-modules */





/***/ }),

/***/ "../../../dev/serializers/src/stl/index.ts":
/*!*************************************************!*\
  !*** ../../../dev/serializers/src/stl/index.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   STLExport: () => (/* reexport safe */ _stlSerializer__WEBPACK_IMPORTED_MODULE_0__.STLExport)
/* harmony export */ });
/* harmony import */ var _stlSerializer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./stlSerializer */ "../../../dev/serializers/src/stl/stlSerializer.ts");



/***/ }),

/***/ "../../../dev/serializers/src/stl/stlSerializer.ts":
/*!*********************************************************!*\
  !*** ../../../dev/serializers/src/stl/stlSerializer.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   STLExport: () => (/* binding */ STLExport)
/* harmony export */ });
/* harmony import */ var babylonjs_Meshes_mesh__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! babylonjs/Maths/math.vector */ "babylonjs/Maths/math.vector");
/* harmony import */ var babylonjs_Meshes_mesh__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(babylonjs_Meshes_mesh__WEBPACK_IMPORTED_MODULE_0__);




/**
 * Class for generating STL data from a Babylon scene.
 */
var STLExport = /** @class */ (function () {
    function STLExport() {
    }
    /**
     * Exports the geometry of a Mesh array in .STL file format (ASCII)
     * @param meshes list defines the mesh to serialize
     * @param download triggers the automatic download of the file.
     * @param fileName changes the downloads fileName.
     * @param binary changes the STL to a binary type.
     * @param isLittleEndian toggle for binary type exporter.
     * @param doNotBakeTransform toggle if meshes transforms should be baked or not.
     * @param supportInstancedMeshes toggle to export instanced Meshes. Enabling support for instanced meshes will override doNoBakeTransform as true
     * @param exportIndividualMeshes toggle to export each mesh as an independent mesh. By default, all the meshes are combined into one mesh. This property has no effect when exporting in binary format
     * @returns the STL as UTF8 string
     */
    STLExport.CreateSTL = function (meshes, download, fileName, binary, isLittleEndian, doNotBakeTransform, supportInstancedMeshes, exportIndividualMeshes) {
        //Binary support adapted from https://gist.github.com/paulkaplan/6d5f0ab2c7e8fdc68a61
        if (download === void 0) { download = true; }
        if (fileName === void 0) { fileName = "stlmesh"; }
        if (binary === void 0) { binary = false; }
        if (isLittleEndian === void 0) { isLittleEndian = true; }
        if (doNotBakeTransform === void 0) { doNotBakeTransform = false; }
        if (supportInstancedMeshes === void 0) { supportInstancedMeshes = false; }
        if (exportIndividualMeshes === void 0) { exportIndividualMeshes = false; }
        var getFaceData = function (indices, vertices, i) {
            var id = [indices[i] * 3, indices[i + 1] * 3, indices[i + 2] * 3];
            var v = [
                new babylonjs_Meshes_mesh__WEBPACK_IMPORTED_MODULE_0__.Vector3(vertices[id[0]], vertices[id[0] + 2], vertices[id[0] + 1]),
                new babylonjs_Meshes_mesh__WEBPACK_IMPORTED_MODULE_0__.Vector3(vertices[id[1]], vertices[id[1] + 2], vertices[id[1] + 1]),
                new babylonjs_Meshes_mesh__WEBPACK_IMPORTED_MODULE_0__.Vector3(vertices[id[2]], vertices[id[2] + 2], vertices[id[2] + 1]),
            ];
            var p1p2 = v[0].subtract(v[1]);
            var p3p2 = v[2].subtract(v[1]);
            var n = babylonjs_Meshes_mesh__WEBPACK_IMPORTED_MODULE_0__.Vector3.Cross(p3p2, p1p2).normalize();
            return { v: v, n: n };
        };
        var writeVector = function (dataview, offset, vector, isLittleEndian) {
            offset = writeFloat(dataview, offset, vector.x, isLittleEndian);
            offset = writeFloat(dataview, offset, vector.y, isLittleEndian);
            return writeFloat(dataview, offset, vector.z, isLittleEndian);
        };
        var writeFloat = function (dataview, offset, value, isLittleEndian) {
            dataview.setFloat32(offset, value, isLittleEndian);
            return offset + 4;
        };
        var getVerticesData = function (mesh) {
            if (supportInstancedMeshes) {
                var sourceMesh = mesh;
                if (mesh instanceof babylonjs_Meshes_mesh__WEBPACK_IMPORTED_MODULE_0__.InstancedMesh) {
                    sourceMesh = mesh.sourceMesh;
                }
                var data_1 = sourceMesh.getVerticesData(babylonjs_Meshes_mesh__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.PositionKind, true, true);
                if (!data_1)
                    return [];
                var temp = babylonjs_Meshes_mesh__WEBPACK_IMPORTED_MODULE_0__.Vector3.Zero();
                var index = void 0;
                for (index = 0; index < data_1.length; index += 3) {
                    babylonjs_Meshes_mesh__WEBPACK_IMPORTED_MODULE_0__.Vector3.TransformCoordinatesFromFloatsToRef(data_1[index], data_1[index + 1], data_1[index + 2], mesh.computeWorldMatrix(true), temp).toArray(data_1, index);
                }
                return data_1;
            }
            else {
                return mesh.getVerticesData(babylonjs_Meshes_mesh__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.PositionKind) || [];
            }
        };
        if (supportInstancedMeshes) {
            doNotBakeTransform = true;
        }
        var data = "";
        var faceCount = 0;
        var offset = 0;
        if (binary) {
            for (var i = 0; i < meshes.length; i++) {
                var mesh = meshes[i];
                var indices = mesh.getIndices();
                faceCount += indices ? indices.length / 3 : 0;
            }
            var bufferSize = 84 + 50 * faceCount;
            var buffer = new ArrayBuffer(bufferSize);
            data = new DataView(buffer);
            offset += 80;
            data.setUint32(offset, faceCount, isLittleEndian);
            offset += 4;
        }
        else {
            if (!exportIndividualMeshes) {
                data = "solid stlmesh\r\n";
            }
        }
        for (var i = 0; i < meshes.length; i++) {
            var mesh = meshes[i];
            if (!binary && exportIndividualMeshes) {
                data += "solid " + mesh.name + "\r\n";
            }
            if (!doNotBakeTransform && mesh instanceof babylonjs_Meshes_mesh__WEBPACK_IMPORTED_MODULE_0__.Mesh) {
                mesh.bakeCurrentTransformIntoVertices();
            }
            var vertices = getVerticesData(mesh);
            var indices = mesh.getIndices() || [];
            for (var i_1 = 0; i_1 < indices.length; i_1 += 3) {
                var fd = getFaceData(indices, vertices, i_1);
                if (binary) {
                    offset = writeVector(data, offset, fd.n, isLittleEndian);
                    offset = writeVector(data, offset, fd.v[0], isLittleEndian);
                    offset = writeVector(data, offset, fd.v[1], isLittleEndian);
                    offset = writeVector(data, offset, fd.v[2], isLittleEndian);
                    offset += 2;
                }
                else {
                    data += "\tfacet normal " + fd.n.x + " " + fd.n.y + " " + fd.n.z + "\r\n";
                    data += "\t\touter loop\r\n";
                    data += "\t\t\tvertex " + fd.v[0].x + " " + fd.v[0].y + " " + fd.v[0].z + "\r\n";
                    data += "\t\t\tvertex " + fd.v[1].x + " " + fd.v[1].y + " " + fd.v[1].z + "\r\n";
                    data += "\t\t\tvertex " + fd.v[2].x + " " + fd.v[2].y + " " + fd.v[2].z + "\r\n";
                    data += "\t\tendloop\r\n";
                    data += "\tendfacet\r\n";
                }
            }
            if (!binary && exportIndividualMeshes) {
                data += "endsolid " + name + "\r\n";
            }
        }
        if (!binary && !exportIndividualMeshes) {
            data += "endsolid stlmesh";
        }
        if (download) {
            var a = document.createElement("a");
            var blob = new Blob([data], { type: "application/octet-stream" });
            a.href = window.URL.createObjectURL(blob);
            a.download = fileName + ".stl";
            a.click();
        }
        return data;
    };
    return STLExport;
}());



/***/ }),

/***/ "../../../lts/serializers/src/legacy/legacy-glTF2Serializer.ts":
/*!*********************************************************************!*\
  !*** ../../../lts/serializers/src/legacy/legacy-glTF2Serializer.ts ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EXT_mesh_gpu_instancing: () => (/* reexport safe */ serializers_glTF_2_0_index__WEBPACK_IMPORTED_MODULE_4__.EXT_mesh_gpu_instancing),
/* harmony export */   GLTF2Export: () => (/* reexport safe */ serializers_glTF_2_0_index__WEBPACK_IMPORTED_MODULE_4__.GLTF2Export),
/* harmony export */   GLTFData: () => (/* reexport safe */ serializers_glTF_2_0_index__WEBPACK_IMPORTED_MODULE_4__.GLTFData),
/* harmony export */   KHR_lights_punctual: () => (/* reexport safe */ serializers_glTF_2_0_index__WEBPACK_IMPORTED_MODULE_4__.KHR_lights_punctual),
/* harmony export */   KHR_materials_anisotropy: () => (/* reexport safe */ serializers_glTF_2_0_index__WEBPACK_IMPORTED_MODULE_4__.KHR_materials_anisotropy),
/* harmony export */   KHR_materials_clearcoat: () => (/* reexport safe */ serializers_glTF_2_0_index__WEBPACK_IMPORTED_MODULE_4__.KHR_materials_clearcoat),
/* harmony export */   KHR_materials_diffuse_transmission: () => (/* reexport safe */ serializers_glTF_2_0_index__WEBPACK_IMPORTED_MODULE_4__.KHR_materials_diffuse_transmission),
/* harmony export */   KHR_materials_dispersion: () => (/* reexport safe */ serializers_glTF_2_0_index__WEBPACK_IMPORTED_MODULE_4__.KHR_materials_dispersion),
/* harmony export */   KHR_materials_emissive_strength: () => (/* reexport safe */ serializers_glTF_2_0_index__WEBPACK_IMPORTED_MODULE_4__.KHR_materials_emissive_strength),
/* harmony export */   KHR_materials_ior: () => (/* reexport safe */ serializers_glTF_2_0_index__WEBPACK_IMPORTED_MODULE_4__.KHR_materials_ior),
/* harmony export */   KHR_materials_iridescence: () => (/* reexport safe */ serializers_glTF_2_0_index__WEBPACK_IMPORTED_MODULE_4__.KHR_materials_iridescence),
/* harmony export */   KHR_materials_sheen: () => (/* reexport safe */ serializers_glTF_2_0_index__WEBPACK_IMPORTED_MODULE_4__.KHR_materials_sheen),
/* harmony export */   KHR_materials_specular: () => (/* reexport safe */ serializers_glTF_2_0_index__WEBPACK_IMPORTED_MODULE_4__.KHR_materials_specular),
/* harmony export */   KHR_materials_transmission: () => (/* reexport safe */ serializers_glTF_2_0_index__WEBPACK_IMPORTED_MODULE_4__.KHR_materials_transmission),
/* harmony export */   KHR_materials_unlit: () => (/* reexport safe */ serializers_glTF_2_0_index__WEBPACK_IMPORTED_MODULE_4__.KHR_materials_unlit),
/* harmony export */   KHR_materials_volume: () => (/* reexport safe */ serializers_glTF_2_0_index__WEBPACK_IMPORTED_MODULE_4__.KHR_materials_volume),
/* harmony export */   KHR_texture_transform: () => (/* reexport safe */ serializers_glTF_2_0_index__WEBPACK_IMPORTED_MODULE_4__.KHR_texture_transform),
/* harmony export */   _BinaryWriter: () => (/* reexport safe */ serializers_glTF_2_0_index__WEBPACK_IMPORTED_MODULE_4__._BinaryWriter),
/* harmony export */   _Exporter: () => (/* reexport safe */ serializers_glTF_2_0_index__WEBPACK_IMPORTED_MODULE_4__._Exporter),
/* harmony export */   _GLTFAnimation: () => (/* reexport safe */ serializers_glTF_2_0_index__WEBPACK_IMPORTED_MODULE_4__._GLTFAnimation),
/* harmony export */   _GLTFMaterialExporter: () => (/* reexport safe */ serializers_glTF_2_0_index__WEBPACK_IMPORTED_MODULE_4__._GLTFMaterialExporter),
/* harmony export */   _GLTFUtilities: () => (/* reexport safe */ serializers_glTF_2_0_index__WEBPACK_IMPORTED_MODULE_4__._GLTFUtilities),
/* harmony export */   __IGLTFExporterExtension: () => (/* reexport safe */ serializers_glTF_glTFFileExporter__WEBPACK_IMPORTED_MODULE_0__.__IGLTFExporterExtension),
/* harmony export */   __IGLTFExporterExtensionV2: () => (/* reexport safe */ serializers_glTF_2_0_index__WEBPACK_IMPORTED_MODULE_4__.__IGLTFExporterExtensionV2)
/* harmony export */ });
/* harmony import */ var serializers_glTF_glTFFileExporter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! serializers/glTF/glTFFileExporter */ "../../../dev/serializers/src/glTF/glTFFileExporter.ts");
/* harmony import */ var serializers_glTF_2_0_glTFData__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! serializers/glTF/2.0/glTFData */ "../../../dev/serializers/src/glTF/2.0/glTFData.ts");
/* harmony import */ var serializers_glTF_2_0_glTFSerializer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! serializers/glTF/2.0/glTFSerializer */ "../../../dev/serializers/src/glTF/2.0/glTFSerializer.ts");
/* harmony import */ var serializers_glTF_2_0_Extensions_index__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! serializers/glTF/2.0/Extensions/index */ "../../../dev/serializers/src/glTF/2.0/Extensions/index.ts");
/* harmony import */ var serializers_glTF_2_0_index__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! serializers/glTF/2.0/index */ "../../../dev/serializers/src/glTF/2.0/index.ts");
/* eslint-disable import/no-internal-modules */





/**
 * This is the entry point for the UMD module.
 * The entry point for a future ESM package should be index.ts
 */
var globalObject = typeof __webpack_require__.g !== "undefined" ? __webpack_require__.g : typeof window !== "undefined" ? window : undefined;
if (typeof globalObject !== "undefined") {
    globalObject.BABYLON = globalObject.BABYLON || {};
    var BABYLON_1 = globalObject.BABYLON;
    BABYLON_1.GLTF2 = BABYLON_1.GLTF2 || {};
    BABYLON_1.GLTF2.Exporter = BABYLON_1.GLTF2.Exporter || {};
    BABYLON_1.GLTF2.Exporter.Extensions = BABYLON_1.GLTF2.Exporter.Extensions || {};
    var keys = [];
    for (var key in serializers_glTF_glTFFileExporter__WEBPACK_IMPORTED_MODULE_0__) {
        BABYLON_1[key] = serializers_glTF_glTFFileExporter__WEBPACK_IMPORTED_MODULE_0__[key];
        keys.push(key);
    }
    for (var key in serializers_glTF_2_0_glTFData__WEBPACK_IMPORTED_MODULE_1__) {
        BABYLON_1[key] = serializers_glTF_2_0_glTFData__WEBPACK_IMPORTED_MODULE_1__[key];
        keys.push(key);
    }
    for (var key in serializers_glTF_2_0_glTFSerializer__WEBPACK_IMPORTED_MODULE_2__) {
        BABYLON_1[key] = serializers_glTF_2_0_glTFSerializer__WEBPACK_IMPORTED_MODULE_2__[key];
        keys.push(key);
    }
    for (var key in serializers_glTF_2_0_Extensions_index__WEBPACK_IMPORTED_MODULE_3__) {
        BABYLON_1.GLTF2.Exporter.Extensions[key] = serializers_glTF_2_0_Extensions_index__WEBPACK_IMPORTED_MODULE_3__[key];
        keys.push(key);
    }
    for (var key in serializers_glTF_2_0_index__WEBPACK_IMPORTED_MODULE_4__) {
        // Prevent Reassignment.
        if (keys.indexOf(key) > -1) {
            continue;
        }
        BABYLON_1.GLTF2.Exporter[key] = serializers_glTF_2_0_index__WEBPACK_IMPORTED_MODULE_4__[key];
    }
}




/***/ }),

/***/ "../../../lts/serializers/src/legacy/legacy-objSerializer.ts":
/*!*******************************************************************!*\
  !*** ../../../lts/serializers/src/legacy/legacy-objSerializer.ts ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OBJExport: () => (/* reexport safe */ serializers_OBJ_index__WEBPACK_IMPORTED_MODULE_0__.OBJExport)
/* harmony export */ });
/* harmony import */ var serializers_OBJ_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! serializers/OBJ/index */ "../../../dev/serializers/src/OBJ/index.ts");
/* eslint-disable import/no-internal-modules */

/**
 * This is the entry point for the UMD module.
 * The entry point for a future ESM package should be index.ts
 */
var globalObject = typeof __webpack_require__.g !== "undefined" ? __webpack_require__.g : typeof window !== "undefined" ? window : undefined;
if (typeof globalObject !== "undefined") {
    for (var serializer in serializers_OBJ_index__WEBPACK_IMPORTED_MODULE_0__) {
        globalObject.BABYLON[serializer] = serializers_OBJ_index__WEBPACK_IMPORTED_MODULE_0__[serializer];
    }
}



/***/ }),

/***/ "../../../lts/serializers/src/legacy/legacy-stlSerializer.ts":
/*!*******************************************************************!*\
  !*** ../../../lts/serializers/src/legacy/legacy-stlSerializer.ts ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   STLExport: () => (/* reexport safe */ serializers_stl_index__WEBPACK_IMPORTED_MODULE_0__.STLExport)
/* harmony export */ });
/* harmony import */ var serializers_stl_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! serializers/stl/index */ "../../../dev/serializers/src/stl/index.ts");
/* eslint-disable import/no-internal-modules */

/**
 * This is the entry point for the UMD module.
 * The entry point for a future ESM package should be index.ts
 */
var globalObject = typeof __webpack_require__.g !== "undefined" ? __webpack_require__.g : typeof window !== "undefined" ? window : undefined;
if (typeof globalObject !== "undefined") {
    for (var serializer in serializers_stl_index__WEBPACK_IMPORTED_MODULE_0__) {
        globalObject.BABYLON[serializer] = serializers_stl_index__WEBPACK_IMPORTED_MODULE_0__[serializer];
    }
}



/***/ }),

/***/ "../../../lts/serializers/src/legacy/legacy.ts":
/*!*****************************************************!*\
  !*** ../../../lts/serializers/src/legacy/legacy.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EXT_mesh_gpu_instancing: () => (/* reexport safe */ _legacy_glTF2Serializer__WEBPACK_IMPORTED_MODULE_1__.EXT_mesh_gpu_instancing),
/* harmony export */   GLTF2Export: () => (/* reexport safe */ _legacy_glTF2Serializer__WEBPACK_IMPORTED_MODULE_1__.GLTF2Export),
/* harmony export */   GLTFData: () => (/* reexport safe */ _legacy_glTF2Serializer__WEBPACK_IMPORTED_MODULE_1__.GLTFData),
/* harmony export */   KHR_lights_punctual: () => (/* reexport safe */ _legacy_glTF2Serializer__WEBPACK_IMPORTED_MODULE_1__.KHR_lights_punctual),
/* harmony export */   KHR_materials_anisotropy: () => (/* reexport safe */ _legacy_glTF2Serializer__WEBPACK_IMPORTED_MODULE_1__.KHR_materials_anisotropy),
/* harmony export */   KHR_materials_clearcoat: () => (/* reexport safe */ _legacy_glTF2Serializer__WEBPACK_IMPORTED_MODULE_1__.KHR_materials_clearcoat),
/* harmony export */   KHR_materials_diffuse_transmission: () => (/* reexport safe */ _legacy_glTF2Serializer__WEBPACK_IMPORTED_MODULE_1__.KHR_materials_diffuse_transmission),
/* harmony export */   KHR_materials_dispersion: () => (/* reexport safe */ _legacy_glTF2Serializer__WEBPACK_IMPORTED_MODULE_1__.KHR_materials_dispersion),
/* harmony export */   KHR_materials_emissive_strength: () => (/* reexport safe */ _legacy_glTF2Serializer__WEBPACK_IMPORTED_MODULE_1__.KHR_materials_emissive_strength),
/* harmony export */   KHR_materials_ior: () => (/* reexport safe */ _legacy_glTF2Serializer__WEBPACK_IMPORTED_MODULE_1__.KHR_materials_ior),
/* harmony export */   KHR_materials_iridescence: () => (/* reexport safe */ _legacy_glTF2Serializer__WEBPACK_IMPORTED_MODULE_1__.KHR_materials_iridescence),
/* harmony export */   KHR_materials_sheen: () => (/* reexport safe */ _legacy_glTF2Serializer__WEBPACK_IMPORTED_MODULE_1__.KHR_materials_sheen),
/* harmony export */   KHR_materials_specular: () => (/* reexport safe */ _legacy_glTF2Serializer__WEBPACK_IMPORTED_MODULE_1__.KHR_materials_specular),
/* harmony export */   KHR_materials_transmission: () => (/* reexport safe */ _legacy_glTF2Serializer__WEBPACK_IMPORTED_MODULE_1__.KHR_materials_transmission),
/* harmony export */   KHR_materials_unlit: () => (/* reexport safe */ _legacy_glTF2Serializer__WEBPACK_IMPORTED_MODULE_1__.KHR_materials_unlit),
/* harmony export */   KHR_materials_volume: () => (/* reexport safe */ _legacy_glTF2Serializer__WEBPACK_IMPORTED_MODULE_1__.KHR_materials_volume),
/* harmony export */   KHR_texture_transform: () => (/* reexport safe */ _legacy_glTF2Serializer__WEBPACK_IMPORTED_MODULE_1__.KHR_texture_transform),
/* harmony export */   OBJExport: () => (/* reexport safe */ _legacy_objSerializer__WEBPACK_IMPORTED_MODULE_2__.OBJExport),
/* harmony export */   STLExport: () => (/* reexport safe */ _legacy_stlSerializer__WEBPACK_IMPORTED_MODULE_3__.STLExport),
/* harmony export */   _BinaryWriter: () => (/* reexport safe */ _legacy_glTF2Serializer__WEBPACK_IMPORTED_MODULE_1__._BinaryWriter),
/* harmony export */   _Exporter: () => (/* reexport safe */ _legacy_glTF2Serializer__WEBPACK_IMPORTED_MODULE_1__._Exporter),
/* harmony export */   _GLTFAnimation: () => (/* reexport safe */ _legacy_glTF2Serializer__WEBPACK_IMPORTED_MODULE_1__._GLTFAnimation),
/* harmony export */   _GLTFMaterialExporter: () => (/* reexport safe */ _legacy_glTF2Serializer__WEBPACK_IMPORTED_MODULE_1__._GLTFMaterialExporter),
/* harmony export */   _GLTFUtilities: () => (/* reexport safe */ _legacy_glTF2Serializer__WEBPACK_IMPORTED_MODULE_1__._GLTFUtilities),
/* harmony export */   __IGLTFExporterExtension: () => (/* reexport safe */ _legacy_glTF2Serializer__WEBPACK_IMPORTED_MODULE_1__.__IGLTFExporterExtension),
/* harmony export */   __IGLTFExporterExtensionV2: () => (/* reexport safe */ _legacy_glTF2Serializer__WEBPACK_IMPORTED_MODULE_1__.__IGLTFExporterExtensionV2)
/* harmony export */ });
/* harmony import */ var serializers_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! serializers/index */ "../../../dev/serializers/src/index.ts");
/* harmony import */ var _legacy_glTF2Serializer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./legacy-glTF2Serializer */ "../../../lts/serializers/src/legacy/legacy-glTF2Serializer.ts");
/* harmony import */ var _legacy_objSerializer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./legacy-objSerializer */ "../../../lts/serializers/src/legacy/legacy-objSerializer.ts");
/* harmony import */ var _legacy_stlSerializer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./legacy-stlSerializer */ "../../../lts/serializers/src/legacy/legacy-stlSerializer.ts");
/* eslint-disable import/export */
/* eslint-disable import/no-internal-modules */






/***/ }),

/***/ "babylonjs/Maths/math.vector":
/*!****************************************************************************************************!*\
  !*** external {"root":"BABYLON","commonjs":"babylonjs","commonjs2":"babylonjs","amd":"babylonjs"} ***!
  \****************************************************************************************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE_babylonjs_Maths_math_vector__;

/***/ }),

/***/ "../../../../node_modules/tslib/tslib.es6.mjs":
/*!****************************************************!*\
  !*** ../../../../node_modules/tslib/tslib.es6.mjs ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __addDisposableResource: () => (/* binding */ __addDisposableResource),
/* harmony export */   __assign: () => (/* binding */ __assign),
/* harmony export */   __asyncDelegator: () => (/* binding */ __asyncDelegator),
/* harmony export */   __asyncGenerator: () => (/* binding */ __asyncGenerator),
/* harmony export */   __asyncValues: () => (/* binding */ __asyncValues),
/* harmony export */   __await: () => (/* binding */ __await),
/* harmony export */   __awaiter: () => (/* binding */ __awaiter),
/* harmony export */   __classPrivateFieldGet: () => (/* binding */ __classPrivateFieldGet),
/* harmony export */   __classPrivateFieldIn: () => (/* binding */ __classPrivateFieldIn),
/* harmony export */   __classPrivateFieldSet: () => (/* binding */ __classPrivateFieldSet),
/* harmony export */   __createBinding: () => (/* binding */ __createBinding),
/* harmony export */   __decorate: () => (/* binding */ __decorate),
/* harmony export */   __disposeResources: () => (/* binding */ __disposeResources),
/* harmony export */   __esDecorate: () => (/* binding */ __esDecorate),
/* harmony export */   __exportStar: () => (/* binding */ __exportStar),
/* harmony export */   __extends: () => (/* binding */ __extends),
/* harmony export */   __generator: () => (/* binding */ __generator),
/* harmony export */   __importDefault: () => (/* binding */ __importDefault),
/* harmony export */   __importStar: () => (/* binding */ __importStar),
/* harmony export */   __makeTemplateObject: () => (/* binding */ __makeTemplateObject),
/* harmony export */   __metadata: () => (/* binding */ __metadata),
/* harmony export */   __param: () => (/* binding */ __param),
/* harmony export */   __propKey: () => (/* binding */ __propKey),
/* harmony export */   __read: () => (/* binding */ __read),
/* harmony export */   __rest: () => (/* binding */ __rest),
/* harmony export */   __runInitializers: () => (/* binding */ __runInitializers),
/* harmony export */   __setFunctionName: () => (/* binding */ __setFunctionName),
/* harmony export */   __spread: () => (/* binding */ __spread),
/* harmony export */   __spreadArray: () => (/* binding */ __spreadArray),
/* harmony export */   __spreadArrays: () => (/* binding */ __spreadArrays),
/* harmony export */   __values: () => (/* binding */ __values),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */

var extendStatics = function(d, b) {
  extendStatics = Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
      function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
  return extendStatics(d, b);
};

function __extends(d, b) {
  if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
  extendStatics(d, b);
  function __() { this.constructor = d; }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
  __assign = Object.assign || function __assign(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
      return t;
  }
  return __assign.apply(this, arguments);
}

function __rest(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
          if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
              t[p[i]] = s[p[i]];
      }
  return t;
}

function __decorate(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
  return function (target, key) { decorator(target, key, paramIndex); }
}

function __esDecorate(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _, done = false;
  for (var i = decorators.length - 1; i >= 0; i--) {
      var context = {};
      for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
      for (var p in contextIn.access) context.access[p] = contextIn.access[p];
      context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
      var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
      if (kind === "accessor") {
          if (result === void 0) continue;
          if (result === null || typeof result !== "object") throw new TypeError("Object expected");
          if (_ = accept(result.get)) descriptor.get = _;
          if (_ = accept(result.set)) descriptor.set = _;
          if (_ = accept(result.init)) initializers.unshift(_);
      }
      else if (_ = accept(result)) {
          if (kind === "field") initializers.unshift(_);
          else descriptor[key] = _;
      }
  }
  if (target) Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
};

function __runInitializers(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i = 0; i < initializers.length; i++) {
      value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
  }
  return useValue ? value : void 0;
};

function __propKey(x) {
  return typeof x === "symbol" ? x : "".concat(x);
};

function __setFunctionName(f, name, prefix) {
  if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
  return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};

function __metadata(metadataKey, metadataValue) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
      function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
      function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}

function __generator(thisArg, body) {
  var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
  return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
  function verb(n) { return function (v) { return step([n, v]); }; }
  function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
              case 0: case 1: t = op; break;
              case 4: _.label++; return { value: op[1], done: false };
              case 5: _.label++; y = op[1]; op = [0]; continue;
              case 7: op = _.ops.pop(); _.trys.pop(); continue;
              default:
                  if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                  if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                  if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                  if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                  if (t[2]) _.ops.pop();
                  _.trys.pop(); continue;
          }
          op = body.call(thisArg, _);
      } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
      if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
  }
}

var __createBinding = Object.create ? (function(o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  var desc = Object.getOwnPropertyDescriptor(m, k);
  if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
  }
  Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

function __exportStar(m, o) {
  for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
}

function __values(o) {
  var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
      next: function () {
          if (o && i >= o.length) o = void 0;
          return { value: o && o[i++], done: !o };
      }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  }
  catch (error) { e = { error: error }; }
  finally {
      try {
          if (r && !r.done && (m = i["return"])) m.call(i);
      }
      finally { if (e) throw e.error; }
  }
  return ar;
}

/** @deprecated */
function __spread() {
  for (var ar = [], i = 0; i < arguments.length; i++)
      ar = ar.concat(__read(arguments[i]));
  return ar;
}

/** @deprecated */
function __spreadArrays() {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
  for (var r = Array(s), k = 0, i = 0; i < il; i++)
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
          r[k] = a[j];
  return r;
}

function __spreadArray(to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
      }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
}

function __await(v) {
  return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var g = generator.apply(thisArg, _arguments || []), i, q = [];
  return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function () { return this; }, i;
  function awaitReturn(f) { return function (v) { return Promise.resolve(v).then(f, reject); }; }
  function verb(n, f) { if (g[n]) { i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; if (f) i[n] = f(i[n]); } }
  function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
  function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
  function fulfill(value) { resume("next", value); }
  function reject(value) { resume("throw", value); }
  function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
  var i, p;
  return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
  function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: false } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator], i;
  return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
  function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
  function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
  if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
  return cooked;
};

var __setModuleDefault = Object.create ? (function(o, v) {
  Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
  o["default"] = v;
};

function __importStar(mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
  __setModuleDefault(result, mod);
  return result;
}

function __importDefault(mod) {
  return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, state, kind, f) {
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
  if (kind === "m") throw new TypeError("Private method is not writable");
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}

function __classPrivateFieldIn(state, receiver) {
  if (receiver === null || (typeof receiver !== "object" && typeof receiver !== "function")) throw new TypeError("Cannot use 'in' operator on non-object");
  return typeof state === "function" ? receiver === state : state.has(receiver);
}

function __addDisposableResource(env, value, async) {
  if (value !== null && value !== void 0) {
    if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
    var dispose, inner;
    if (async) {
      if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
      dispose = value[Symbol.asyncDispose];
    }
    if (dispose === void 0) {
      if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
      dispose = value[Symbol.dispose];
      if (async) inner = dispose;
    }
    if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
    if (inner) dispose = function() { try { inner.call(this); } catch (e) { return Promise.reject(e); } };
    env.stack.push({ value: value, dispose: dispose, async: async });
  }
  else if (async) {
    env.stack.push({ async: true });
  }
  return value;
}

var _SuppressedError = typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

function __disposeResources(env) {
  function fail(e) {
    env.error = env.hasError ? new _SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
    env.hasError = true;
  }
  var r, s = 0;
  function next() {
    while (r = env.stack.pop()) {
      try {
        if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
        if (r.dispose) {
          var result = r.dispose.call(r.value);
          if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) { fail(e); return next(); });
        }
        else s |= 1;
      }
      catch (e) {
        fail(e);
      }
    }
    if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
    if (env.hasError) throw env.error;
  }
  return next();
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  __extends,
  __assign,
  __rest,
  __decorate,
  __param,
  __metadata,
  __awaiter,
  __generator,
  __createBinding,
  __exportStar,
  __values,
  __read,
  __spread,
  __spreadArrays,
  __spreadArray,
  __await,
  __asyncGenerator,
  __asyncDelegator,
  __asyncValues,
  __makeTemplateObject,
  __importStar,
  __importDefault,
  __classPrivateFieldGet,
  __classPrivateFieldSet,
  __classPrivateFieldIn,
  __addDisposableResource,
  __disposeResources,
});


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   serializers: () => (/* reexport module object */ _lts_serializers_legacy_legacy__WEBPACK_IMPORTED_MODULE_0__)
/* harmony export */ });
/* harmony import */ var _lts_serializers_legacy_legacy__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @lts/serializers/legacy/legacy */ "../../../lts/serializers/src/legacy/legacy.ts");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_lts_serializers_legacy_legacy__WEBPACK_IMPORTED_MODULE_0__);

__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFieWxvbmpzLnNlcmlhbGl6ZXJzLmpzIiwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQ1ZBOzs7Ozs7Ozs7Ozs7Ozs7OztBQ0NBO0FBQ0E7QUFJQTtBQUVBOztBQUVBO0FBQ0E7QUFBQTtBQThMQTtBQTdMQTs7Ozs7OztBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBOzs7O0FBSUE7QUFDQTtBQUVBOzs7O0FBSUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDck1BO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQWNBO0FBYkE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBSUE7QUFHQTtBQUNBO0FBRUE7QUFHQTtBQURBO0FBQ0E7QUFDQTtBQUNBOzs7QUFBQTtBQUVBOzs7Ozs7OztBQVFBO0FBQ0E7QUFBQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUFBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQU9BO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdExBO0FBQ0E7QUFDQTtBQUVBO0FBSUE7QUFDQTtBQUdBO0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBZUE7O0FBRUE7QUFDQTtBQWpCQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFXQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQURBO0FBQ0E7QUFDQTtBQUNBOzs7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUFPQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDM0xBO0FBRUE7QUFHQTtBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQWNBO0FBYkE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBSUE7QUFHQTtBQUNBO0FBRUE7QUFHQTtBQURBO0FBQ0E7QUFDQTtBQUNBOzs7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2hGQTtBQUVBO0FBR0E7QUFFQTtBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQWNBO0FBYkE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBSUE7QUFHQTtBQUNBO0FBRUE7QUFHQTtBQURBO0FBQ0E7QUFDQTtBQUNBOzs7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDMUdBO0FBRUE7QUFHQTtBQUVBOzs7QUFHQTtBQUNBO0FBQ0E7QUFjQTtBQWJBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUlBO0FBR0E7QUFDQTtBQUVBO0FBR0E7QUFEQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQUE7QUFFQTs7Ozs7O0FBTUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7QUFNQTtBQUNBO0FBQUE7QUFDQTs7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3ZIQTtBQUVBO0FBRUE7QUFFQTs7O0FBR0E7QUFDQTtBQUNBO0FBWUE7QUFDQTtBQVpBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBR0E7QUFFQTtBQUNBO0FBR0E7QUFEQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7O0FBTUE7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzFFQTtBQUVBO0FBR0E7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBNkNBO0FBM0NBO0FBQ0E7QUFHQTtBQURBO0FBQ0E7QUFDQTtBQUNBOzs7QUFBQTtBQUVBOzs7Ozs7QUFNQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbkVBO0FBRUE7QUFFQTtBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQVlBO0FBWEE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFHQTtBQURBO0FBQ0E7QUFDQTtBQUNBOzs7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7OztBQU1BO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDaEVBO0FBRUE7QUFHQTtBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQWNBO0FBYkE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBSUE7QUFHQTtBQUNBO0FBRUE7QUFHQTtBQURBO0FBQ0E7QUFDQTtBQUNBOzs7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDeEZBO0FBRUE7QUFHQTtBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQWNBO0FBYkE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFLQTtBQUNBO0FBRUE7QUFHQTtBQURBO0FBQ0E7QUFDQTtBQUNBOzs7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUFBO0FBQ0E7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDcEZBO0FBRUE7QUFHQTtBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQWNBO0FBYkE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBSUE7QUFHQTtBQUNBO0FBRUE7QUFDQTtBQUdBO0FBREE7QUFDQTtBQUNBO0FBQ0E7OztBQUFBO0FBRUE7Ozs7OztBQU1BO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBRUE7Ozs7OztBQU1BO0FBQ0E7QUFBQTtBQUNBOztBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBOztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNuSEE7QUFFQTtBQUdBO0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBY0E7QUFiQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFJQTtBQUdBO0FBQ0E7QUFFQTtBQUNBO0FBR0E7QUFEQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQUE7QUFFQTs7Ozs7O0FBTUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7Ozs7OztBQU1BO0FBQ0E7QUFBQTtBQUNBOztBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3hHQTtBQUVBO0FBQ0E7QUFFQTtBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQVlBO0FBWEE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUdBO0FBREE7QUFDQTtBQUNBO0FBQ0E7OztBQUFBO0FBRUE7QUFFQTtBQUFBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDekRBO0FBRUE7QUFFQTtBQUVBO0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBY0E7QUFiQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFJQTtBQUdBO0FBQ0E7QUFFQTtBQUdBO0FBREE7QUFDQTtBQUNBO0FBQ0E7OztBQUFBO0FBRUE7Ozs7OztBQU1BO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBRUE7Ozs7OztBQU1BO0FBQ0E7QUFBQTtBQUNBOztBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDckhBO0FBSUE7QUFFQTtBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQWFBO0FBWkE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFHQTtBQURBO0FBQ0E7QUFDQTtBQUNBOzs7QUFBQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBOztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3RHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUdBO0FBSUE7QUFDQTtBQWlEQTs7O0FBR0E7QUFDQTtBQUNBO0FBQUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBRUE7OztBQUdBO0FBQ0E7QUFBQTtBQW84QkE7QUFuOEJBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7O0FBU0E7QUFDQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBYUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFhQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7O0FBWUE7QUFDQTtBQVlBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBY0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7Ozs7Ozs7QUFZQTtBQUNBO0FBWUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBUUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFlQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7QUFXQTtBQUNBOztBQVVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQWNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7O0FBMURBO0FBQUE7QUEyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7OztBQVFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBUUE7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBZUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBeklBO0FBQUE7QUFBQTtBQTBJQTtBQUNBO0FBQ0E7QUFFQTtBQWVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQVVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7Ozs7Ozs7OztBQWVBO0FBQ0E7QUFhQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQVdBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7O0FBUUE7QUFDQTtBQVFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7OztBQVFBO0FBQ0E7QUFRQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7QUFRQTtBQUNBO0FBUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7OztBQU1BO0FBQ0E7QUFLQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7Ozs7Ozs7OztBQVNBO0FBQ0E7QUFRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFBQTs7Ozs7Ozs7Ozs7Ozs7OztBQ3poQ0E7O0FBRUE7QUFDQTtBQU1BOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7O0FBRUE7QUFDQTtBQUNBOzs7OztBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUdBO0FBRUE7QUFDQTtBQUlBO0FBQ0E7QUFJQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXVDQTs7O0FBR0E7QUFDQTtBQXVPQTs7OztBQUlBO0FBQ0E7QUFqSkE7QUFrSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUF6S0E7QUFBQTtBQU1BO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBSUE7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQU1BO0FBSUE7QUFFQTtBQU9BO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFBQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUFBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXNDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQ0E7QUFDQTs7O0FBQUE7QUFFQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7O0FBU0E7QUFDQTtBQVFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7OztBQVFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7OztBQVFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7O0FBUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7OztBQU1BO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBRUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7O0FBU0E7QUFDQTtBQVFBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFBQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTs7Ozs7O0FBTUE7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFFQTs7Ozs7QUFLQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTs7O0FBR0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7O0FBRUE7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBRUE7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7QUFPQTtBQUNBO0FBT0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7O0FBTUE7QUFDQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFVQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFVQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFVQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7QUFLQTtBQUNBOztBQUFBOztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7Ozs7O0FBS0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBWUE7QUFDQTtBQVlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUEvQ0E7QUFBQTtBQUFBO0FBZ0RBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQVVBO0FBRUE7QUFDQTtBQUNBO0FBRUE7Ozs7O0FBS0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7QUFLQTtBQUNBOztBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQWx6REE7QUFDQTtBQWt6REE7QUFBQTtBQUVBOzs7O0FBSUE7QUFDQTtBQWFBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0FDL3hFQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUtBO0FBQ0E7QUFPQTtBQWtEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7O0FBR0E7QUFDQTtBQTZCQTtBQWxCQTs7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQWFBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7QUFNQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7OztBQUlBO0FBQ0E7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7O0FBUUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7O0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTs7Ozs7O0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7QUFPQTtBQUNBOzs7Ozs7QUFDQTtBQUVBO0FBQ0E7QUFHQTtBQUVBOztBQUFBO0FBRUE7O0FBQUE7QUFFQTtBQUFBOzs7O0FBQ0E7QUFFQTs7Ozs7O0FBTUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBRUE7Ozs7OztBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOzs7OztBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7O0FBU0E7QUFDQTs7Ozs7OztBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBOztBQUFBO0FBQ0E7O0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTs7OztBQUVBO0FBRUE7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7QUFPQTtBQUNBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7O0FBT0E7QUFDQTtBQUFBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7QUFNQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQVFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBR0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOzs7OztBQUtBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7OztBQUNBO0FBQ0E7QUFDQTs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQUNBOztBQUFBO0FBQ0E7OztBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQUE7O0FBQUE7QUFDQTtBQUNBOztBQUdBOzs7O0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQXprQ0E7O0FBRUE7QUFDQTtBQUVBOztBQUVBO0FBQ0E7QUFVQTs7QUFFQTtBQUNBO0FBcWpDQTtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0FDbHFDQTtBQXNEQTs7QUFFQTtBQUNBO0FBQUE7QUFxREE7QUFwREE7Ozs7Ozs7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7QUFNQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDN0dBO0FBRUE7O0FBRUE7QUFDQTtBQUFBO0FBOEhBO0FBN0hBOzs7Ozs7OztBQVFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7QUFXQTtBQUNBO0FBVUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7Ozs7OztBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDeElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7O0FDUkE7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDRkE7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUNIQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOztBQUVBO0FBQ0E7QUFBQTtBQW1KQTtBQWxKQTs7Ozs7Ozs7Ozs7QUFXQTtBQUNBO0FBVUE7QUFSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQ2pEQTtBQUNBO0FBRUE7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7QUNkQTtBQUNBO0FBRUE7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQ0xBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUN6WEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ1BBOzs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7OztBQ05BO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL1NFUklBTElaRVJTL3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9TRVJJQUxJWkVSUy8uLi8uLi8uLi9kZXYvc2VyaWFsaXplcnMvc3JjL09CSi9pbmRleC50cyIsIndlYnBhY2s6Ly9TRVJJQUxJWkVSUy8uLi8uLi8uLi9kZXYvc2VyaWFsaXplcnMvc3JjL09CSi9vYmpTZXJpYWxpemVyLnRzIiwid2VicGFjazovL1NFUklBTElaRVJTLy4uLy4uLy4uL2Rldi9zZXJpYWxpemVycy9zcmMvZ2xURi8yLjAvRXh0ZW5zaW9ucy9FWFRfbWVzaF9ncHVfaW5zdGFuY2luZy50cyIsIndlYnBhY2s6Ly9TRVJJQUxJWkVSUy8uLi8uLi8uLi9kZXYvc2VyaWFsaXplcnMvc3JjL2dsVEYvMi4wL0V4dGVuc2lvbnMvS0hSX2xpZ2h0c19wdW5jdHVhbC50cyIsIndlYnBhY2s6Ly9TRVJJQUxJWkVSUy8uLi8uLi8uLi9kZXYvc2VyaWFsaXplcnMvc3JjL2dsVEYvMi4wL0V4dGVuc2lvbnMvS0hSX21hdGVyaWFsc19hbmlzb3Ryb3B5LnRzIiwid2VicGFjazovL1NFUklBTElaRVJTLy4uLy4uLy4uL2Rldi9zZXJpYWxpemVycy9zcmMvZ2xURi8yLjAvRXh0ZW5zaW9ucy9LSFJfbWF0ZXJpYWxzX2NsZWFyY29hdC50cyIsIndlYnBhY2s6Ly9TRVJJQUxJWkVSUy8uLi8uLi8uLi9kZXYvc2VyaWFsaXplcnMvc3JjL2dsVEYvMi4wL0V4dGVuc2lvbnMvS0hSX21hdGVyaWFsc19kaWZmdXNlX3RyYW5zbWlzc2lvbi50cyIsIndlYnBhY2s6Ly9TRVJJQUxJWkVSUy8uLi8uLi8uLi9kZXYvc2VyaWFsaXplcnMvc3JjL2dsVEYvMi4wL0V4dGVuc2lvbnMvS0hSX21hdGVyaWFsc19kaXNwZXJzaW9uLnRzIiwid2VicGFjazovL1NFUklBTElaRVJTLy4uLy4uLy4uL2Rldi9zZXJpYWxpemVycy9zcmMvZ2xURi8yLjAvRXh0ZW5zaW9ucy9LSFJfbWF0ZXJpYWxzX2VtaXNzaXZlX3N0cmVuZ3RoLnRzIiwid2VicGFjazovL1NFUklBTElaRVJTLy4uLy4uLy4uL2Rldi9zZXJpYWxpemVycy9zcmMvZ2xURi8yLjAvRXh0ZW5zaW9ucy9LSFJfbWF0ZXJpYWxzX2lvci50cyIsIndlYnBhY2s6Ly9TRVJJQUxJWkVSUy8uLi8uLi8uLi9kZXYvc2VyaWFsaXplcnMvc3JjL2dsVEYvMi4wL0V4dGVuc2lvbnMvS0hSX21hdGVyaWFsc19pcmlkZXNjZW5jZS50cyIsIndlYnBhY2s6Ly9TRVJJQUxJWkVSUy8uLi8uLi8uLi9kZXYvc2VyaWFsaXplcnMvc3JjL2dsVEYvMi4wL0V4dGVuc2lvbnMvS0hSX21hdGVyaWFsc19zaGVlbi50cyIsIndlYnBhY2s6Ly9TRVJJQUxJWkVSUy8uLi8uLi8uLi9kZXYvc2VyaWFsaXplcnMvc3JjL2dsVEYvMi4wL0V4dGVuc2lvbnMvS0hSX21hdGVyaWFsc19zcGVjdWxhci50cyIsIndlYnBhY2s6Ly9TRVJJQUxJWkVSUy8uLi8uLi8uLi9kZXYvc2VyaWFsaXplcnMvc3JjL2dsVEYvMi4wL0V4dGVuc2lvbnMvS0hSX21hdGVyaWFsc190cmFuc21pc3Npb24udHMiLCJ3ZWJwYWNrOi8vU0VSSUFMSVpFUlMvLi4vLi4vLi4vZGV2L3NlcmlhbGl6ZXJzL3NyYy9nbFRGLzIuMC9FeHRlbnNpb25zL0tIUl9tYXRlcmlhbHNfdW5saXQudHMiLCJ3ZWJwYWNrOi8vU0VSSUFMSVpFUlMvLi4vLi4vLi4vZGV2L3NlcmlhbGl6ZXJzL3NyYy9nbFRGLzIuMC9FeHRlbnNpb25zL0tIUl9tYXRlcmlhbHNfdm9sdW1lLnRzIiwid2VicGFjazovL1NFUklBTElaRVJTLy4uLy4uLy4uL2Rldi9zZXJpYWxpemVycy9zcmMvZ2xURi8yLjAvRXh0ZW5zaW9ucy9LSFJfdGV4dHVyZV90cmFuc2Zvcm0udHMiLCJ3ZWJwYWNrOi8vU0VSSUFMSVpFUlMvLi4vLi4vLi4vZGV2L3NlcmlhbGl6ZXJzL3NyYy9nbFRGLzIuMC9FeHRlbnNpb25zL2luZGV4LnRzIiwid2VicGFjazovL1NFUklBTElaRVJTLy4uLy4uLy4uL2Rldi9zZXJpYWxpemVycy9zcmMvZ2xURi8yLjAvZ2xURkFuaW1hdGlvbi50cyIsIndlYnBhY2s6Ly9TRVJJQUxJWkVSUy8uLi8uLi8uLi9kZXYvc2VyaWFsaXplcnMvc3JjL2dsVEYvMi4wL2dsVEZEYXRhLnRzIiwid2VicGFjazovL1NFUklBTElaRVJTLy4uLy4uLy4uL2Rldi9zZXJpYWxpemVycy9zcmMvZ2xURi8yLjAvZ2xURkV4cG9ydGVyLnRzIiwid2VicGFjazovL1NFUklBTElaRVJTLy4uLy4uLy4uL2Rldi9zZXJpYWxpemVycy9zcmMvZ2xURi8yLjAvZ2xURkV4cG9ydGVyRXh0ZW5zaW9uLnRzIiwid2VicGFjazovL1NFUklBTElaRVJTLy4uLy4uLy4uL2Rldi9zZXJpYWxpemVycy9zcmMvZ2xURi8yLjAvZ2xURk1hdGVyaWFsRXhwb3J0ZXIudHMiLCJ3ZWJwYWNrOi8vU0VSSUFMSVpFUlMvLi4vLi4vLi4vZGV2L3NlcmlhbGl6ZXJzL3NyYy9nbFRGLzIuMC9nbFRGU2VyaWFsaXplci50cyIsIndlYnBhY2s6Ly9TRVJJQUxJWkVSUy8uLi8uLi8uLi9kZXYvc2VyaWFsaXplcnMvc3JjL2dsVEYvMi4wL2dsVEZVdGlsaXRpZXMudHMiLCJ3ZWJwYWNrOi8vU0VSSUFMSVpFUlMvLi4vLi4vLi4vZGV2L3NlcmlhbGl6ZXJzL3NyYy9nbFRGLzIuMC9pbmRleC50cyIsIndlYnBhY2s6Ly9TRVJJQUxJWkVSUy8uLi8uLi8uLi9kZXYvc2VyaWFsaXplcnMvc3JjL2dsVEYvZ2xURkZpbGVFeHBvcnRlci50cyIsIndlYnBhY2s6Ly9TRVJJQUxJWkVSUy8uLi8uLi8uLi9kZXYvc2VyaWFsaXplcnMvc3JjL2dsVEYvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vU0VSSUFMSVpFUlMvLi4vLi4vLi4vZGV2L3NlcmlhbGl6ZXJzL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly9TRVJJQUxJWkVSUy8uLi8uLi8uLi9kZXYvc2VyaWFsaXplcnMvc3JjL3N0bC9pbmRleC50cyIsIndlYnBhY2s6Ly9TRVJJQUxJWkVSUy8uLi8uLi8uLi9kZXYvc2VyaWFsaXplcnMvc3JjL3N0bC9zdGxTZXJpYWxpemVyLnRzIiwid2VicGFjazovL1NFUklBTElaRVJTLy4uLy4uLy4uL2x0cy9zZXJpYWxpemVycy9zcmMvbGVnYWN5L2xlZ2FjeS1nbFRGMlNlcmlhbGl6ZXIudHMiLCJ3ZWJwYWNrOi8vU0VSSUFMSVpFUlMvLi4vLi4vLi4vbHRzL3NlcmlhbGl6ZXJzL3NyYy9sZWdhY3kvbGVnYWN5LW9ialNlcmlhbGl6ZXIudHMiLCJ3ZWJwYWNrOi8vU0VSSUFMSVpFUlMvLi4vLi4vLi4vbHRzL3NlcmlhbGl6ZXJzL3NyYy9sZWdhY3kvbGVnYWN5LXN0bFNlcmlhbGl6ZXIudHMiLCJ3ZWJwYWNrOi8vU0VSSUFMSVpFUlMvLi4vLi4vLi4vbHRzL3NlcmlhbGl6ZXJzL3NyYy9sZWdhY3kvbGVnYWN5LnRzIiwid2VicGFjazovL1NFUklBTElaRVJTL2V4dGVybmFsIHVtZCB7XCJyb290XCI6XCJCQUJZTE9OXCIsXCJjb21tb25qc1wiOlwiYmFieWxvbmpzXCIsXCJjb21tb25qczJcIjpcImJhYnlsb25qc1wiLFwiYW1kXCI6XCJiYWJ5bG9uanNcIn0iLCJ3ZWJwYWNrOi8vU0VSSUFMSVpFUlMvLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5tanMiLCJ3ZWJwYWNrOi8vU0VSSUFMSVpFUlMvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vU0VSSUFMSVpFUlMvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vU0VSSUFMSVpFUlMvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL1NFUklBTElaRVJTL3dlYnBhY2svcnVudGltZS9nbG9iYWwiLCJ3ZWJwYWNrOi8vU0VSSUFMSVpFUlMvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9TRVJJQUxJWkVSUy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL1NFUklBTElaRVJTLy4vc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkocmVxdWlyZShcImJhYnlsb25qc1wiKSk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShcImJhYnlsb25qcy1zZXJpYWxpemVyc1wiLCBbXCJiYWJ5bG9uanNcIl0sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiYmFieWxvbmpzLXNlcmlhbGl6ZXJzXCJdID0gZmFjdG9yeShyZXF1aXJlKFwiYmFieWxvbmpzXCIpKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJTRVJJQUxJWkVSU1wiXSA9IGZhY3Rvcnkocm9vdFtcIkJBQllMT05cIl0pO1xufSkoKHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0aGlzKSwgKF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfYmFieWxvbmpzX01hdGhzX21hdGhfdmVjdG9yX18pID0+IHtcbnJldHVybiAiLCJleHBvcnQgKiBmcm9tIFwiLi9vYmpTZXJpYWxpemVyXCI7XHJcbiIsImltcG9ydCB0eXBlIHsgTnVsbGFibGUgfSBmcm9tIFwiY29yZS90eXBlc1wiO1xyXG5pbXBvcnQgeyBNYXRyaXggfSBmcm9tIFwiY29yZS9NYXRocy9tYXRoLnZlY3RvclwiO1xyXG5pbXBvcnQgeyBUb29scyB9IGZyb20gXCJjb3JlL01pc2MvdG9vbHNcIjtcclxuaW1wb3J0IHR5cGUgeyBTdGFuZGFyZE1hdGVyaWFsIH0gZnJvbSBcImNvcmUvTWF0ZXJpYWxzL3N0YW5kYXJkTWF0ZXJpYWxcIjtcclxuaW1wb3J0IHR5cGUgeyBHZW9tZXRyeSB9IGZyb20gXCJjb3JlL01lc2hlcy9nZW9tZXRyeVwiO1xyXG5pbXBvcnQgdHlwZSB7IE1lc2ggfSBmcm9tIFwiY29yZS9NZXNoZXMvbWVzaFwiO1xyXG5pbXBvcnQgeyBNYXRlcmlhbCB9IGZyb20gXCJjb3JlL01hdGVyaWFscy9tYXRlcmlhbFwiO1xyXG5cclxuLyoqXHJcbiAqIENsYXNzIGZvciBnZW5lcmF0aW5nIE9CSiBkYXRhIGZyb20gYSBCYWJ5bG9uIHNjZW5lLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIE9CSkV4cG9ydCB7XHJcbiAgICAvKipcclxuICAgICAqIEV4cG9ydHMgdGhlIGdlb21ldHJ5IG9mIGEgTWVzaCBhcnJheSBpbiAuT0JKIGZpbGUgZm9ybWF0ICh0ZXh0KVxyXG4gICAgICogQHBhcmFtIG1lc2hlcyBkZWZpbmVzIHRoZSBsaXN0IG9mIG1lc2hlcyB0byBzZXJpYWxpemVcclxuICAgICAqIEBwYXJhbSBtYXRlcmlhbHMgZGVmaW5lcyBpZiBtYXRlcmlhbHMgc2hvdWxkIGJlIGV4cG9ydGVkXHJcbiAgICAgKiBAcGFyYW0gbWF0bGlibmFtZSBkZWZpbmVzIHRoZSBuYW1lIG9mIHRoZSBhc3NvY2lhdGVkIG10bCBmaWxlXHJcbiAgICAgKiBAcGFyYW0gZ2xvYmFscG9zaXRpb24gZGVmaW5lcyBpZiB0aGUgZXhwb3J0ZWQgcG9zaXRpb25zIGFyZSBnbG9iYWxzIG9yIGxvY2FsIHRvIHRoZSBleHBvcnRlZCBtZXNoXHJcbiAgICAgKiBAcmV0dXJucyB0aGUgT0JKIGNvbnRlbnRcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBPQkoobWVzaGVzOiBNZXNoW10sIG1hdGVyaWFscz86IGJvb2xlYW4sIG1hdGxpYm5hbWU/OiBzdHJpbmcsIGdsb2JhbHBvc2l0aW9uPzogYm9vbGVhbik6IHN0cmluZyB7XHJcbiAgICAgICAgY29uc3Qgb3V0cHV0OiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgICAgIGxldCB2ID0gMTtcclxuICAgICAgICAvLyBrZWVwIHRyYWNrIG9mIHV2IGluZGV4IGluIGNhc2UgbWl4ZWQgbWVzaGVzIGFyZSBwYXNzZWQgaW5cclxuICAgICAgICBsZXQgdGV4dHVyZVYgPSAxO1xyXG5cclxuICAgICAgICBpZiAobWF0ZXJpYWxzKSB7XHJcbiAgICAgICAgICAgIGlmICghbWF0bGlibmFtZSkge1xyXG4gICAgICAgICAgICAgICAgbWF0bGlibmFtZSA9IFwibWF0XCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3V0cHV0LnB1c2goXCJtdGxsaWIgXCIgKyBtYXRsaWJuYW1lICsgXCIubXRsXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IG1lc2hlcy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICBjb25zdCBtZXNoID0gbWVzaGVzW2pdO1xyXG4gICAgICAgICAgICBjb25zdCBvYmplY3ROYW1lID0gbWVzaC5uYW1lIHx8IGBtZXNoJHtqfX1gO1xyXG4gICAgICAgICAgICBvdXRwdXQucHVzaChgbyAke29iamVjdE5hbWV9YCk7XHJcblxyXG4gICAgICAgICAgICAvL1VzZXMgdGhlIHBvc2l0aW9uIG9mIHRoZSBpdGVtIGluIHRoZSBzY2VuZSwgdG8gdGhlIGZpbGUgKHRoaXMgYmFjayB0byBub3JtYWwgaW4gdGhlIGVuZClcclxuICAgICAgICAgICAgbGV0IGludmVyc2VUcmFuc2Zvcm06IE51bGxhYmxlPE1hdHJpeD4gPSBudWxsO1xyXG4gICAgICAgICAgICBpZiAoZ2xvYmFscG9zaXRpb24pIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRyYW5zZm9ybSA9IG1lc2guY29tcHV0ZVdvcmxkTWF0cml4KHRydWUpO1xyXG4gICAgICAgICAgICAgICAgaW52ZXJzZVRyYW5zZm9ybSA9IG5ldyBNYXRyaXgoKTtcclxuICAgICAgICAgICAgICAgIHRyYW5zZm9ybS5pbnZlcnRUb1JlZihpbnZlcnNlVHJhbnNmb3JtKTtcclxuXHJcbiAgICAgICAgICAgICAgICBtZXNoLmJha2VUcmFuc2Zvcm1JbnRvVmVydGljZXModHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy9UT0RPOiBzdWJtZXNoZXMgKGdyb3VwcylcclxuICAgICAgICAgICAgLy9UT0RPOiBzbW9vdGhpbmcgZ3JvdXBzIChzIDEsIHMgb2ZmKTtcclxuICAgICAgICAgICAgaWYgKG1hdGVyaWFscykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbWF0ID0gbWVzaC5tYXRlcmlhbDtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAobWF0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0LnB1c2goXCJ1c2VtdGwgXCIgKyBtYXQuaWQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGc6IE51bGxhYmxlPEdlb21ldHJ5PiA9IG1lc2guZ2VvbWV0cnk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIWcpIHtcclxuICAgICAgICAgICAgICAgIFRvb2xzLldhcm4oXCJObyBnZW9tZXRyeSBpcyBwcmVzZW50IG9uIHRoZSBtZXNoXCIpO1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHRydW5rVmVydHMgPSBnLmdldFZlcnRpY2VzRGF0YShcInBvc2l0aW9uXCIpO1xyXG4gICAgICAgICAgICBjb25zdCB0cnVua05vcm1hbHMgPSBnLmdldFZlcnRpY2VzRGF0YShcIm5vcm1hbFwiKTtcclxuICAgICAgICAgICAgY29uc3QgdHJ1bmtVViA9IGcuZ2V0VmVydGljZXNEYXRhKFwidXZcIik7XHJcbiAgICAgICAgICAgIGNvbnN0IHRydW5rRmFjZXMgPSBnLmdldEluZGljZXMoKTtcclxuICAgICAgICAgICAgbGV0IGN1cnJlbnRWID0gMDtcclxuICAgICAgICAgICAgbGV0IGN1cnJlbnRUZXh0dXJlViA9IDA7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRydW5rVmVydHMgfHwgIXRydW5rRmFjZXMpIHtcclxuICAgICAgICAgICAgICAgIFRvb2xzLldhcm4oXCJUaGVyZSBhcmUgbm8gcG9zaXRpb24gdmVydGljZXMgb3IgaW5kaWNlcyBvbiB0aGUgbWVzaCFcIik7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgdXNlUmlnaHRIYW5kZWRTeXN0ZW0gPSBtZXNoZXNbMF0uZ2V0U2NlbmUoKS51c2VSaWdodEhhbmRlZFN5c3RlbTtcclxuICAgICAgICAgICAgY29uc3QgaGFuZGVkbmVzc1NpZ24gPSB1c2VSaWdodEhhbmRlZFN5c3RlbSA/IDEgOiAtMTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdHJ1bmtWZXJ0cy5sZW5ndGg7IGkgKz0gMykge1xyXG4gICAgICAgICAgICAgICAgb3V0cHV0LnB1c2goXCJ2IFwiICsgdHJ1bmtWZXJ0c1tpXSAqIGhhbmRlZG5lc3NTaWduICsgXCIgXCIgKyB0cnVua1ZlcnRzW2kgKyAxXSArIFwiIFwiICsgdHJ1bmtWZXJ0c1tpICsgMl0pO1xyXG4gICAgICAgICAgICAgICAgY3VycmVudFYrKztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRydW5rTm9ybWFscyAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRydW5rTm9ybWFscy5sZW5ndGg7IGkgKz0gMykge1xyXG4gICAgICAgICAgICAgICAgICAgIG91dHB1dC5wdXNoKFwidm4gXCIgKyB0cnVua05vcm1hbHNbaV0gKiBoYW5kZWRuZXNzU2lnbiArIFwiIFwiICsgdHJ1bmtOb3JtYWxzW2kgKyAxXSArIFwiIFwiICsgdHJ1bmtOb3JtYWxzW2kgKyAyXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRydW5rVVYgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0cnVua1VWLmxlbmd0aDsgaSArPSAyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0LnB1c2goXCJ2dCBcIiArIHRydW5rVVZbaV0gKyBcIiBcIiArIHRydW5rVVZbaSArIDFdKTtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50VGV4dHVyZVYrKztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgYmxhbmtzOiBzdHJpbmdbXSA9IFtcIlwiLCBcIlwiLCBcIlwiXTtcclxuICAgICAgICAgICAgY29uc3QgbWF0ZXJpYWwgPSBtZXNoLm1hdGVyaWFsIHx8IG1lc2guZ2V0U2NlbmUoKS5kZWZhdWx0TWF0ZXJpYWw7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBzaWRlT3JpZW50YXRpb24gPSBtYXRlcmlhbC5fZ2V0RWZmZWN0aXZlT3JpZW50YXRpb24obWVzaCk7XHJcbiAgICAgICAgICAgIGNvbnN0IFtvZmZzZXQxLCBvZmZzZXQyXSA9IHNpZGVPcmllbnRhdGlvbiA9PT0gTWF0ZXJpYWwuQ2xvY2tXaXNlU2lkZU9yaWVudGF0aW9uID8gWzIsIDFdIDogWzEsIDJdO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0cnVua0ZhY2VzLmxlbmd0aDsgaSArPSAzKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpbmRpY2VzID0gW1N0cmluZyh0cnVua0ZhY2VzW2ldICsgdiksIFN0cmluZyh0cnVua0ZhY2VzW2kgKyBvZmZzZXQxXSArIHYpLCBTdHJpbmcodHJ1bmtGYWNlc1tpICsgb2Zmc2V0Ml0gKyB2KV07XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0ZXh0dXJlSW5kaWNlcyA9IFtTdHJpbmcodHJ1bmtGYWNlc1tpXSArIHRleHR1cmVWKSwgU3RyaW5nKHRydW5rRmFjZXNbaSArIG9mZnNldDFdICsgdGV4dHVyZVYpLCBTdHJpbmcodHJ1bmtGYWNlc1tpICsgb2Zmc2V0Ml0gKyB0ZXh0dXJlVildO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGZhY2VQb3NpdGlvbnMgPSBpbmRpY2VzO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZmFjZVVWcyA9IHRydW5rVVYgIT0gbnVsbCA/IHRleHR1cmVJbmRpY2VzIDogYmxhbmtzO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZmFjZU5vcm1hbHMgPSB0cnVua05vcm1hbHMgIT0gbnVsbCA/IGluZGljZXMgOiBibGFua3M7XHJcblxyXG4gICAgICAgICAgICAgICAgb3V0cHV0LnB1c2goXHJcbiAgICAgICAgICAgICAgICAgICAgXCJmIFwiICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmFjZVBvc2l0aW9uc1swXSArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiL1wiICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmFjZVVWc1swXSArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiL1wiICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmFjZU5vcm1hbHNbMF0gK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIiBcIiArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhY2VQb3NpdGlvbnNbMV0gK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIi9cIiArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhY2VVVnNbMV0gK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIi9cIiArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhY2VOb3JtYWxzWzFdICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCIgXCIgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmYWNlUG9zaXRpb25zWzJdICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCIvXCIgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmYWNlVVZzWzJdICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCIvXCIgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmYWNlTm9ybWFsc1syXVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvL2JhY2sgZGUgcHJldmlvdXMgbWF0cml4LCB0byBub3QgY2hhbmdlIHRoZSBvcmlnaW5hbCBtZXNoIGluIHRoZSBzY2VuZVxyXG4gICAgICAgICAgICBpZiAoZ2xvYmFscG9zaXRpb24gJiYgaW52ZXJzZVRyYW5zZm9ybSkge1xyXG4gICAgICAgICAgICAgICAgbWVzaC5iYWtlVHJhbnNmb3JtSW50b1ZlcnRpY2VzKGludmVyc2VUcmFuc2Zvcm0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHYgKz0gY3VycmVudFY7XHJcbiAgICAgICAgICAgIHRleHR1cmVWICs9IGN1cnJlbnRUZXh0dXJlVjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgdGV4dDogc3RyaW5nID0gb3V0cHV0LmpvaW4oXCJcXG5cIik7XHJcbiAgICAgICAgcmV0dXJuIHRleHQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBFeHBvcnRzIHRoZSBtYXRlcmlhbChzKSBvZiBhIG1lc2ggaW4gLk1UTCBmaWxlIGZvcm1hdCAodGV4dClcclxuICAgICAqIEBwYXJhbSBtZXNoIGRlZmluZXMgdGhlIG1lc2ggdG8gZXh0cmFjdCB0aGUgbWF0ZXJpYWwgZnJvbVxyXG4gICAgICogQHJldHVybnMgdGhlIG10bCBjb250ZW50XHJcbiAgICAgKi9cclxuICAgIC8vVE9ETzogRXhwb3J0IHRoZSBtYXRlcmlhbHMgb2YgbWVzaCBhcnJheVxyXG4gICAgcHVibGljIHN0YXRpYyBNVEwobWVzaDogTWVzaCk6IHN0cmluZyB7XHJcbiAgICAgICAgY29uc3Qgb3V0cHV0ID0gW107XHJcbiAgICAgICAgY29uc3QgbSA9IDxTdGFuZGFyZE1hdGVyaWFsPm1lc2gubWF0ZXJpYWw7XHJcbiAgICAgICAgb3V0cHV0LnB1c2goXCJuZXdtdGwgbWF0MVwiKTtcclxuICAgICAgICBvdXRwdXQucHVzaChcIiAgTnMgXCIgKyBtLnNwZWN1bGFyUG93ZXIudG9GaXhlZCg0KSk7XHJcbiAgICAgICAgb3V0cHV0LnB1c2goXCIgIE5pIDEuNTAwMFwiKTtcclxuICAgICAgICBvdXRwdXQucHVzaChcIiAgZCBcIiArIG0uYWxwaGEudG9GaXhlZCg0KSk7XHJcbiAgICAgICAgb3V0cHV0LnB1c2goXCIgIFRyIDAuMDAwMFwiKTtcclxuICAgICAgICBvdXRwdXQucHVzaChcIiAgVGYgMS4wMDAwIDEuMDAwMCAxLjAwMDBcIik7XHJcbiAgICAgICAgb3V0cHV0LnB1c2goXCIgIGlsbHVtIDJcIik7XHJcbiAgICAgICAgb3V0cHV0LnB1c2goXCIgIEthIFwiICsgbS5hbWJpZW50Q29sb3Iuci50b0ZpeGVkKDQpICsgXCIgXCIgKyBtLmFtYmllbnRDb2xvci5nLnRvRml4ZWQoNCkgKyBcIiBcIiArIG0uYW1iaWVudENvbG9yLmIudG9GaXhlZCg0KSk7XHJcbiAgICAgICAgb3V0cHV0LnB1c2goXCIgIEtkIFwiICsgbS5kaWZmdXNlQ29sb3Iuci50b0ZpeGVkKDQpICsgXCIgXCIgKyBtLmRpZmZ1c2VDb2xvci5nLnRvRml4ZWQoNCkgKyBcIiBcIiArIG0uZGlmZnVzZUNvbG9yLmIudG9GaXhlZCg0KSk7XHJcbiAgICAgICAgb3V0cHV0LnB1c2goXCIgIEtzIFwiICsgbS5zcGVjdWxhckNvbG9yLnIudG9GaXhlZCg0KSArIFwiIFwiICsgbS5zcGVjdWxhckNvbG9yLmcudG9GaXhlZCg0KSArIFwiIFwiICsgbS5zcGVjdWxhckNvbG9yLmIudG9GaXhlZCg0KSk7XHJcbiAgICAgICAgb3V0cHV0LnB1c2goXCIgIEtlIFwiICsgbS5lbWlzc2l2ZUNvbG9yLnIudG9GaXhlZCg0KSArIFwiIFwiICsgbS5lbWlzc2l2ZUNvbG9yLmcudG9GaXhlZCg0KSArIFwiIFwiICsgbS5lbWlzc2l2ZUNvbG9yLmIudG9GaXhlZCg0KSk7XHJcblxyXG4gICAgICAgIC8vVE9ETzogdXYgc2NhbGUsIG9mZnNldCwgd3JhcFxyXG4gICAgICAgIC8vVE9ETzogVVYgbWlycm9yZWQgaW4gQmxlbmRlcj8gc2Vjb25kIFVWIGNoYW5uZWw/IGxpZ2h0TWFwPyByZWZsZWN0aW9uIHRleHR1cmVzP1xyXG4gICAgICAgIGNvbnN0IHV2c2NhbGUgPSBcIlwiO1xyXG5cclxuICAgICAgICBpZiAobS5hbWJpZW50VGV4dHVyZSkge1xyXG4gICAgICAgICAgICBvdXRwdXQucHVzaChcIiAgbWFwX0thIFwiICsgdXZzY2FsZSArIG0uYW1iaWVudFRleHR1cmUubmFtZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAobS5kaWZmdXNlVGV4dHVyZSkge1xyXG4gICAgICAgICAgICBvdXRwdXQucHVzaChcIiAgbWFwX0tkIFwiICsgdXZzY2FsZSArIG0uZGlmZnVzZVRleHR1cmUubmFtZSk7XHJcbiAgICAgICAgICAgIC8vVE9ETzogYWxwaGEgdGVzdGluZywgb3BhY2l0eSBpbiBkaWZmdXNlIHRleHR1cmUgYWxwaGEgY2hhbm5lbCAoZGlmZnVzZVRleHR1cmUuaGFzQWxwaGEgLT4gbWFwX2QpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAobS5zcGVjdWxhclRleHR1cmUpIHtcclxuICAgICAgICAgICAgb3V0cHV0LnB1c2goXCIgIG1hcF9LcyBcIiArIHV2c2NhbGUgKyBtLnNwZWN1bGFyVGV4dHVyZS5uYW1lKTtcclxuICAgICAgICAgICAgLyogVE9ETzogZ2xvc3NpbmVzcyA9IHNwZWN1bGFyIGhpZ2hsaWdodCBjb21wb25lbnQgaXMgaW4gYWxwaGEgY2hhbm5lbCBvZiBzcGVjdWxhclRleHR1cmUuICg/Pz8pXHJcbiAgICAgICAgICAgIGlmIChtLnVzZUdsb3NzaW5lc3NGcm9tU3BlY3VsYXJNYXBBbHBoYSkgIHtcclxuICAgICAgICAgICAgICAgIG91dHB1dC5wdXNoKFwiICBtYXBfTnMgXCIrdXZzY2FsZSArIG0uc3BlY3VsYXJUZXh0dXJlLm5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICovXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiBUT0RPOiBlbWlzc2l2ZSB0ZXh0dXJlIG5vdCBpbiAuTUFUIGZvcm1hdCAoPz8/KVxyXG4gICAgICAgIGlmIChtLmVtaXNzaXZlVGV4dHVyZSkge1xyXG4gICAgICAgICAgICBvdXRwdXQucHVzaChcIiAgbWFwX2QgXCIrdXZzY2FsZSttLmVtaXNzaXZlVGV4dHVyZS5uYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgKi9cclxuXHJcbiAgICAgICAgaWYgKG0uYnVtcFRleHR1cmUpIHtcclxuICAgICAgICAgICAgb3V0cHV0LnB1c2goXCIgIG1hcF9idW1wIC1pbWZjaGFuIHogXCIgKyB1dnNjYWxlICsgbS5idW1wVGV4dHVyZS5uYW1lKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChtLm9wYWNpdHlUZXh0dXJlKSB7XHJcbiAgICAgICAgICAgIG91dHB1dC5wdXNoKFwiICBtYXBfZCBcIiArIHV2c2NhbGUgKyBtLm9wYWNpdHlUZXh0dXJlLm5hbWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgdGV4dCA9IG91dHB1dC5qb2luKFwiXFxuXCIpO1xyXG4gICAgICAgIHJldHVybiB0ZXh0O1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB0eXBlIHsgSUJ1ZmZlclZpZXcsIElBY2Nlc3NvciwgSU5vZGUsIElFWFRNZXNoR3B1SW5zdGFuY2luZyB9IGZyb20gXCJiYWJ5bG9uanMtZ2x0ZjJpbnRlcmZhY2VcIjtcclxuaW1wb3J0IHsgQWNjZXNzb3JUeXBlLCBBY2Nlc3NvckNvbXBvbmVudFR5cGUgfSBmcm9tIFwiYmFieWxvbmpzLWdsdGYyaW50ZXJmYWNlXCI7XHJcbmltcG9ydCB0eXBlIHsgSUdMVEZFeHBvcnRlckV4dGVuc2lvblYyIH0gZnJvbSBcIi4uL2dsVEZFeHBvcnRlckV4dGVuc2lvblwiO1xyXG5pbXBvcnQgdHlwZSB7IF9CaW5hcnlXcml0ZXIgfSBmcm9tIFwiLi4vZ2xURkV4cG9ydGVyXCI7XHJcbmltcG9ydCB7IF9FeHBvcnRlciB9IGZyb20gXCIuLi9nbFRGRXhwb3J0ZXJcIjtcclxuaW1wb3J0IHR5cGUgeyBOdWxsYWJsZSB9IGZyb20gXCJjb3JlL3R5cGVzXCI7XHJcbmltcG9ydCB0eXBlIHsgTm9kZSB9IGZyb20gXCJjb3JlL25vZGVcIjtcclxuaW1wb3J0IHsgTWVzaCB9IGZyb20gXCJjb3JlL01lc2hlcy9tZXNoXCI7XHJcbmltcG9ydCBcImNvcmUvTWVzaGVzL3RoaW5JbnN0YW5jZU1lc2hcIjtcclxuaW1wb3J0IHsgVG1wVmVjdG9ycywgUXVhdGVybmlvbiwgVmVjdG9yMyB9IGZyb20gXCJjb3JlL01hdGhzL21hdGgudmVjdG9yXCI7XHJcbmltcG9ydCB7IFZlcnRleEJ1ZmZlciB9IGZyb20gXCJjb3JlL0J1ZmZlcnMvYnVmZmVyXCI7XHJcblxyXG5jb25zdCBOQU1FID0gXCJFWFRfbWVzaF9ncHVfaW5zdGFuY2luZ1wiO1xyXG5cclxuLyoqXHJcbiAqIFtTcGVjaWZpY2F0aW9uXShodHRwczovL2dpdGh1Yi5jb20vS2hyb25vc0dyb3VwL2dsVEYvYmxvYi9tYWluL2V4dGVuc2lvbnMvMi4wL1ZlbmRvci9FWFRfbWVzaF9ncHVfaW5zdGFuY2luZy9SRUFETUUubWQpXHJcbiAqL1xyXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25hbWluZy1jb252ZW50aW9uXHJcbmV4cG9ydCBjbGFzcyBFWFRfbWVzaF9ncHVfaW5zdGFuY2luZyBpbXBsZW1lbnRzIElHTFRGRXhwb3J0ZXJFeHRlbnNpb25WMiB7XHJcbiAgICAvKiogTmFtZSBvZiB0aGlzIGV4dGVuc2lvbiAqL1xyXG4gICAgcHVibGljIHJlYWRvbmx5IG5hbWUgPSBOQU1FO1xyXG5cclxuICAgIC8qKiBEZWZpbmVzIHdoZXRoZXIgdGhpcyBleHRlbnNpb24gaXMgZW5hYmxlZCAqL1xyXG4gICAgcHVibGljIGVuYWJsZWQgPSB0cnVlO1xyXG5cclxuICAgIC8qKiBEZWZpbmVzIHdoZXRoZXIgdGhpcyBleHRlbnNpb24gaXMgcmVxdWlyZWQgKi9cclxuICAgIHB1YmxpYyByZXF1aXJlZCA9IGZhbHNlO1xyXG5cclxuICAgIHByaXZhdGUgX2V4cG9ydGVyOiBfRXhwb3J0ZXI7XHJcblxyXG4gICAgcHJpdmF0ZSBfd2FzVXNlZCA9IGZhbHNlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGV4cG9ydGVyOiBfRXhwb3J0ZXIpIHtcclxuICAgICAgICB0aGlzLl9leHBvcnRlciA9IGV4cG9ydGVyO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkaXNwb3NlKCkge31cclxuXHJcbiAgICAvKiogQGludGVybmFsICovXHJcbiAgICBwdWJsaWMgZ2V0IHdhc1VzZWQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3dhc1VzZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZnRlciBub2RlIGlzIGV4cG9ydGVkXHJcbiAgICAgKiBAcGFyYW0gY29udGV4dCB0aGUgR0xURiBjb250ZXh0IHdoZW4gbG9hZGluZyB0aGUgYXNzZXRcclxuICAgICAqIEBwYXJhbSBub2RlIHRoZSBub2RlIGV4cG9ydGVkXHJcbiAgICAgKiBAcGFyYW0gYmFieWxvbk5vZGUgdGhlIGNvcnJlc3BvbmRpbmcgYmFieWxvbiBub2RlXHJcbiAgICAgKiBAcGFyYW0gbm9kZU1hcCBtYXAgZnJvbSBiYWJ5bG9uIG5vZGUgaWQgdG8gbm9kZSBpbmRleFxyXG4gICAgICogQHBhcmFtIGJpbmFyeVdyaXRlciBiaW5hcnkgd3JpdGVyXHJcbiAgICAgKiBAcmV0dXJucyBudWxsYWJsZSBwcm9taXNlLCByZXNvbHZlcyB3aXRoIHRoZSBub2RlXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBwb3N0RXhwb3J0Tm9kZUFzeW5jKFxyXG4gICAgICAgIGNvbnRleHQ6IHN0cmluZyxcclxuICAgICAgICBub2RlOiBOdWxsYWJsZTxJTm9kZT4sXHJcbiAgICAgICAgYmFieWxvbk5vZGU6IE5vZGUsXHJcbiAgICAgICAgbm9kZU1hcDogeyBba2V5OiBudW1iZXJdOiBudW1iZXIgfSxcclxuICAgICAgICBiaW5hcnlXcml0ZXI6IF9CaW5hcnlXcml0ZXJcclxuICAgICk6IFByb21pc2U8TnVsbGFibGU8SU5vZGU+PiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChub2RlICYmIGJhYnlsb25Ob2RlIGluc3RhbmNlb2YgTWVzaCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGJhYnlsb25Ob2RlLmhhc1RoaW5JbnN0YW5jZXMgJiYgYmluYXJ5V3JpdGVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fd2FzVXNlZCA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5vVHJhbnNsYXRpb24gPSBWZWN0b3IzLlplcm8oKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBub1JvdGF0aW9uID0gUXVhdGVybmlvbi5JZGVudGl0eSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5vU2NhbGUgPSBWZWN0b3IzLk9uZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyByZXRyaWV2ZSBhbGwgdGhlIGluc3RhbmNlIHdvcmxkIG1hdHJpeFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG1hdHJpeCA9IGJhYnlsb25Ob2RlLnRoaW5JbnN0YW5jZUdldFdvcmxkTWF0cmljZXMoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaXd0ID0gVG1wVmVjdG9ycy5WZWN0b3IzWzJdO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGl3ciA9IFRtcFZlY3RvcnMuUXVhdGVybmlvblsxXTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpd3MgPSBUbXBWZWN0b3JzLlZlY3RvcjNbM107XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBoYXNBbnlJbnN0YW5jZVdvcmxkVHJhbnNsYXRpb24gPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaGFzQW55SW5zdGFuY2VXb3JsZFJvdGF0aW9uID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGhhc0FueUluc3RhbmNlV29ybGRTY2FsZSA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBwcmVwYXJlIHRlbXAgYnVmZmVyc1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRyYW5zbGF0aW9uQnVmZmVyID0gbmV3IEZsb2F0MzJBcnJheShiYWJ5bG9uTm9kZS50aGluSW5zdGFuY2VDb3VudCAqIDMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJvdGF0aW9uQnVmZmVyID0gbmV3IEZsb2F0MzJBcnJheShiYWJ5bG9uTm9kZS50aGluSW5zdGFuY2VDb3VudCAqIDQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNjYWxlQnVmZmVyID0gbmV3IEZsb2F0MzJBcnJheShiYWJ5bG9uTm9kZS50aGluSW5zdGFuY2VDb3VudCAqIDMpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgaSA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBtIG9mIG1hdHJpeCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtLmRlY29tcG9zZShpd3MsIGl3ciwgaXd0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZpbGwgdGhlIHRlbXAgYnVmZmVyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zbGF0aW9uQnVmZmVyLnNldChpd3QuYXNBcnJheSgpLCBpICogMyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvdGF0aW9uQnVmZmVyLnNldChpd3Iubm9ybWFsaXplKCkuYXNBcnJheSgpLCBpICogNCk7IC8vIGVuc3VyZSB0aGUgcXVhdGVybmlvbiBpcyBub3JtYWxpemVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlQnVmZmVyLnNldChpd3MuYXNBcnJheSgpLCBpICogMyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzIGlzIHdoZXJlIHdlIGRlY2lkZSBpZiB0aGVyZSBpcyBhbnkgdHJhbnNmb3JtYXRpb25cclxuICAgICAgICAgICAgICAgICAgICAgICAgaGFzQW55SW5zdGFuY2VXb3JsZFRyYW5zbGF0aW9uID0gaGFzQW55SW5zdGFuY2VXb3JsZFRyYW5zbGF0aW9uIHx8ICFpd3QuZXF1YWxzV2l0aEVwc2lsb24obm9UcmFuc2xhdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhc0FueUluc3RhbmNlV29ybGRSb3RhdGlvbiA9IGhhc0FueUluc3RhbmNlV29ybGRSb3RhdGlvbiB8fCAhaXdyLmVxdWFsc1dpdGhFcHNpbG9uKG5vUm90YXRpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoYXNBbnlJbnN0YW5jZVdvcmxkU2NhbGUgPSBoYXNBbnlJbnN0YW5jZVdvcmxkU2NhbGUgfHwgIWl3cy5lcXVhbHNXaXRoRXBzaWxvbihub1NjYWxlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGV4dGVuc2lvbjogSUVYVE1lc2hHcHVJbnN0YW5jaW5nID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzOiB7fSxcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBkbyB3ZSBuZWVkIHRvIHdyaXRlIFRSQU5TTEFUSU9OID9cclxuICAgICAgICAgICAgICAgICAgICBpZiAoaGFzQW55SW5zdGFuY2VXb3JsZFRyYW5zbGF0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4dGVuc2lvbi5hdHRyaWJ1dGVzW1wiVFJBTlNMQVRJT05cIl0gPSB0aGlzLl9idWlsZEFjY2Vzc29yKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNsYXRpb25CdWZmZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBY2Nlc3NvclR5cGUuVkVDMyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhYnlsb25Ob2RlLnRoaW5JbnN0YW5jZUNvdW50LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmluYXJ5V3JpdGVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQWNjZXNzb3JDb21wb25lbnRUeXBlLkZMT0FUXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGRvIHdlIG5lZWQgdG8gd3JpdGUgUk9UQVRJT04gP1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChoYXNBbnlJbnN0YW5jZVdvcmxkUm90YXRpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY29tcG9uZW50VHlwZSA9IEFjY2Vzc29yQ29tcG9uZW50VHlwZS5GTE9BVDsgLy8gd2UgZGVjaWRlZCB0byBzdGF5IG9uIEZMT0FUIGZvciBub3cgc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9CYWJ5bG9uSlMvQmFieWxvbi5qcy9wdWxsLzEyNDk1XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4dGVuc2lvbi5hdHRyaWJ1dGVzW1wiUk9UQVRJT05cIl0gPSB0aGlzLl9idWlsZEFjY2Vzc29yKHJvdGF0aW9uQnVmZmVyLCBBY2Nlc3NvclR5cGUuVkVDNCwgYmFieWxvbk5vZGUudGhpbkluc3RhbmNlQ291bnQsIGJpbmFyeVdyaXRlciwgY29tcG9uZW50VHlwZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGRvIHdlIG5lZWQgdG8gd3JpdGUgU0NBTEUgP1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChoYXNBbnlJbnN0YW5jZVdvcmxkU2NhbGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXh0ZW5zaW9uLmF0dHJpYnV0ZXNbXCJTQ0FMRVwiXSA9IHRoaXMuX2J1aWxkQWNjZXNzb3IoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY2FsZUJ1ZmZlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFjY2Vzc29yVHlwZS5WRUMzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFieWxvbk5vZGUudGhpbkluc3RhbmNlQ291bnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiaW5hcnlXcml0ZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBY2Nlc3NvckNvbXBvbmVudFR5cGUuRkxPQVRcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8qIGVzbGludC1lbmFibGUgQHR5cGVzY3JpcHQtZXNsaW50L25hbWluZy1jb252ZW50aW9uKi9cclxuICAgICAgICAgICAgICAgICAgICBub2RlLmV4dGVuc2lvbnMgPSBub2RlLmV4dGVuc2lvbnMgfHwge307XHJcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5leHRlbnNpb25zW05BTUVdID0gZXh0ZW5zaW9uO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJlc29sdmUobm9kZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfYnVpbGRBY2Nlc3NvcihidWZmZXI6IEZsb2F0MzJBcnJheSwgdHlwZTogQWNjZXNzb3JUeXBlLCBjb3VudDogbnVtYmVyLCBiaW5hcnlXcml0ZXI6IF9CaW5hcnlXcml0ZXIsIGNvbXBvbmVudFR5cGU6IEFjY2Vzc29yQ29tcG9uZW50VHlwZSk6IG51bWJlciB7XHJcbiAgICAgICAgLy8gd3JpdGUgdGhlIGJ1ZmZlclxyXG4gICAgICAgIGNvbnN0IGJ1ZmZlck9mZnNldCA9IGJpbmFyeVdyaXRlci5nZXRCeXRlT2Zmc2V0KCk7XHJcbiAgICAgICAgc3dpdGNoIChjb21wb25lbnRUeXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgQWNjZXNzb3JDb21wb25lbnRUeXBlLkZMT0FUOiB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSAhPSBidWZmZXIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBiaW5hcnlXcml0ZXIuc2V0RmxvYXQzMihidWZmZXJbaV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSBBY2Nlc3NvckNvbXBvbmVudFR5cGUuQllURToge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgIT0gYnVmZmVyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmluYXJ5V3JpdGVyLnNldEJ5dGUoYnVmZmVyW2ldICogMTI3KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhc2UgQWNjZXNzb3JDb21wb25lbnRUeXBlLlNIT1JUOiB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSAhPSBidWZmZXIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBiaW5hcnlXcml0ZXIuc2V0SW50MTYoYnVmZmVyW2ldICogMzI3NjcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGJ1aWxkIHRoZSBidWZmZXIgdmlld1xyXG4gICAgICAgIGNvbnN0IGJ2OiBJQnVmZmVyVmlldyA9IHsgYnVmZmVyOiAwLCBieXRlT2Zmc2V0OiBidWZmZXJPZmZzZXQsIGJ5dGVMZW5ndGg6IGJ1ZmZlci5sZW5ndGggKiBWZXJ0ZXhCdWZmZXIuR2V0VHlwZUJ5dGVMZW5ndGgoY29tcG9uZW50VHlwZSkgfTtcclxuICAgICAgICBjb25zdCBidWZmZXJWaWV3SW5kZXggPSB0aGlzLl9leHBvcnRlci5fYnVmZmVyVmlld3MubGVuZ3RoO1xyXG4gICAgICAgIHRoaXMuX2V4cG9ydGVyLl9idWZmZXJWaWV3cy5wdXNoKGJ2KTtcclxuXHJcbiAgICAgICAgLy8gZmluYWxseSBidWlsZCB0aGUgYWNjZXNzb3JcclxuICAgICAgICBjb25zdCBhY2Nlc3NvckluZGV4ID0gdGhpcy5fZXhwb3J0ZXIuX2FjY2Vzc29ycy5sZW5ndGg7XHJcbiAgICAgICAgY29uc3QgYWNjZXNzb3I6IElBY2Nlc3NvciA9IHtcclxuICAgICAgICAgICAgYnVmZmVyVmlldzogYnVmZmVyVmlld0luZGV4LFxyXG4gICAgICAgICAgICBjb21wb25lbnRUeXBlOiBjb21wb25lbnRUeXBlLFxyXG4gICAgICAgICAgICBjb3VudDogY291bnQsXHJcbiAgICAgICAgICAgIHR5cGU6IHR5cGUsXHJcbiAgICAgICAgICAgIG5vcm1hbGl6ZWQ6IGNvbXBvbmVudFR5cGUgPT0gQWNjZXNzb3JDb21wb25lbnRUeXBlLkJZVEUgfHwgY29tcG9uZW50VHlwZSA9PSBBY2Nlc3NvckNvbXBvbmVudFR5cGUuU0hPUlQsXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLl9leHBvcnRlci5fYWNjZXNzb3JzLnB1c2goYWNjZXNzb3IpO1xyXG4gICAgICAgIHJldHVybiBhY2Nlc3NvckluZGV4O1xyXG4gICAgfVxyXG59XHJcblxyXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVudXNlZC12YXJzXHJcbl9FeHBvcnRlci5SZWdpc3RlckV4dGVuc2lvbihOQU1FLCAoZXhwb3J0ZXIpID0+IG5ldyBFWFRfbWVzaF9ncHVfaW5zdGFuY2luZyhleHBvcnRlcikpO1xyXG4iLCJpbXBvcnQgdHlwZSB7IFNwb3RMaWdodCB9IGZyb20gXCJjb3JlL0xpZ2h0cy9zcG90TGlnaHRcIjtcclxuaW1wb3J0IHR5cGUgeyBOdWxsYWJsZSB9IGZyb20gXCJjb3JlL3R5cGVzXCI7XHJcbmltcG9ydCB7IFZlY3RvcjMsIFF1YXRlcm5pb24sIFRtcFZlY3RvcnMsIE1hdHJpeCB9IGZyb20gXCJjb3JlL01hdGhzL21hdGgudmVjdG9yXCI7XHJcbmltcG9ydCB7IENvbG9yMyB9IGZyb20gXCJjb3JlL01hdGhzL21hdGguY29sb3JcIjtcclxuaW1wb3J0IHsgTGlnaHQgfSBmcm9tIFwiY29yZS9MaWdodHMvbGlnaHRcIjtcclxuaW1wb3J0IHR5cGUgeyBOb2RlIH0gZnJvbSBcImNvcmUvbm9kZVwiO1xyXG5pbXBvcnQgeyBTaGFkb3dMaWdodCB9IGZyb20gXCJjb3JlL0xpZ2h0cy9zaGFkb3dMaWdodFwiO1xyXG5pbXBvcnQgdHlwZSB7IElOb2RlLCBJS0hSTGlnaHRzUHVuY3R1YWxfTGlnaHRSZWZlcmVuY2UsIElLSFJMaWdodHNQdW5jdHVhbF9MaWdodCwgSUtIUkxpZ2h0c1B1bmN0dWFsIH0gZnJvbSBcImJhYnlsb25qcy1nbHRmMmludGVyZmFjZVwiO1xyXG5pbXBvcnQgeyBLSFJMaWdodHNQdW5jdHVhbF9MaWdodFR5cGUgfSBmcm9tIFwiYmFieWxvbmpzLWdsdGYyaW50ZXJmYWNlXCI7XHJcbmltcG9ydCB0eXBlIHsgSUdMVEZFeHBvcnRlckV4dGVuc2lvblYyIH0gZnJvbSBcIi4uL2dsVEZFeHBvcnRlckV4dGVuc2lvblwiO1xyXG5pbXBvcnQgeyBfRXhwb3J0ZXIgfSBmcm9tIFwiLi4vZ2xURkV4cG9ydGVyXCI7XHJcbmltcG9ydCB7IExvZ2dlciB9IGZyb20gXCJjb3JlL01pc2MvbG9nZ2VyXCI7XHJcbmltcG9ydCB7IF9HTFRGVXRpbGl0aWVzIH0gZnJvbSBcIi4uL2dsVEZVdGlsaXRpZXNcIjtcclxuXHJcbmNvbnN0IE5BTUUgPSBcIktIUl9saWdodHNfcHVuY3R1YWxcIjtcclxuXHJcbi8qKlxyXG4gKiBbU3BlY2lmaWNhdGlvbl0oaHR0cHM6Ly9naXRodWIuY29tL0tocm9ub3NHcm91cC9nbFRGL2Jsb2IvbWFzdGVyL2V4dGVuc2lvbnMvMi4wL0tocm9ub3MvS0hSX2xpZ2h0c19wdW5jdHVhbC9SRUFETUUubWQpXHJcbiAqL1xyXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25hbWluZy1jb252ZW50aW9uXHJcbmV4cG9ydCBjbGFzcyBLSFJfbGlnaHRzX3B1bmN0dWFsIGltcGxlbWVudHMgSUdMVEZFeHBvcnRlckV4dGVuc2lvblYyIHtcclxuICAgIC8qKiBUaGUgbmFtZSBvZiB0aGlzIGV4dGVuc2lvbi4gKi9cclxuICAgIHB1YmxpYyByZWFkb25seSBuYW1lID0gTkFNRTtcclxuXHJcbiAgICAvKiogRGVmaW5lcyB3aGV0aGVyIHRoaXMgZXh0ZW5zaW9uIGlzIGVuYWJsZWQuICovXHJcbiAgICBwdWJsaWMgZW5hYmxlZCA9IHRydWU7XHJcblxyXG4gICAgLyoqIERlZmluZXMgd2hldGhlciB0aGlzIGV4dGVuc2lvbiBpcyByZXF1aXJlZCAqL1xyXG4gICAgcHVibGljIHJlcXVpcmVkID0gZmFsc2U7XHJcblxyXG4gICAgLyoqIFJlZmVyZW5jZSB0byB0aGUgZ2xURiBleHBvcnRlciAqL1xyXG4gICAgcHJpdmF0ZSBfZXhwb3J0ZXI6IF9FeHBvcnRlcjtcclxuXHJcbiAgICBwcml2YXRlIF9saWdodHM6IElLSFJMaWdodHNQdW5jdHVhbDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBpbnRlcm5hbFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihleHBvcnRlcjogX0V4cG9ydGVyKSB7XHJcbiAgICAgICAgdGhpcy5fZXhwb3J0ZXIgPSBleHBvcnRlcjtcclxuICAgIH1cclxuXHJcbiAgICAvKiogQGludGVybmFsICovXHJcbiAgICBwdWJsaWMgZGlzcG9zZSgpIHtcclxuICAgICAgICAodGhpcy5fbGlnaHRzIGFzIGFueSkgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAaW50ZXJuYWwgKi9cclxuICAgIHB1YmxpYyBnZXQgd2FzVXNlZCgpIHtcclxuICAgICAgICByZXR1cm4gISF0aGlzLl9saWdodHM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEBpbnRlcm5hbCAqL1xyXG4gICAgcHVibGljIG9uRXhwb3J0aW5nKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX2V4cG9ydGVyIS5fZ2xURi5leHRlbnNpb25zIVtOQU1FXSA9IHRoaXMuX2xpZ2h0cztcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogRGVmaW5lIHRoaXMgbWV0aG9kIHRvIG1vZGlmeSB0aGUgZGVmYXVsdCBiZWhhdmlvciB3aGVuIGV4cG9ydGluZyBhIG5vZGVcclxuICAgICAqIEBwYXJhbSBjb250ZXh0IFRoZSBjb250ZXh0IHdoZW4gZXhwb3J0aW5nIHRoZSBub2RlXHJcbiAgICAgKiBAcGFyYW0gbm9kZSBnbFRGIG5vZGVcclxuICAgICAqIEBwYXJhbSBiYWJ5bG9uTm9kZSBCYWJ5bG9uSlMgbm9kZVxyXG4gICAgICogQHBhcmFtIG5vZGVNYXAgTm9kZSBtYXBwaW5nIG9mIHVuaXF1ZSBpZCB0byBnbFRGIG5vZGUgaW5kZXhcclxuICAgICAqIEByZXR1cm5zIG51bGxhYmxlIElOb2RlIHByb21pc2VcclxuICAgICAqL1xyXG4gICAgcHVibGljIHBvc3RFeHBvcnROb2RlQXN5bmMoY29udGV4dDogc3RyaW5nLCBub2RlOiBOdWxsYWJsZTxJTm9kZT4sIGJhYnlsb25Ob2RlOiBOb2RlLCBub2RlTWFwOiB7IFtrZXk6IG51bWJlcl06IG51bWJlciB9KTogUHJvbWlzZTxOdWxsYWJsZTxJTm9kZT4+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgaWYgKG5vZGUgJiYgYmFieWxvbk5vZGUgaW5zdGFuY2VvZiBTaGFkb3dMaWdodCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGxpZ2h0OiBJS0hSTGlnaHRzUHVuY3R1YWxfTGlnaHQ7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgbGlnaHRUeXBlID1cclxuICAgICAgICAgICAgICAgICAgICBiYWJ5bG9uTm9kZS5nZXRUeXBlSUQoKSA9PSBMaWdodC5MSUdIVFRZUEVJRF9QT0lOVExJR0hUXHJcbiAgICAgICAgICAgICAgICAgICAgICAgID8gS0hSTGlnaHRzUHVuY3R1YWxfTGlnaHRUeXBlLlBPSU5UXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDogYmFieWxvbk5vZGUuZ2V0VHlwZUlEKCkgPT0gTGlnaHQuTElHSFRUWVBFSURfRElSRUNUSU9OQUxMSUdIVFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgID8gS0hSTGlnaHRzUHVuY3R1YWxfTGlnaHRUeXBlLkRJUkVDVElPTkFMXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgOiBiYWJ5bG9uTm9kZS5nZXRUeXBlSUQoKSA9PSBMaWdodC5MSUdIVFRZUEVJRF9TUE9UTElHSFRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gS0hSTGlnaHRzUHVuY3R1YWxfTGlnaHRUeXBlLlNQT1RcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogbnVsbDtcclxuICAgICAgICAgICAgICAgIGlmIChsaWdodFR5cGUgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIExvZ2dlci5XYXJuKGAke2NvbnRleHR9OiBMaWdodCAke2JhYnlsb25Ob2RlLm5hbWV9IGlzIG5vdCBzdXBwb3J0ZWQgaW4gJHtOQU1FfWApO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWJhYnlsb25Ob2RlLnBvc2l0aW9uLmVxdWFsc1RvRmxvYXRzKDAsIDAsIDApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUudHJhbnNsYXRpb24gPSBiYWJ5bG9uTm9kZS5wb3NpdGlvbi5hc0FycmF5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsaWdodFR5cGUgIT09IEtIUkxpZ2h0c1B1bmN0dWFsX0xpZ2h0VHlwZS5QT0lOVCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBsb2NhbEF4aXMgPSBiYWJ5bG9uTm9kZS5kaXJlY3Rpb247XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHlhdyA9IC1NYXRoLmF0YW4yKGxvY2FsQXhpcy56LCBsb2NhbEF4aXMueCkgKyBNYXRoLlBJIC8gMjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbGVuID0gTWF0aC5zcXJ0KGxvY2FsQXhpcy54ICogbG9jYWxBeGlzLnggKyBsb2NhbEF4aXMueiAqIGxvY2FsQXhpcy56KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcGl0Y2ggPSAtTWF0aC5hdGFuMihsb2NhbEF4aXMueSwgbGVuKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbGlnaHRSb3RhdGlvblF1YXRlcm5pb24gPSBRdWF0ZXJuaW9uLlJvdGF0aW9uWWF3UGl0Y2hSb2xsKHlhdyArIE1hdGguUEksIHBpdGNoLCAwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFRdWF0ZXJuaW9uLklzSWRlbnRpdHkobGlnaHRSb3RhdGlvblF1YXRlcm5pb24pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlLnJvdGF0aW9uID0gbGlnaHRSb3RhdGlvblF1YXRlcm5pb24uYXNBcnJheSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoYmFieWxvbk5vZGUuZmFsbG9mZlR5cGUgIT09IExpZ2h0LkZBTExPRkZfR0xURikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBMb2dnZXIuV2FybihgJHtjb250ZXh0fTogTGlnaHQgZmFsbG9mZiBmb3IgJHtiYWJ5bG9uTm9kZS5uYW1lfSBkb2VzIG5vdCBtYXRjaCB0aGUgJHtOQU1FfSBzcGVjaWZpY2F0aW9uIWApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBsaWdodCA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogbGlnaHRUeXBlLFxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFiYWJ5bG9uTm9kZS5kaWZmdXNlLmVxdWFscyhDb2xvcjMuV2hpdGUoKSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGlnaHQuY29sb3IgPSBiYWJ5bG9uTm9kZS5kaWZmdXNlLmFzQXJyYXkoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJhYnlsb25Ob2RlLmludGVuc2l0eSAhPT0gMS4wKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpZ2h0LmludGVuc2l0eSA9IGJhYnlsb25Ob2RlLmludGVuc2l0eTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJhYnlsb25Ob2RlLnJhbmdlICE9PSBOdW1iZXIuTUFYX1ZBTFVFKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpZ2h0LnJhbmdlID0gYmFieWxvbk5vZGUucmFuZ2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAobGlnaHRUeXBlID09PSBLSFJMaWdodHNQdW5jdHVhbF9MaWdodFR5cGUuU1BPVCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBiYWJ5bG9uU3BvdExpZ2h0ID0gYmFieWxvbk5vZGUgYXMgU3BvdExpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYmFieWxvblNwb3RMaWdodC5hbmdsZSAhPT0gTWF0aC5QSSAvIDIuMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxpZ2h0LnNwb3QgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpZ2h0LnNwb3QgPSB7fTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpZ2h0LnNwb3Qub3V0ZXJDb25lQW5nbGUgPSBiYWJ5bG9uU3BvdExpZ2h0LmFuZ2xlIC8gMi4wO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChiYWJ5bG9uU3BvdExpZ2h0LmlubmVyQW5nbGUgIT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsaWdodC5zcG90ID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaWdodC5zcG90ID0ge307XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaWdodC5zcG90LmlubmVyQ29uZUFuZ2xlID0gYmFieWxvblNwb3RMaWdodC5pbm5lckFuZ2xlIC8gMi4wO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9saWdodHMgfHw9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGlnaHRzOiBbXSxcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9saWdodHMubGlnaHRzLnB1c2gobGlnaHQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBsaWdodFJlZmVyZW5jZTogSUtIUkxpZ2h0c1B1bmN0dWFsX0xpZ2h0UmVmZXJlbmNlID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaWdodDogdGhpcy5fbGlnaHRzLmxpZ2h0cy5sZW5ndGggLSAxLFxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIEF2b2lkIGR1cGxpY2F0aW5nIHRoZSBMaWdodCdzIHBhcmVudCBub2RlIGlmIHBvc3NpYmxlLlxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhcmVudEJhYnlsb25Ob2RlID0gYmFieWxvbk5vZGUucGFyZW50O1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJlbnRCYWJ5bG9uTm9kZSAmJiBwYXJlbnRCYWJ5bG9uTm9kZS5nZXRDaGlsZHJlbigpLmxlbmd0aCA9PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhcmVudE5vZGUgPSB0aGlzLl9leHBvcnRlci5fbm9kZXNbbm9kZU1hcFtwYXJlbnRCYWJ5bG9uTm9kZS51bmlxdWVJZF1dO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocGFyZW50Tm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcGFyZW50VHJhbnNsYXRpb24gPSBWZWN0b3IzLkZyb21BcnJheVRvUmVmKHBhcmVudE5vZGUudHJhbnNsYXRpb24gfHwgWzAsIDAsIDBdLCAwLCBUbXBWZWN0b3JzLlZlY3RvcjNbMF0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcGFyZW50Um90YXRpb24gPSBRdWF0ZXJuaW9uLkZyb21BcnJheVRvUmVmKHBhcmVudE5vZGUucm90YXRpb24gfHwgWzAsIDAsIDAsIDFdLCAwLCBUbXBWZWN0b3JzLlF1YXRlcm5pb25bMF0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcGFyZW50U2NhbGUgPSBWZWN0b3IzLkZyb21BcnJheVRvUmVmKHBhcmVudE5vZGUuc2NhbGUgfHwgWzEsIDEsIDFdLCAwLCBUbXBWZWN0b3JzLlZlY3RvcjNbMV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcGFyZW50TWF0cml4ID0gTWF0cml4LkNvbXBvc2VUb1JlZihwYXJlbnRTY2FsZSwgcGFyZW50Um90YXRpb24sIHBhcmVudFRyYW5zbGF0aW9uLCBUbXBWZWN0b3JzLk1hdHJpeFswXSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdHJhbnNsYXRpb24gPSBWZWN0b3IzLkZyb21BcnJheVRvUmVmKG5vZGUudHJhbnNsYXRpb24gfHwgWzAsIDAsIDBdLCAwLCBUbXBWZWN0b3JzLlZlY3RvcjNbMl0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgcm90YXRpb24gPSBRdWF0ZXJuaW9uLkZyb21BcnJheVRvUmVmKG5vZGUucm90YXRpb24gfHwgWzAsIDAsIDAsIDFdLCAwLCBUbXBWZWN0b3JzLlF1YXRlcm5pb25bMV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbWF0cml4ID0gTWF0cml4LkNvbXBvc2VUb1JlZihWZWN0b3IzLk9uZVJlYWRPbmx5LCByb3RhdGlvbiwgdHJhbnNsYXRpb24sIFRtcFZlY3RvcnMuTWF0cml4WzFdKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnRNYXRyaXgubXVsdGlwbHlUb1JlZihtYXRyaXgsIG1hdHJpeCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRyaXguZGVjb21wb3NlKHBhcmVudFNjYWxlLCBwYXJlbnRSb3RhdGlvbiwgcGFyZW50VHJhbnNsYXRpb24pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJlbnRUcmFuc2xhdGlvbi5lcXVhbHNUb0Zsb2F0cygwLCAwLCAwKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBwYXJlbnROb2RlLnRyYW5zbGF0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnROb2RlLnRyYW5zbGF0aW9uID0gcGFyZW50VHJhbnNsYXRpb24uYXNBcnJheSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChRdWF0ZXJuaW9uLklzSWRlbnRpdHkocGFyZW50Um90YXRpb24pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHBhcmVudE5vZGUucm90YXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudE5vZGUucm90YXRpb24gPSBwYXJlbnRSb3RhdGlvbi5hc0FycmF5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhcmVudFNjYWxlLmVxdWFsc1RvRmxvYXRzKDEsIDEsIDEpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHBhcmVudE5vZGUuc2NhbGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudE5vZGUuc2NhbGUgPSBwYXJlbnRTY2FsZS5hc0FycmF5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50Tm9kZS5leHRlbnNpb25zIHx8PSB7fTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudE5vZGUuZXh0ZW5zaW9uc1tOQU1FXSA9IGxpZ2h0UmVmZXJlbmNlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIERvIG5vdCBleHBvcnQgdGhlIG9yaWdpbmFsIG5vZGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUobnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG5vZGUuZXh0ZW5zaW9ucyB8fD0ge307XHJcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5leHRlbnNpb25zW05BTUVdID0gbGlnaHRSZWZlcmVuY2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmVzb2x2ZShub2RlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cclxuX0V4cG9ydGVyLlJlZ2lzdGVyRXh0ZW5zaW9uKE5BTUUsIChleHBvcnRlcikgPT4gbmV3IEtIUl9saWdodHNfcHVuY3R1YWwoZXhwb3J0ZXIpKTtcclxuIiwiaW1wb3J0IHR5cGUgeyBJTWF0ZXJpYWwsIElLSFJNYXRlcmlhbHNBbmlzb3Ryb3B5IH0gZnJvbSBcImJhYnlsb25qcy1nbHRmMmludGVyZmFjZVwiO1xyXG5pbXBvcnQgdHlwZSB7IElHTFRGRXhwb3J0ZXJFeHRlbnNpb25WMiB9IGZyb20gXCIuLi9nbFRGRXhwb3J0ZXJFeHRlbnNpb25cIjtcclxuaW1wb3J0IHsgX0V4cG9ydGVyIH0gZnJvbSBcIi4uL2dsVEZFeHBvcnRlclwiO1xyXG5pbXBvcnQgdHlwZSB7IE1hdGVyaWFsIH0gZnJvbSBcImNvcmUvTWF0ZXJpYWxzL21hdGVyaWFsXCI7XHJcbmltcG9ydCB7IFBCUkJhc2VNYXRlcmlhbCB9IGZyb20gXCJjb3JlL01hdGVyaWFscy9QQlIvcGJyQmFzZU1hdGVyaWFsXCI7XHJcbmltcG9ydCB0eXBlIHsgQmFzZVRleHR1cmUgfSBmcm9tIFwiY29yZS9NYXRlcmlhbHMvVGV4dHVyZXMvYmFzZVRleHR1cmVcIjtcclxuXHJcbmNvbnN0IE5BTUUgPSBcIktIUl9tYXRlcmlhbHNfYW5pc290cm9weVwiO1xyXG5cclxuLyoqXHJcbiAqIEBpbnRlcm5hbFxyXG4gKi9cclxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uYW1pbmctY29udmVudGlvblxyXG5leHBvcnQgY2xhc3MgS0hSX21hdGVyaWFsc19hbmlzb3Ryb3B5IGltcGxlbWVudHMgSUdMVEZFeHBvcnRlckV4dGVuc2lvblYyIHtcclxuICAgIC8qKiBOYW1lIG9mIHRoaXMgZXh0ZW5zaW9uICovXHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgbmFtZSA9IE5BTUU7XHJcblxyXG4gICAgLyoqIERlZmluZXMgd2hldGhlciB0aGlzIGV4dGVuc2lvbiBpcyBlbmFibGVkICovXHJcbiAgICBwdWJsaWMgZW5hYmxlZCA9IHRydWU7XHJcblxyXG4gICAgLyoqIERlZmluZXMgd2hldGhlciB0aGlzIGV4dGVuc2lvbiBpcyByZXF1aXJlZCAqL1xyXG4gICAgcHVibGljIHJlcXVpcmVkID0gZmFsc2U7XHJcblxyXG4gICAgcHJpdmF0ZSBfZXhwb3J0ZXI6IF9FeHBvcnRlcjtcclxuXHJcbiAgICBwcml2YXRlIF93YXNVc2VkID0gZmFsc2U7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZXhwb3J0ZXI6IF9FeHBvcnRlcikge1xyXG4gICAgICAgIHRoaXMuX2V4cG9ydGVyID0gZXhwb3J0ZXI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRpc3Bvc2UoKSB7fVxyXG5cclxuICAgIC8qKiBAaW50ZXJuYWwgKi9cclxuICAgIHB1YmxpYyBnZXQgd2FzVXNlZCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fd2FzVXNlZDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcG9zdEV4cG9ydE1hdGVyaWFsQWRkaXRpb25hbFRleHR1cmVzPyhjb250ZXh0OiBzdHJpbmcsIG5vZGU6IElNYXRlcmlhbCwgYmFieWxvbk1hdGVyaWFsOiBNYXRlcmlhbCk6IEJhc2VUZXh0dXJlW10ge1xyXG4gICAgICAgIGNvbnN0IGFkZGl0aW9uYWxUZXh0dXJlczogQmFzZVRleHR1cmVbXSA9IFtdO1xyXG4gICAgICAgIGlmIChiYWJ5bG9uTWF0ZXJpYWwgaW5zdGFuY2VvZiBQQlJCYXNlTWF0ZXJpYWwpIHtcclxuICAgICAgICAgICAgaWYgKGJhYnlsb25NYXRlcmlhbC5hbmlzb3Ryb3B5LmlzRW5hYmxlZCAmJiAhYmFieWxvbk1hdGVyaWFsLmFuaXNvdHJvcHkubGVnYWN5KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYmFieWxvbk1hdGVyaWFsLmFuaXNvdHJvcHkudGV4dHVyZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFkZGl0aW9uYWxUZXh0dXJlcy5wdXNoKGJhYnlsb25NYXRlcmlhbC5hbmlzb3Ryb3B5LnRleHR1cmUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFkZGl0aW9uYWxUZXh0dXJlcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBwb3N0RXhwb3J0TWF0ZXJpYWxBc3luYz8oY29udGV4dDogc3RyaW5nLCBub2RlOiBJTWF0ZXJpYWwsIGJhYnlsb25NYXRlcmlhbDogTWF0ZXJpYWwpOiBQcm9taXNlPElNYXRlcmlhbD4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoYmFieWxvbk1hdGVyaWFsIGluc3RhbmNlb2YgUEJSQmFzZU1hdGVyaWFsKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWJhYnlsb25NYXRlcmlhbC5hbmlzb3Ryb3B5LmlzRW5hYmxlZCB8fCBiYWJ5bG9uTWF0ZXJpYWwuYW5pc290cm9weS5sZWdhY3kpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLl93YXNVc2VkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICBub2RlLmV4dGVuc2lvbnMgPSBub2RlLmV4dGVuc2lvbnMgfHwge307XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgYW5pc290cm9weVRleHR1cmVJbmZvID0gdGhpcy5fZXhwb3J0ZXIuX2dsVEZNYXRlcmlhbEV4cG9ydGVyLl9nZXRUZXh0dXJlSW5mbyhiYWJ5bG9uTWF0ZXJpYWwuYW5pc290cm9weS50ZXh0dXJlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBhbmlzb3Ryb3B5SW5mbzogSUtIUk1hdGVyaWFsc0FuaXNvdHJvcHkgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYW5pc290cm9weVN0cmVuZ3RoOiBiYWJ5bG9uTWF0ZXJpYWwuYW5pc290cm9weS5pbnRlbnNpdHksXHJcbiAgICAgICAgICAgICAgICAgICAgYW5pc290cm9weVJvdGF0aW9uOiBiYWJ5bG9uTWF0ZXJpYWwuYW5pc290cm9weS5hbmdsZSxcclxuICAgICAgICAgICAgICAgICAgICBhbmlzb3Ryb3B5VGV4dHVyZTogYW5pc290cm9weVRleHR1cmVJbmZvID8/IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgICAgICBoYXNUZXh0dXJlczogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYW5pc290cm9weUluZm8uYW5pc290cm9weVRleHR1cmUgIT09IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgbm9kZS5leHRlbnNpb25zW05BTUVdID0gYW5pc290cm9weUluZm87XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmVzb2x2ZShub2RlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cclxuX0V4cG9ydGVyLlJlZ2lzdGVyRXh0ZW5zaW9uKE5BTUUsIChleHBvcnRlcikgPT4gbmV3IEtIUl9tYXRlcmlhbHNfYW5pc290cm9weShleHBvcnRlcikpO1xyXG4iLCJpbXBvcnQgdHlwZSB7IElNYXRlcmlhbCwgSUtIUk1hdGVyaWFsc0NsZWFyY29hdCB9IGZyb20gXCJiYWJ5bG9uanMtZ2x0ZjJpbnRlcmZhY2VcIjtcclxuaW1wb3J0IHR5cGUgeyBJR0xURkV4cG9ydGVyRXh0ZW5zaW9uVjIgfSBmcm9tIFwiLi4vZ2xURkV4cG9ydGVyRXh0ZW5zaW9uXCI7XHJcbmltcG9ydCB7IF9FeHBvcnRlciB9IGZyb20gXCIuLi9nbFRGRXhwb3J0ZXJcIjtcclxuaW1wb3J0IHR5cGUgeyBNYXRlcmlhbCB9IGZyb20gXCJjb3JlL01hdGVyaWFscy9tYXRlcmlhbFwiO1xyXG5pbXBvcnQgeyBQQlJCYXNlTWF0ZXJpYWwgfSBmcm9tIFwiY29yZS9NYXRlcmlhbHMvUEJSL3BickJhc2VNYXRlcmlhbFwiO1xyXG5pbXBvcnQgdHlwZSB7IEJhc2VUZXh0dXJlIH0gZnJvbSBcImNvcmUvTWF0ZXJpYWxzL1RleHR1cmVzL2Jhc2VUZXh0dXJlXCI7XHJcblxyXG5pbXBvcnQgeyBUb29scyB9IGZyb20gXCJjb3JlL01pc2MvdG9vbHNcIjtcclxuXHJcbmNvbnN0IE5BTUUgPSBcIktIUl9tYXRlcmlhbHNfY2xlYXJjb2F0XCI7XHJcblxyXG4vKipcclxuICogQGludGVybmFsXHJcbiAqL1xyXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25hbWluZy1jb252ZW50aW9uXHJcbmV4cG9ydCBjbGFzcyBLSFJfbWF0ZXJpYWxzX2NsZWFyY29hdCBpbXBsZW1lbnRzIElHTFRGRXhwb3J0ZXJFeHRlbnNpb25WMiB7XHJcbiAgICAvKiogTmFtZSBvZiB0aGlzIGV4dGVuc2lvbiAqL1xyXG4gICAgcHVibGljIHJlYWRvbmx5IG5hbWUgPSBOQU1FO1xyXG5cclxuICAgIC8qKiBEZWZpbmVzIHdoZXRoZXIgdGhpcyBleHRlbnNpb24gaXMgZW5hYmxlZCAqL1xyXG4gICAgcHVibGljIGVuYWJsZWQgPSB0cnVlO1xyXG5cclxuICAgIC8qKiBEZWZpbmVzIHdoZXRoZXIgdGhpcyBleHRlbnNpb24gaXMgcmVxdWlyZWQgKi9cclxuICAgIHB1YmxpYyByZXF1aXJlZCA9IGZhbHNlO1xyXG5cclxuICAgIHByaXZhdGUgX2V4cG9ydGVyOiBfRXhwb3J0ZXI7XHJcblxyXG4gICAgcHJpdmF0ZSBfd2FzVXNlZCA9IGZhbHNlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGV4cG9ydGVyOiBfRXhwb3J0ZXIpIHtcclxuICAgICAgICB0aGlzLl9leHBvcnRlciA9IGV4cG9ydGVyO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkaXNwb3NlKCkge31cclxuXHJcbiAgICAvKiogQGludGVybmFsICovXHJcbiAgICBwdWJsaWMgZ2V0IHdhc1VzZWQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3dhc1VzZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHBvc3RFeHBvcnRNYXRlcmlhbEFkZGl0aW9uYWxUZXh0dXJlcz8oY29udGV4dDogc3RyaW5nLCBub2RlOiBJTWF0ZXJpYWwsIGJhYnlsb25NYXRlcmlhbDogTWF0ZXJpYWwpOiBCYXNlVGV4dHVyZVtdIHtcclxuICAgICAgICBjb25zdCBhZGRpdGlvbmFsVGV4dHVyZXM6IEJhc2VUZXh0dXJlW10gPSBbXTtcclxuICAgICAgICBpZiAoYmFieWxvbk1hdGVyaWFsIGluc3RhbmNlb2YgUEJSQmFzZU1hdGVyaWFsKSB7XHJcbiAgICAgICAgICAgIGlmIChiYWJ5bG9uTWF0ZXJpYWwuY2xlYXJDb2F0LmlzRW5hYmxlZCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGJhYnlsb25NYXRlcmlhbC5jbGVhckNvYXQudGV4dHVyZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFkZGl0aW9uYWxUZXh0dXJlcy5wdXNoKGJhYnlsb25NYXRlcmlhbC5jbGVhckNvYXQudGV4dHVyZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoIWJhYnlsb25NYXRlcmlhbC5jbGVhckNvYXQudXNlUm91Z2huZXNzRnJvbU1haW5UZXh0dXJlICYmIGJhYnlsb25NYXRlcmlhbC5jbGVhckNvYXQudGV4dHVyZVJvdWdobmVzcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGFkZGl0aW9uYWxUZXh0dXJlcy5wdXNoKGJhYnlsb25NYXRlcmlhbC5jbGVhckNvYXQudGV4dHVyZVJvdWdobmVzcyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoYmFieWxvbk1hdGVyaWFsLmNsZWFyQ29hdC5idW1wVGV4dHVyZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFkZGl0aW9uYWxUZXh0dXJlcy5wdXNoKGJhYnlsb25NYXRlcmlhbC5jbGVhckNvYXQuYnVtcFRleHR1cmUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFkZGl0aW9uYWxUZXh0dXJlcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBwb3N0RXhwb3J0TWF0ZXJpYWxBc3luYz8oY29udGV4dDogc3RyaW5nLCBub2RlOiBJTWF0ZXJpYWwsIGJhYnlsb25NYXRlcmlhbDogTWF0ZXJpYWwpOiBQcm9taXNlPElNYXRlcmlhbD4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoYmFieWxvbk1hdGVyaWFsIGluc3RhbmNlb2YgUEJSQmFzZU1hdGVyaWFsKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWJhYnlsb25NYXRlcmlhbC5jbGVhckNvYXQuaXNFbmFibGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShub2RlKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5fd2FzVXNlZCA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgbm9kZS5leHRlbnNpb25zID0gbm9kZS5leHRlbnNpb25zIHx8IHt9O1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGNsZWFyQ29hdFRleHR1cmVJbmZvID0gdGhpcy5fZXhwb3J0ZXIuX2dsVEZNYXRlcmlhbEV4cG9ydGVyLl9nZXRUZXh0dXJlSW5mbyhiYWJ5bG9uTWF0ZXJpYWwuY2xlYXJDb2F0LnRleHR1cmUpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGNsZWFyQ29hdFRleHR1cmVSb3VnaG5lc3NJbmZvO1xyXG4gICAgICAgICAgICAgICAgaWYgKGJhYnlsb25NYXRlcmlhbC5jbGVhckNvYXQudXNlUm91Z2huZXNzRnJvbU1haW5UZXh0dXJlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJDb2F0VGV4dHVyZVJvdWdobmVzc0luZm8gPSB0aGlzLl9leHBvcnRlci5fZ2xURk1hdGVyaWFsRXhwb3J0ZXIuX2dldFRleHR1cmVJbmZvKGJhYnlsb25NYXRlcmlhbC5jbGVhckNvYXQudGV4dHVyZSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNsZWFyQ29hdFRleHR1cmVSb3VnaG5lc3NJbmZvID0gdGhpcy5fZXhwb3J0ZXIuX2dsVEZNYXRlcmlhbEV4cG9ydGVyLl9nZXRUZXh0dXJlSW5mbyhiYWJ5bG9uTWF0ZXJpYWwuY2xlYXJDb2F0LnRleHR1cmVSb3VnaG5lc3MpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChiYWJ5bG9uTWF0ZXJpYWwuY2xlYXJDb2F0LmlzVGludEVuYWJsZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBUb29scy5XYXJuKGBDbGVhciBDb2xvciB0aW50IGlzIG5vdCBzdXBwb3J0ZWQgZm9yIGdsVEYgZXhwb3J0LiBJZ25vcmluZyBmb3I6ICR7YmFieWxvbk1hdGVyaWFsLm5hbWV9YCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGJhYnlsb25NYXRlcmlhbC5jbGVhckNvYXQucmVtYXBGME9uSW50ZXJmYWNlQ2hhbmdlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgVG9vbHMuV2FybihgQ2xlYXIgQ29sb3IgRjAgcmVtYXBwaW5nIGlzIG5vdCBzdXBwb3J0ZWQgZm9yIGdsVEYgZXhwb3J0LiBJZ25vcmluZyBmb3I6ICR7YmFieWxvbk1hdGVyaWFsLm5hbWV9YCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgY2xlYXJDb2F0Tm9ybWFsVGV4dHVyZUluZm8gPSB0aGlzLl9leHBvcnRlci5fZ2xURk1hdGVyaWFsRXhwb3J0ZXIuX2dldFRleHR1cmVJbmZvKGJhYnlsb25NYXRlcmlhbC5jbGVhckNvYXQuYnVtcFRleHR1cmUpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGNsZWFyQ29hdEluZm86IElLSFJNYXRlcmlhbHNDbGVhcmNvYXQgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJjb2F0RmFjdG9yOiBiYWJ5bG9uTWF0ZXJpYWwuY2xlYXJDb2F0LmludGVuc2l0eSxcclxuICAgICAgICAgICAgICAgICAgICBjbGVhcmNvYXRUZXh0dXJlOiBjbGVhckNvYXRUZXh0dXJlSW5mbyA/PyB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJjb2F0Um91Z2huZXNzRmFjdG9yOiBiYWJ5bG9uTWF0ZXJpYWwuY2xlYXJDb2F0LnJvdWdobmVzcyxcclxuICAgICAgICAgICAgICAgICAgICBjbGVhcmNvYXRSb3VnaG5lc3NUZXh0dXJlOiBjbGVhckNvYXRUZXh0dXJlUm91Z2huZXNzSW5mbyA/PyB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJjb2F0Tm9ybWFsVGV4dHVyZTogY2xlYXJDb2F0Tm9ybWFsVGV4dHVyZUluZm8gPz8gdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgICAgIGhhc1RleHR1cmVzOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjbGVhckNvYXRJbmZvLmNsZWFyY29hdFRleHR1cmUgIT09IG51bGwgfHwgY2xlYXJDb2F0SW5mby5jbGVhcmNvYXRSb3VnaG5lc3NUZXh0dXJlICE9PSBudWxsIHx8IGNsZWFyQ29hdEluZm8uY2xlYXJjb2F0Um91Z2huZXNzVGV4dHVyZSAhPT0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICBub2RlLmV4dGVuc2lvbnNbTkFNRV0gPSBjbGVhckNvYXRJbmZvO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJlc29sdmUobm9kZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbl9FeHBvcnRlci5SZWdpc3RlckV4dGVuc2lvbihOQU1FLCAoZXhwb3J0ZXIpID0+IG5ldyBLSFJfbWF0ZXJpYWxzX2NsZWFyY29hdChleHBvcnRlcikpO1xyXG4iLCJpbXBvcnQgdHlwZSB7IElNYXRlcmlhbCwgSUtIUk1hdGVyaWFsc0RpZmZ1c2VUcmFuc21pc3Npb24gfSBmcm9tIFwiYmFieWxvbmpzLWdsdGYyaW50ZXJmYWNlXCI7XHJcbmltcG9ydCB0eXBlIHsgSUdMVEZFeHBvcnRlckV4dGVuc2lvblYyIH0gZnJvbSBcIi4uL2dsVEZFeHBvcnRlckV4dGVuc2lvblwiO1xyXG5pbXBvcnQgeyBfRXhwb3J0ZXIgfSBmcm9tIFwiLi4vZ2xURkV4cG9ydGVyXCI7XHJcbmltcG9ydCB0eXBlIHsgTWF0ZXJpYWwgfSBmcm9tIFwiY29yZS9NYXRlcmlhbHMvbWF0ZXJpYWxcIjtcclxuaW1wb3J0IHsgUEJSTWF0ZXJpYWwgfSBmcm9tIFwiY29yZS9NYXRlcmlhbHMvUEJSL3Bick1hdGVyaWFsXCI7XHJcbmltcG9ydCB0eXBlIHsgQmFzZVRleHR1cmUgfSBmcm9tIFwiY29yZS9NYXRlcmlhbHMvVGV4dHVyZXMvYmFzZVRleHR1cmVcIjtcclxuXHJcbmNvbnN0IE5BTUUgPSBcIktIUl9tYXRlcmlhbHNfZGlmZnVzZV90cmFuc21pc3Npb25cIjtcclxuXHJcbi8qKlxyXG4gKiBbUHJvcG9zZWQgU3BlY2lmaWNhdGlvbl0oaHR0cHM6Ly9naXRodWIuY29tL0tocm9ub3NHcm91cC9nbFRGL3B1bGwvMTgyNSlcclxuICogISEhIEV4cGVyaW1lbnRhbCBFeHRlbnNpb24gU3ViamVjdCB0byBDaGFuZ2VzICEhIVxyXG4gKi9cclxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uYW1pbmctY29udmVudGlvblxyXG5leHBvcnQgY2xhc3MgS0hSX21hdGVyaWFsc19kaWZmdXNlX3RyYW5zbWlzc2lvbiBpbXBsZW1lbnRzIElHTFRGRXhwb3J0ZXJFeHRlbnNpb25WMiB7XHJcbiAgICAvKiogTmFtZSBvZiB0aGlzIGV4dGVuc2lvbiAqL1xyXG4gICAgcHVibGljIHJlYWRvbmx5IG5hbWUgPSBOQU1FO1xyXG5cclxuICAgIC8qKiBEZWZpbmVzIHdoZXRoZXIgdGhpcyBleHRlbnNpb24gaXMgZW5hYmxlZCAqL1xyXG4gICAgcHVibGljIGVuYWJsZWQgPSB0cnVlO1xyXG5cclxuICAgIC8qKiBEZWZpbmVzIHdoZXRoZXIgdGhpcyBleHRlbnNpb24gaXMgcmVxdWlyZWQgKi9cclxuICAgIHB1YmxpYyByZXF1aXJlZCA9IGZhbHNlO1xyXG5cclxuICAgIHByaXZhdGUgX2V4cG9ydGVyOiBfRXhwb3J0ZXI7XHJcblxyXG4gICAgcHJpdmF0ZSBfd2FzVXNlZCA9IGZhbHNlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGV4cG9ydGVyOiBfRXhwb3J0ZXIpIHtcclxuICAgICAgICB0aGlzLl9leHBvcnRlciA9IGV4cG9ydGVyO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkaXNwb3NlKCkge31cclxuXHJcbiAgICAvKiogQGludGVybmFsICovXHJcbiAgICBwdWJsaWMgZ2V0IHdhc1VzZWQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3dhc1VzZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZnRlciBleHBvcnRpbmcgYSBtYXRlcmlhbCwgZGVhbCB3aXRoIGFkZGl0aW9uYWwgdGV4dHVyZXNcclxuICAgICAqIEBwYXJhbSBjb250ZXh0IEdMVEYgY29udGV4dCBvZiB0aGUgbWF0ZXJpYWxcclxuICAgICAqIEBwYXJhbSBub2RlIGV4cG9ydGVkIEdMVEYgbm9kZVxyXG4gICAgICogQHBhcmFtIGJhYnlsb25NYXRlcmlhbCBjb3JyZXNwb25kaW5nIGJhYnlsb24gbWF0ZXJpYWxcclxuICAgICAqIEByZXR1cm5zIGFycmF5IG9mIGFkZGl0aW9uYWwgdGV4dHVyZXMgdG8gZXhwb3J0XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBwb3N0RXhwb3J0TWF0ZXJpYWxBZGRpdGlvbmFsVGV4dHVyZXM/KGNvbnRleHQ6IHN0cmluZywgbm9kZTogSU1hdGVyaWFsLCBiYWJ5bG9uTWF0ZXJpYWw6IE1hdGVyaWFsKTogQmFzZVRleHR1cmVbXSB7XHJcbiAgICAgICAgY29uc3QgYWRkaXRpb25hbFRleHR1cmVzOiBCYXNlVGV4dHVyZVtdID0gW107XHJcblxyXG4gICAgICAgIGlmIChiYWJ5bG9uTWF0ZXJpYWwgaW5zdGFuY2VvZiBQQlJNYXRlcmlhbCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5faXNFeHRlbnNpb25FbmFibGVkKGJhYnlsb25NYXRlcmlhbCkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChiYWJ5bG9uTWF0ZXJpYWwuc3ViU3VyZmFjZS50aGlja25lc3NUZXh0dXJlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWRkaXRpb25hbFRleHR1cmVzLnB1c2goYmFieWxvbk1hdGVyaWFsLnN1YlN1cmZhY2UudGhpY2tuZXNzVGV4dHVyZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYWRkaXRpb25hbFRleHR1cmVzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gYWRkaXRpb25hbFRleHR1cmVzO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2lzRXh0ZW5zaW9uRW5hYmxlZChtYXQ6IFBCUk1hdGVyaWFsKTogYm9vbGVhbiB7XHJcbiAgICAgICAgLy8gVGhpcyBleHRlbnNpb24gbXVzdCBub3QgYmUgdXNlZCBvbiBhIG1hdGVyaWFsIHRoYXQgYWxzbyB1c2VzIEtIUl9tYXRlcmlhbHNfdW5saXRcclxuICAgICAgICBpZiAobWF0LnVubGl0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3Qgc3VicyA9IG1hdC5zdWJTdXJmYWNlO1xyXG4gICAgICAgIGlmICghc3Vicy5pc1RyYW5zbHVjZW5jeUVuYWJsZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgIW1hdC51bmxpdCAmJlxyXG4gICAgICAgICAgICAhc3Vicy51c2VBbGJlZG9Ub1RpbnRUcmFuc2x1Y2VuY3kgJiZcclxuICAgICAgICAgICAgc3Vicy51c2VHbHRmU3R5bGVUZXh0dXJlcyAmJlxyXG4gICAgICAgICAgICBzdWJzLnZvbHVtZUluZGV4T2ZSZWZyYWN0aW9uID09PSAxICYmXHJcbiAgICAgICAgICAgIHN1YnMubWluaW11bVRoaWNrbmVzcyA9PT0gMCAmJlxyXG4gICAgICAgICAgICBzdWJzLm1heGltdW1UaGlja25lc3MgPT09IDBcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2hhc1RleHR1cmVzRXh0ZW5zaW9uKG1hdDogUEJSTWF0ZXJpYWwpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gbWF0LnN1YlN1cmZhY2UudHJhbnNsdWNlbmN5SW50ZW5zaXR5VGV4dHVyZSAhPSBudWxsIHx8IG1hdC5zdWJTdXJmYWNlLnRyYW5zbHVjZW5jeUNvbG9yVGV4dHVyZSAhPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWZ0ZXIgZXhwb3J0aW5nIGEgbWF0ZXJpYWxcclxuICAgICAqIEBwYXJhbSBjb250ZXh0IEdMVEYgY29udGV4dCBvZiB0aGUgbWF0ZXJpYWxcclxuICAgICAqIEBwYXJhbSBub2RlIGV4cG9ydGVkIEdMVEYgbm9kZVxyXG4gICAgICogQHBhcmFtIGJhYnlsb25NYXRlcmlhbCBjb3JyZXNwb25kaW5nIGJhYnlsb24gbWF0ZXJpYWxcclxuICAgICAqIEByZXR1cm5zIHByb21pc2UgdGhhdCByZXNvbHZlcyB3aXRoIHRoZSB1cGRhdGVkIG5vZGVcclxuICAgICAqL1xyXG4gICAgcHVibGljIHBvc3RFeHBvcnRNYXRlcmlhbEFzeW5jPyhjb250ZXh0OiBzdHJpbmcsIG5vZGU6IElNYXRlcmlhbCwgYmFieWxvbk1hdGVyaWFsOiBNYXRlcmlhbCk6IFByb21pc2U8SU1hdGVyaWFsPiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChiYWJ5bG9uTWF0ZXJpYWwgaW5zdGFuY2VvZiBQQlJNYXRlcmlhbCAmJiB0aGlzLl9pc0V4dGVuc2lvbkVuYWJsZWQoYmFieWxvbk1hdGVyaWFsKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fd2FzVXNlZCA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3Qgc3VicyA9IGJhYnlsb25NYXRlcmlhbC5zdWJTdXJmYWNlO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGRpZmZ1c2VUcmFuc21pc3Npb25GYWN0b3IgPSBzdWJzLnRyYW5zbHVjZW5jeUludGVuc2l0eSA9PSAxID8gdW5kZWZpbmVkIDogc3Vicy50cmFuc2x1Y2VuY3lJbnRlbnNpdHk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkaWZmdXNlVHJhbnNtaXNzaW9uVGV4dHVyZSA9IHRoaXMuX2V4cG9ydGVyLl9nbFRGTWF0ZXJpYWxFeHBvcnRlci5fZ2V0VGV4dHVyZUluZm8oc3Vicy50cmFuc2x1Y2VuY3lJbnRlbnNpdHlUZXh0dXJlKSA/PyB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkaWZmdXNlVHJhbnNtaXNzaW9uQ29sb3JGYWN0b3IgPSAhc3Vicy50cmFuc2x1Y2VuY3lDb2xvciB8fCBzdWJzLnRyYW5zbHVjZW5jeUNvbG9yLmVxdWFsc0Zsb2F0cygxLjAsIDEuMCwgMS4wKSA/IHVuZGVmaW5lZCA6IHN1YnMudHJhbnNsdWNlbmN5Q29sb3IuYXNBcnJheSgpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZGlmZnVzZVRyYW5zbWlzc2lvbkNvbG9yVGV4dHVyZSA9IHRoaXMuX2V4cG9ydGVyLl9nbFRGTWF0ZXJpYWxFeHBvcnRlci5fZ2V0VGV4dHVyZUluZm8oc3Vicy50cmFuc2x1Y2VuY3lDb2xvclRleHR1cmUpID8/IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBkaWZmdXNlVHJhbnNtaXNzaW9uSW5mbzogSUtIUk1hdGVyaWFsc0RpZmZ1c2VUcmFuc21pc3Npb24gPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlmZnVzZVRyYW5zbWlzc2lvbkZhY3RvcixcclxuICAgICAgICAgICAgICAgICAgICBkaWZmdXNlVHJhbnNtaXNzaW9uVGV4dHVyZSxcclxuICAgICAgICAgICAgICAgICAgICBkaWZmdXNlVHJhbnNtaXNzaW9uQ29sb3JGYWN0b3IsXHJcbiAgICAgICAgICAgICAgICAgICAgZGlmZnVzZVRyYW5zbWlzc2lvbkNvbG9yVGV4dHVyZSxcclxuICAgICAgICAgICAgICAgICAgICBoYXNUZXh0dXJlczogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5faGFzVGV4dHVyZXNFeHRlbnNpb24oYmFieWxvbk1hdGVyaWFsKTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIG5vZGUuZXh0ZW5zaW9ucyA9IG5vZGUuZXh0ZW5zaW9ucyB8fCB7fTtcclxuICAgICAgICAgICAgICAgIG5vZGUuZXh0ZW5zaW9uc1tOQU1FXSA9IGRpZmZ1c2VUcmFuc21pc3Npb25JbmZvO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJlc29sdmUobm9kZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbl9FeHBvcnRlci5SZWdpc3RlckV4dGVuc2lvbihOQU1FLCAoZXhwb3J0ZXIpID0+IG5ldyBLSFJfbWF0ZXJpYWxzX2RpZmZ1c2VfdHJhbnNtaXNzaW9uKGV4cG9ydGVyKSk7XHJcbiIsImltcG9ydCB0eXBlIHsgSU1hdGVyaWFsLCBJS0hSTWF0ZXJpYWxzRGlzcGVyc2lvbiB9IGZyb20gXCJiYWJ5bG9uanMtZ2x0ZjJpbnRlcmZhY2VcIjtcclxuaW1wb3J0IHR5cGUgeyBJR0xURkV4cG9ydGVyRXh0ZW5zaW9uVjIgfSBmcm9tIFwiLi4vZ2xURkV4cG9ydGVyRXh0ZW5zaW9uXCI7XHJcbmltcG9ydCB7IF9FeHBvcnRlciB9IGZyb20gXCIuLi9nbFRGRXhwb3J0ZXJcIjtcclxuaW1wb3J0IHR5cGUgeyBNYXRlcmlhbCB9IGZyb20gXCJjb3JlL01hdGVyaWFscy9tYXRlcmlhbFwiO1xyXG5pbXBvcnQgeyBQQlJNYXRlcmlhbCB9IGZyb20gXCJjb3JlL01hdGVyaWFscy9QQlIvcGJyTWF0ZXJpYWxcIjtcclxuXHJcbmNvbnN0IE5BTUUgPSBcIktIUl9tYXRlcmlhbHNfZGlzcGVyc2lvblwiO1xyXG5cclxuLyoqXHJcbiAqIFtTcGVjaWZpY2F0aW9uXShodHRwczovL2dpdGh1Yi5jb20vS2hyb25vc0dyb3VwL2dsVEYvYmxvYi84N2JkNjRhN2Y1ZTIzYzg0YjZhZWYyZTYwODIwNjk1ODNlZDBkZGI0L2V4dGVuc2lvbnMvMi4wL0tocm9ub3MvS0hSX21hdGVyaWFsc19kaXNwZXJzaW9uL1JFQURNRS5tZClcclxuICogQGV4cGVyaW1lbnRhbFxyXG4gKi9cclxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uYW1pbmctY29udmVudGlvblxyXG5leHBvcnQgY2xhc3MgS0hSX21hdGVyaWFsc19kaXNwZXJzaW9uIGltcGxlbWVudHMgSUdMVEZFeHBvcnRlckV4dGVuc2lvblYyIHtcclxuICAgIC8qKiBOYW1lIG9mIHRoaXMgZXh0ZW5zaW9uICovXHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgbmFtZSA9IE5BTUU7XHJcblxyXG4gICAgLyoqIERlZmluZXMgd2hldGhlciB0aGlzIGV4dGVuc2lvbiBpcyBlbmFibGVkICovXHJcbiAgICBwdWJsaWMgZW5hYmxlZCA9IHRydWU7XHJcblxyXG4gICAgLyoqIERlZmluZXMgd2hldGhlciB0aGlzIGV4dGVuc2lvbiBpcyByZXF1aXJlZCAqL1xyXG4gICAgcHVibGljIHJlcXVpcmVkID0gZmFsc2U7XHJcblxyXG4gICAgcHJpdmF0ZSBfd2FzVXNlZCA9IGZhbHNlO1xyXG5cclxuICAgIC8qKiBDb25zdHJ1Y3RvciAqL1xyXG4gICAgY29uc3RydWN0b3IoKSB7fVxyXG5cclxuICAgIC8qKiBEaXNwb3NlICovXHJcbiAgICBwdWJsaWMgZGlzcG9zZSgpIHt9XHJcblxyXG4gICAgLyoqIEBpbnRlcm5hbCAqL1xyXG4gICAgcHVibGljIGdldCB3YXNVc2VkKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl93YXNVc2VkO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2lzRXh0ZW5zaW9uRW5hYmxlZChtYXQ6IFBCUk1hdGVyaWFsKTogYm9vbGVhbiB7XHJcbiAgICAgICAgLy8gVGhpcyBleHRlbnNpb24gbXVzdCBub3QgYmUgdXNlZCBvbiBhIG1hdGVyaWFsIHRoYXQgYWxzbyB1c2VzIEtIUl9tYXRlcmlhbHNfdW5saXRcclxuICAgICAgICBpZiAobWF0LnVubGl0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3Qgc3VicyA9IG1hdC5zdWJTdXJmYWNlO1xyXG4gICAgICAgIC8vIHRoaXMgZXh0ZW5zaW9uIHJlcXVpcmVzIHJlZnJhY3Rpb24gdG8gYmUgZW5hYmxlZC5cclxuICAgICAgICBpZiAoIXN1YnMuaXNSZWZyYWN0aW9uRW5hYmxlZCAmJiAhc3Vicy5pc0Rpc3BlcnNpb25FbmFibGVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZnRlciBleHBvcnRpbmcgYSBtYXRlcmlhbFxyXG4gICAgICogQHBhcmFtIGNvbnRleHQgR0xURiBjb250ZXh0IG9mIHRoZSBtYXRlcmlhbFxyXG4gICAgICogQHBhcmFtIG5vZGUgZXhwb3J0ZWQgR0xURiBub2RlXHJcbiAgICAgKiBAcGFyYW0gYmFieWxvbk1hdGVyaWFsIGNvcnJlc3BvbmRpbmcgYmFieWxvbiBtYXRlcmlhbFxyXG4gICAgICogQHJldHVybnMgcHJvbWlzZSwgcmVzb2x2ZXMgd2l0aCB0aGUgbWF0ZXJpYWxcclxuICAgICAqL1xyXG4gICAgcHVibGljIHBvc3RFeHBvcnRNYXRlcmlhbEFzeW5jPyhjb250ZXh0OiBzdHJpbmcsIG5vZGU6IElNYXRlcmlhbCwgYmFieWxvbk1hdGVyaWFsOiBNYXRlcmlhbCk6IFByb21pc2U8SU1hdGVyaWFsPiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChiYWJ5bG9uTWF0ZXJpYWwgaW5zdGFuY2VvZiBQQlJNYXRlcmlhbCAmJiB0aGlzLl9pc0V4dGVuc2lvbkVuYWJsZWQoYmFieWxvbk1hdGVyaWFsKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fd2FzVXNlZCA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3Qgc3VicyA9IGJhYnlsb25NYXRlcmlhbC5zdWJTdXJmYWNlO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZGlzcGVyc2lvbiA9IHN1YnMuZGlzcGVyc2lvbjtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBkaXNwZXJzaW9uSW5mbzogSUtIUk1hdGVyaWFsc0Rpc3BlcnNpb24gPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlzcGVyc2lvbjogZGlzcGVyc2lvbixcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBub2RlLmV4dGVuc2lvbnMgPSBub2RlLmV4dGVuc2lvbnMgfHwge307XHJcbiAgICAgICAgICAgICAgICBub2RlLmV4dGVuc2lvbnNbTkFNRV0gPSBkaXNwZXJzaW9uSW5mbztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXNvbHZlKG5vZGUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcblxyXG5fRXhwb3J0ZXIuUmVnaXN0ZXJFeHRlbnNpb24oTkFNRSwgKCkgPT4gbmV3IEtIUl9tYXRlcmlhbHNfZGlzcGVyc2lvbigpKTtcclxuIiwiaW1wb3J0IHR5cGUgeyBJR0xURkV4cG9ydGVyRXh0ZW5zaW9uVjIgfSBmcm9tIFwiLi4vZ2xURkV4cG9ydGVyRXh0ZW5zaW9uXCI7XHJcbmltcG9ydCB7IF9FeHBvcnRlciB9IGZyb20gXCIuLi9nbFRGRXhwb3J0ZXJcIjtcclxuaW1wb3J0IHR5cGUgeyBNYXRlcmlhbCB9IGZyb20gXCJjb3JlL01hdGVyaWFscy9tYXRlcmlhbFwiO1xyXG5pbXBvcnQgeyBQQlJNYXRlcmlhbCB9IGZyb20gXCJjb3JlL01hdGVyaWFscy9QQlIvcGJyTWF0ZXJpYWxcIjtcclxuaW1wb3J0IHR5cGUgeyBJTWF0ZXJpYWwsIElLSFJNYXRlcmlhbHNFbWlzc2l2ZVN0cmVuZ3RoIH0gZnJvbSBcImJhYnlsb25qcy1nbHRmMmludGVyZmFjZVwiO1xyXG5cclxuY29uc3QgTkFNRSA9IFwiS0hSX21hdGVyaWFsc19lbWlzc2l2ZV9zdHJlbmd0aFwiO1xyXG5cclxuLyoqXHJcbiAqIFtTcGVjaWZpY2F0aW9uXShodHRwczovL2dpdGh1Yi5jb20vS2hyb25vc0dyb3VwL2dsVEYvYmxvYi9tYWluL2V4dGVuc2lvbnMvMi4wL0tocm9ub3MvS0hSX21hdGVyaWFsc19lbWlzc2l2ZV9zdHJlbmd0aC9SRUFETUUubWQpXHJcbiAqL1xyXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25hbWluZy1jb252ZW50aW9uXHJcbmV4cG9ydCBjbGFzcyBLSFJfbWF0ZXJpYWxzX2VtaXNzaXZlX3N0cmVuZ3RoIGltcGxlbWVudHMgSUdMVEZFeHBvcnRlckV4dGVuc2lvblYyIHtcclxuICAgIC8qKiBOYW1lIG9mIHRoaXMgZXh0ZW5zaW9uICovXHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgbmFtZSA9IE5BTUU7XHJcblxyXG4gICAgLyoqIERlZmluZXMgd2hldGhlciB0aGlzIGV4dGVuc2lvbiBpcyBlbmFibGVkICovXHJcbiAgICBwdWJsaWMgZW5hYmxlZCA9IHRydWU7XHJcblxyXG4gICAgLyoqIERlZmluZXMgd2hldGhlciB0aGlzIGV4dGVuc2lvbiBpcyByZXF1aXJlZCAqL1xyXG4gICAgcHVibGljIHJlcXVpcmVkID0gZmFsc2U7XHJcblxyXG4gICAgcHJpdmF0ZSBfd2FzVXNlZCA9IGZhbHNlO1xyXG5cclxuICAgIC8qKiBEaXNwb3NlICovXHJcbiAgICBwdWJsaWMgZGlzcG9zZSgpIHt9XHJcblxyXG4gICAgLyoqIEBpbnRlcm5hbCAqL1xyXG4gICAgcHVibGljIGdldCB3YXNVc2VkKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl93YXNVc2VkO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWZ0ZXIgZXhwb3J0aW5nIGEgbWF0ZXJpYWxcclxuICAgICAqIEBwYXJhbSBjb250ZXh0IEdMVEYgY29udGV4dCBvZiB0aGUgbWF0ZXJpYWxcclxuICAgICAqIEBwYXJhbSBub2RlIGV4cG9ydGVkIEdMVEYgbm9kZVxyXG4gICAgICogQHBhcmFtIGJhYnlsb25NYXRlcmlhbCBjb3JyZXNwb25kaW5nIGJhYnlsb24gbWF0ZXJpYWxcclxuICAgICAqIEByZXR1cm5zIHByb21pc2UsIHJlc29sdmVzIHdpdGggdGhlIG1hdGVyaWFsXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBwb3N0RXhwb3J0TWF0ZXJpYWxBc3luYyhjb250ZXh0OiBzdHJpbmcsIG5vZGU6IElNYXRlcmlhbCwgYmFieWxvbk1hdGVyaWFsOiBNYXRlcmlhbCk6IFByb21pc2U8SU1hdGVyaWFsPiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghKGJhYnlsb25NYXRlcmlhbCBpbnN0YW5jZW9mIFBCUk1hdGVyaWFsKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUobm9kZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGVtaXNzaXZlQ29sb3IgPSBiYWJ5bG9uTWF0ZXJpYWwuZW1pc3NpdmVDb2xvci5hc0FycmF5KCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHRlbXBFbWlzc2l2ZVN0cmVuZ3RoID0gTWF0aC5tYXgoLi4uZW1pc3NpdmVDb2xvcik7XHJcblxyXG4gICAgICAgICAgICBpZiAodGVtcEVtaXNzaXZlU3RyZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl93YXNVc2VkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICBub2RlLmV4dGVuc2lvbnMgfHw9IHt9O1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGVtaXNzaXZlU3RyZW5ndGhJbmZvOiBJS0hSTWF0ZXJpYWxzRW1pc3NpdmVTdHJlbmd0aCA9IHtcclxuICAgICAgICAgICAgICAgICAgICBlbWlzc2l2ZVN0cmVuZ3RoOiB0ZW1wRW1pc3NpdmVTdHJlbmd0aCxcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gTm9ybWFsaXplIGVhY2ggdmFsdWUgb2YgdGhlIGVtaXNzaXZlIGZhY3RvciB0byBoYXZlIGEgbWF4IHZhbHVlIG9mIDFcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5ld0VtaXNzaXZlRmFjdG9yID0gYmFieWxvbk1hdGVyaWFsLmVtaXNzaXZlQ29sb3Iuc2NhbGUoMSAvIGVtaXNzaXZlU3RyZW5ndGhJbmZvLmVtaXNzaXZlU3RyZW5ndGgpO1xyXG5cclxuICAgICAgICAgICAgICAgIG5vZGUuZW1pc3NpdmVGYWN0b3IgPSBuZXdFbWlzc2l2ZUZhY3Rvci5hc0FycmF5KCk7XHJcbiAgICAgICAgICAgICAgICBub2RlLmV4dGVuc2lvbnNbTkFNRV0gPSBlbWlzc2l2ZVN0cmVuZ3RoSW5mbztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUobm9kZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbl9FeHBvcnRlci5SZWdpc3RlckV4dGVuc2lvbihOQU1FLCAoZXhwb3J0ZXIpID0+IG5ldyBLSFJfbWF0ZXJpYWxzX2VtaXNzaXZlX3N0cmVuZ3RoKCkpO1xyXG4iLCJpbXBvcnQgdHlwZSB7IElNYXRlcmlhbCwgSUtIUk1hdGVyaWFsc0lvciB9IGZyb20gXCJiYWJ5bG9uanMtZ2x0ZjJpbnRlcmZhY2VcIjtcclxuaW1wb3J0IHR5cGUgeyBJR0xURkV4cG9ydGVyRXh0ZW5zaW9uVjIgfSBmcm9tIFwiLi4vZ2xURkV4cG9ydGVyRXh0ZW5zaW9uXCI7XHJcbmltcG9ydCB7IF9FeHBvcnRlciB9IGZyb20gXCIuLi9nbFRGRXhwb3J0ZXJcIjtcclxuaW1wb3J0IHR5cGUgeyBNYXRlcmlhbCB9IGZyb20gXCJjb3JlL01hdGVyaWFscy9tYXRlcmlhbFwiO1xyXG5pbXBvcnQgeyBQQlJNYXRlcmlhbCB9IGZyb20gXCJjb3JlL01hdGVyaWFscy9QQlIvcGJyTWF0ZXJpYWxcIjtcclxuXHJcbmNvbnN0IE5BTUUgPSBcIktIUl9tYXRlcmlhbHNfaW9yXCI7XHJcblxyXG4vKipcclxuICogW1NwZWNpZmljYXRpb25dKGh0dHBzOi8vZ2l0aHViLmNvbS9LaHJvbm9zR3JvdXAvZ2xURi9ibG9iL21haW4vZXh0ZW5zaW9ucy8yLjAvS2hyb25vcy9LSFJfbWF0ZXJpYWxzX2lvci9SRUFETUUubWQpXHJcbiAqL1xyXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25hbWluZy1jb252ZW50aW9uXHJcbmV4cG9ydCBjbGFzcyBLSFJfbWF0ZXJpYWxzX2lvciBpbXBsZW1lbnRzIElHTFRGRXhwb3J0ZXJFeHRlbnNpb25WMiB7XHJcbiAgICAvKiogTmFtZSBvZiB0aGlzIGV4dGVuc2lvbiAqL1xyXG4gICAgcHVibGljIHJlYWRvbmx5IG5hbWUgPSBOQU1FO1xyXG5cclxuICAgIC8qKiBEZWZpbmVzIHdoZXRoZXIgdGhpcyBleHRlbnNpb24gaXMgZW5hYmxlZCAqL1xyXG4gICAgcHVibGljIGVuYWJsZWQgPSB0cnVlO1xyXG5cclxuICAgIC8qKiBEZWZpbmVzIHdoZXRoZXIgdGhpcyBleHRlbnNpb24gaXMgcmVxdWlyZWQgKi9cclxuICAgIHB1YmxpYyByZXF1aXJlZCA9IGZhbHNlO1xyXG5cclxuICAgIHByaXZhdGUgX3dhc1VzZWQgPSBmYWxzZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHt9XHJcblxyXG4gICAgLyoqIERpc3Bvc2UgKi9cclxuICAgIHB1YmxpYyBkaXNwb3NlKCkge31cclxuXHJcbiAgICAvKiogQGludGVybmFsICovXHJcbiAgICBwdWJsaWMgZ2V0IHdhc1VzZWQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3dhc1VzZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfaXNFeHRlbnNpb25FbmFibGVkKG1hdDogUEJSTWF0ZXJpYWwpOiBib29sZWFuIHtcclxuICAgICAgICAvLyBUaGlzIGV4dGVuc2lvbiBtdXN0IG5vdCBiZSB1c2VkIG9uIGEgbWF0ZXJpYWwgdGhhdCBhbHNvIHVzZXMgS0hSX21hdGVyaWFsc191bmxpdFxyXG4gICAgICAgIGlmIChtYXQudW5saXQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbWF0LmluZGV4T2ZSZWZyYWN0aW9uICE9IHVuZGVmaW5lZCAmJiBtYXQuaW5kZXhPZlJlZnJhY3Rpb24gIT0gMS41OyAvLyAxLjUgaXMgbm9ybWF0aXZlIGRlZmF1bHQgdmFsdWUuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZnRlciBleHBvcnRpbmcgYSBtYXRlcmlhbFxyXG4gICAgICogQHBhcmFtIGNvbnRleHQgR0xURiBjb250ZXh0IG9mIHRoZSBtYXRlcmlhbFxyXG4gICAgICogQHBhcmFtIG5vZGUgZXhwb3J0ZWQgR0xURiBub2RlXHJcbiAgICAgKiBAcGFyYW0gYmFieWxvbk1hdGVyaWFsIGNvcnJlc3BvbmRpbmcgYmFieWxvbiBtYXRlcmlhbFxyXG4gICAgICogQHJldHVybnMgcHJvbWlzZSwgcmVzb2x2ZXMgd2l0aCB0aGUgbWF0ZXJpYWxcclxuICAgICAqL1xyXG4gICAgcHVibGljIHBvc3RFeHBvcnRNYXRlcmlhbEFzeW5jPyhjb250ZXh0OiBzdHJpbmcsIG5vZGU6IElNYXRlcmlhbCwgYmFieWxvbk1hdGVyaWFsOiBNYXRlcmlhbCk6IFByb21pc2U8SU1hdGVyaWFsPiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChiYWJ5bG9uTWF0ZXJpYWwgaW5zdGFuY2VvZiBQQlJNYXRlcmlhbCAmJiB0aGlzLl9pc0V4dGVuc2lvbkVuYWJsZWQoYmFieWxvbk1hdGVyaWFsKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fd2FzVXNlZCA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgaW9ySW5mbzogSUtIUk1hdGVyaWFsc0lvciA9IHtcclxuICAgICAgICAgICAgICAgICAgICBpb3I6IGJhYnlsb25NYXRlcmlhbC5pbmRleE9mUmVmcmFjdGlvbixcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBub2RlLmV4dGVuc2lvbnMgPSBub2RlLmV4dGVuc2lvbnMgfHwge307XHJcbiAgICAgICAgICAgICAgICBub2RlLmV4dGVuc2lvbnNbTkFNRV0gPSBpb3JJbmZvO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJlc29sdmUobm9kZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW51c2VkLXZhcnNcclxuX0V4cG9ydGVyLlJlZ2lzdGVyRXh0ZW5zaW9uKE5BTUUsIChleHBvcnRlcikgPT4gbmV3IEtIUl9tYXRlcmlhbHNfaW9yKCkpO1xyXG4iLCJpbXBvcnQgdHlwZSB7IElNYXRlcmlhbCwgSUtIUk1hdGVyaWFsc0lyaWRlc2NlbmNlIH0gZnJvbSBcImJhYnlsb25qcy1nbHRmMmludGVyZmFjZVwiO1xyXG5pbXBvcnQgdHlwZSB7IElHTFRGRXhwb3J0ZXJFeHRlbnNpb25WMiB9IGZyb20gXCIuLi9nbFRGRXhwb3J0ZXJFeHRlbnNpb25cIjtcclxuaW1wb3J0IHsgX0V4cG9ydGVyIH0gZnJvbSBcIi4uL2dsVEZFeHBvcnRlclwiO1xyXG5pbXBvcnQgdHlwZSB7IE1hdGVyaWFsIH0gZnJvbSBcImNvcmUvTWF0ZXJpYWxzL21hdGVyaWFsXCI7XHJcbmltcG9ydCB7IFBCUkJhc2VNYXRlcmlhbCB9IGZyb20gXCJjb3JlL01hdGVyaWFscy9QQlIvcGJyQmFzZU1hdGVyaWFsXCI7XHJcbmltcG9ydCB0eXBlIHsgQmFzZVRleHR1cmUgfSBmcm9tIFwiY29yZS9NYXRlcmlhbHMvVGV4dHVyZXMvYmFzZVRleHR1cmVcIjtcclxuXHJcbmNvbnN0IE5BTUUgPSBcIktIUl9tYXRlcmlhbHNfaXJpZGVzY2VuY2VcIjtcclxuXHJcbi8qKlxyXG4gKiBAaW50ZXJuYWxcclxuICovXHJcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbmFtaW5nLWNvbnZlbnRpb25cclxuZXhwb3J0IGNsYXNzIEtIUl9tYXRlcmlhbHNfaXJpZGVzY2VuY2UgaW1wbGVtZW50cyBJR0xURkV4cG9ydGVyRXh0ZW5zaW9uVjIge1xyXG4gICAgLyoqIE5hbWUgb2YgdGhpcyBleHRlbnNpb24gKi9cclxuICAgIHB1YmxpYyByZWFkb25seSBuYW1lID0gTkFNRTtcclxuXHJcbiAgICAvKiogRGVmaW5lcyB3aGV0aGVyIHRoaXMgZXh0ZW5zaW9uIGlzIGVuYWJsZWQgKi9cclxuICAgIHB1YmxpYyBlbmFibGVkID0gdHJ1ZTtcclxuXHJcbiAgICAvKiogRGVmaW5lcyB3aGV0aGVyIHRoaXMgZXh0ZW5zaW9uIGlzIHJlcXVpcmVkICovXHJcbiAgICBwdWJsaWMgcmVxdWlyZWQgPSBmYWxzZTtcclxuXHJcbiAgICBwcml2YXRlIF9leHBvcnRlcjogX0V4cG9ydGVyO1xyXG5cclxuICAgIHByaXZhdGUgX3dhc1VzZWQgPSBmYWxzZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihleHBvcnRlcjogX0V4cG9ydGVyKSB7XHJcbiAgICAgICAgdGhpcy5fZXhwb3J0ZXIgPSBleHBvcnRlcjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGlzcG9zZSgpIHt9XHJcblxyXG4gICAgLyoqIEBpbnRlcm5hbCAqL1xyXG4gICAgcHVibGljIGdldCB3YXNVc2VkKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl93YXNVc2VkO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBwb3N0RXhwb3J0TWF0ZXJpYWxBZGRpdGlvbmFsVGV4dHVyZXM/KGNvbnRleHQ6IHN0cmluZywgbm9kZTogSU1hdGVyaWFsLCBiYWJ5bG9uTWF0ZXJpYWw6IE1hdGVyaWFsKTogQmFzZVRleHR1cmVbXSB7XHJcbiAgICAgICAgY29uc3QgYWRkaXRpb25hbFRleHR1cmVzOiBCYXNlVGV4dHVyZVtdID0gW107XHJcbiAgICAgICAgaWYgKGJhYnlsb25NYXRlcmlhbCBpbnN0YW5jZW9mIFBCUkJhc2VNYXRlcmlhbCkge1xyXG4gICAgICAgICAgICBpZiAoYmFieWxvbk1hdGVyaWFsLmlyaWRlc2NlbmNlLmlzRW5hYmxlZCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGJhYnlsb25NYXRlcmlhbC5pcmlkZXNjZW5jZS50ZXh0dXJlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWRkaXRpb25hbFRleHR1cmVzLnB1c2goYmFieWxvbk1hdGVyaWFsLmlyaWRlc2NlbmNlLnRleHR1cmUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGJhYnlsb25NYXRlcmlhbC5pcmlkZXNjZW5jZS50aGlja25lc3NUZXh0dXJlICYmIGJhYnlsb25NYXRlcmlhbC5pcmlkZXNjZW5jZS50aGlja25lc3NUZXh0dXJlICE9PSBiYWJ5bG9uTWF0ZXJpYWwuaXJpZGVzY2VuY2UudGV4dHVyZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFkZGl0aW9uYWxUZXh0dXJlcy5wdXNoKGJhYnlsb25NYXRlcmlhbC5pcmlkZXNjZW5jZS50aGlja25lc3NUZXh0dXJlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBhZGRpdGlvbmFsVGV4dHVyZXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBbXTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcG9zdEV4cG9ydE1hdGVyaWFsQXN5bmM/KGNvbnRleHQ6IHN0cmluZywgbm9kZTogSU1hdGVyaWFsLCBiYWJ5bG9uTWF0ZXJpYWw6IE1hdGVyaWFsKTogUHJvbWlzZTxJTWF0ZXJpYWw+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgaWYgKGJhYnlsb25NYXRlcmlhbCBpbnN0YW5jZW9mIFBCUkJhc2VNYXRlcmlhbCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFiYWJ5bG9uTWF0ZXJpYWwuaXJpZGVzY2VuY2UuaXNFbmFibGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShub2RlKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5fd2FzVXNlZCA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgbm9kZS5leHRlbnNpb25zID0gbm9kZS5leHRlbnNpb25zIHx8IHt9O1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGlyaWRlc2NlbmNlVGV4dHVyZUluZm8gPSB0aGlzLl9leHBvcnRlci5fZ2xURk1hdGVyaWFsRXhwb3J0ZXIuX2dldFRleHR1cmVJbmZvKGJhYnlsb25NYXRlcmlhbC5pcmlkZXNjZW5jZS50ZXh0dXJlKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGlyaWRlc2NlbmNlVGhpY2tuZXNzVGV4dHVyZUluZm8gPSB0aGlzLl9leHBvcnRlci5fZ2xURk1hdGVyaWFsRXhwb3J0ZXIuX2dldFRleHR1cmVJbmZvKGJhYnlsb25NYXRlcmlhbC5pcmlkZXNjZW5jZS50aGlja25lc3NUZXh0dXJlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBpcmlkZXNjZW5jZUluZm86IElLSFJNYXRlcmlhbHNJcmlkZXNjZW5jZSA9IHtcclxuICAgICAgICAgICAgICAgICAgICBpcmlkZXNjZW5jZUZhY3RvcjogYmFieWxvbk1hdGVyaWFsLmlyaWRlc2NlbmNlLmludGVuc2l0eSxcclxuICAgICAgICAgICAgICAgICAgICBpcmlkZXNjZW5jZUlvcjogYmFieWxvbk1hdGVyaWFsLmlyaWRlc2NlbmNlLmluZGV4T2ZSZWZyYWN0aW9uLFxyXG4gICAgICAgICAgICAgICAgICAgIGlyaWRlc2NlbmNlVGhpY2tuZXNzTWluaW11bTogYmFieWxvbk1hdGVyaWFsLmlyaWRlc2NlbmNlLm1pbmltdW1UaGlja25lc3MsXHJcbiAgICAgICAgICAgICAgICAgICAgaXJpZGVzY2VuY2VUaGlja25lc3NNYXhpbXVtOiBiYWJ5bG9uTWF0ZXJpYWwuaXJpZGVzY2VuY2UubWF4aW11bVRoaWNrbmVzcyxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaXJpZGVzY2VuY2VUZXh0dXJlOiBpcmlkZXNjZW5jZVRleHR1cmVJbmZvID8/IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgICAgICBpcmlkZXNjZW5jZVRoaWNrbmVzc1RleHR1cmU6IGlyaWRlc2NlbmNlVGhpY2tuZXNzVGV4dHVyZUluZm8gPz8gdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgICAgIGhhc1RleHR1cmVzOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpcmlkZXNjZW5jZUluZm8uaXJpZGVzY2VuY2VUZXh0dXJlICE9PSBudWxsIHx8IGlyaWRlc2NlbmNlSW5mby5pcmlkZXNjZW5jZVRoaWNrbmVzc1RleHR1cmUgIT09IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgbm9kZS5leHRlbnNpb25zW05BTUVdID0gaXJpZGVzY2VuY2VJbmZvO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJlc29sdmUobm9kZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbl9FeHBvcnRlci5SZWdpc3RlckV4dGVuc2lvbihOQU1FLCAoZXhwb3J0ZXIpID0+IG5ldyBLSFJfbWF0ZXJpYWxzX2lyaWRlc2NlbmNlKGV4cG9ydGVyKSk7XHJcbiIsImltcG9ydCB0eXBlIHsgSU1hdGVyaWFsLCBJS0hSTWF0ZXJpYWxzU2hlZW4gfSBmcm9tIFwiYmFieWxvbmpzLWdsdGYyaW50ZXJmYWNlXCI7XHJcbmltcG9ydCB0eXBlIHsgSUdMVEZFeHBvcnRlckV4dGVuc2lvblYyIH0gZnJvbSBcIi4uL2dsVEZFeHBvcnRlckV4dGVuc2lvblwiO1xyXG5pbXBvcnQgeyBfRXhwb3J0ZXIgfSBmcm9tIFwiLi4vZ2xURkV4cG9ydGVyXCI7XHJcbmltcG9ydCB0eXBlIHsgTWF0ZXJpYWwgfSBmcm9tIFwiY29yZS9NYXRlcmlhbHMvbWF0ZXJpYWxcIjtcclxuaW1wb3J0IHsgUEJSTWF0ZXJpYWwgfSBmcm9tIFwiY29yZS9NYXRlcmlhbHMvUEJSL3Bick1hdGVyaWFsXCI7XHJcbmltcG9ydCB0eXBlIHsgQmFzZVRleHR1cmUgfSBmcm9tIFwiY29yZS9NYXRlcmlhbHMvVGV4dHVyZXMvYmFzZVRleHR1cmVcIjtcclxuXHJcbmNvbnN0IE5BTUUgPSBcIktIUl9tYXRlcmlhbHNfc2hlZW5cIjtcclxuXHJcbi8qKlxyXG4gKiBAaW50ZXJuYWxcclxuICovXHJcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbmFtaW5nLWNvbnZlbnRpb25cclxuZXhwb3J0IGNsYXNzIEtIUl9tYXRlcmlhbHNfc2hlZW4gaW1wbGVtZW50cyBJR0xURkV4cG9ydGVyRXh0ZW5zaW9uVjIge1xyXG4gICAgLyoqIE5hbWUgb2YgdGhpcyBleHRlbnNpb24gKi9cclxuICAgIHB1YmxpYyByZWFkb25seSBuYW1lID0gTkFNRTtcclxuXHJcbiAgICAvKiogRGVmaW5lcyB3aGV0aGVyIHRoaXMgZXh0ZW5zaW9uIGlzIGVuYWJsZWQgKi9cclxuICAgIHB1YmxpYyBlbmFibGVkID0gdHJ1ZTtcclxuXHJcbiAgICAvKiogRGVmaW5lcyB3aGV0aGVyIHRoaXMgZXh0ZW5zaW9uIGlzIHJlcXVpcmVkICovXHJcbiAgICBwdWJsaWMgcmVxdWlyZWQgPSBmYWxzZTtcclxuXHJcbiAgICBwcml2YXRlIF93YXNVc2VkID0gZmFsc2U7XHJcblxyXG4gICAgcHJpdmF0ZSBfZXhwb3J0ZXI6IF9FeHBvcnRlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihleHBvcnRlcjogX0V4cG9ydGVyKSB7XHJcbiAgICAgICAgdGhpcy5fZXhwb3J0ZXIgPSBleHBvcnRlcjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGlzcG9zZSgpIHt9XHJcblxyXG4gICAgLyoqIEBpbnRlcm5hbCAqL1xyXG4gICAgcHVibGljIGdldCB3YXNVc2VkKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl93YXNVc2VkO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBwb3N0RXhwb3J0TWF0ZXJpYWxBZGRpdGlvbmFsVGV4dHVyZXMoY29udGV4dDogc3RyaW5nLCBub2RlOiBJTWF0ZXJpYWwsIGJhYnlsb25NYXRlcmlhbDogTWF0ZXJpYWwpOiBCYXNlVGV4dHVyZVtdIHtcclxuICAgICAgICBpZiAoYmFieWxvbk1hdGVyaWFsIGluc3RhbmNlb2YgUEJSTWF0ZXJpYWwpIHtcclxuICAgICAgICAgICAgaWYgKGJhYnlsb25NYXRlcmlhbC5zaGVlbi5pc0VuYWJsZWQgJiYgYmFieWxvbk1hdGVyaWFsLnNoZWVuLnRleHR1cmUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBbYmFieWxvbk1hdGVyaWFsLnNoZWVuLnRleHR1cmVdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gW107XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHBvc3RFeHBvcnRNYXRlcmlhbEFzeW5jKGNvbnRleHQ6IHN0cmluZywgbm9kZTogSU1hdGVyaWFsLCBiYWJ5bG9uTWF0ZXJpYWw6IE1hdGVyaWFsKTogUHJvbWlzZTxJTWF0ZXJpYWw+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgaWYgKGJhYnlsb25NYXRlcmlhbCBpbnN0YW5jZW9mIFBCUk1hdGVyaWFsKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWJhYnlsb25NYXRlcmlhbC5zaGVlbi5pc0VuYWJsZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLl93YXNVc2VkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAobm9kZS5leHRlbnNpb25zID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICBub2RlLmV4dGVuc2lvbnMgPSB7fTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvbnN0IHNoZWVuSW5mbzogSUtIUk1hdGVyaWFsc1NoZWVuID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHNoZWVuQ29sb3JGYWN0b3I6IGJhYnlsb25NYXRlcmlhbC5zaGVlbi5jb2xvci5hc0FycmF5KCksXHJcbiAgICAgICAgICAgICAgICAgICAgc2hlZW5Sb3VnaG5lc3NGYWN0b3I6IGJhYnlsb25NYXRlcmlhbC5zaGVlbi5yb3VnaG5lc3MgPz8gMCxcclxuICAgICAgICAgICAgICAgICAgICBoYXNUZXh0dXJlczogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2hlZW5JbmZvLnNoZWVuQ29sb3JUZXh0dXJlICE9PSBudWxsIHx8IHNoZWVuSW5mby5zaGVlblJvdWdobmVzc1RleHR1cmUgIT09IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGJhYnlsb25NYXRlcmlhbC5zaGVlbi50ZXh0dXJlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2hlZW5JbmZvLnNoZWVuQ29sb3JUZXh0dXJlID0gdGhpcy5fZXhwb3J0ZXIuX2dsVEZNYXRlcmlhbEV4cG9ydGVyLl9nZXRUZXh0dXJlSW5mbyhiYWJ5bG9uTWF0ZXJpYWwuc2hlZW4udGV4dHVyZSkgPz8gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChiYWJ5bG9uTWF0ZXJpYWwuc2hlZW4udGV4dHVyZVJvdWdobmVzcyAmJiAhYmFieWxvbk1hdGVyaWFsLnNoZWVuLnVzZVJvdWdobmVzc0Zyb21NYWluVGV4dHVyZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNoZWVuSW5mby5zaGVlblJvdWdobmVzc1RleHR1cmUgPSB0aGlzLl9leHBvcnRlci5fZ2xURk1hdGVyaWFsRXhwb3J0ZXIuX2dldFRleHR1cmVJbmZvKGJhYnlsb25NYXRlcmlhbC5zaGVlbi50ZXh0dXJlUm91Z2huZXNzKSA/PyB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGJhYnlsb25NYXRlcmlhbC5zaGVlbi50ZXh0dXJlICYmIGJhYnlsb25NYXRlcmlhbC5zaGVlbi51c2VSb3VnaG5lc3NGcm9tTWFpblRleHR1cmUpIHtcclxuICAgICAgICAgICAgICAgICAgICBzaGVlbkluZm8uc2hlZW5Sb3VnaG5lc3NUZXh0dXJlID0gdGhpcy5fZXhwb3J0ZXIuX2dsVEZNYXRlcmlhbEV4cG9ydGVyLl9nZXRUZXh0dXJlSW5mbyhiYWJ5bG9uTWF0ZXJpYWwuc2hlZW4udGV4dHVyZSkgPz8gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIG5vZGUuZXh0ZW5zaW9uc1tOQU1FXSA9IHNoZWVuSW5mbztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXNvbHZlKG5vZGUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcblxyXG5fRXhwb3J0ZXIuUmVnaXN0ZXJFeHRlbnNpb24oTkFNRSwgKGV4cG9ydGVyKSA9PiBuZXcgS0hSX21hdGVyaWFsc19zaGVlbihleHBvcnRlcikpO1xyXG4iLCJpbXBvcnQgdHlwZSB7IElNYXRlcmlhbCwgSUtIUk1hdGVyaWFsc1NwZWN1bGFyIH0gZnJvbSBcImJhYnlsb25qcy1nbHRmMmludGVyZmFjZVwiO1xyXG5pbXBvcnQgdHlwZSB7IElHTFRGRXhwb3J0ZXJFeHRlbnNpb25WMiB9IGZyb20gXCIuLi9nbFRGRXhwb3J0ZXJFeHRlbnNpb25cIjtcclxuaW1wb3J0IHsgX0V4cG9ydGVyIH0gZnJvbSBcIi4uL2dsVEZFeHBvcnRlclwiO1xyXG5pbXBvcnQgdHlwZSB7IE1hdGVyaWFsIH0gZnJvbSBcImNvcmUvTWF0ZXJpYWxzL21hdGVyaWFsXCI7XHJcbmltcG9ydCB7IFBCUk1hdGVyaWFsIH0gZnJvbSBcImNvcmUvTWF0ZXJpYWxzL1BCUi9wYnJNYXRlcmlhbFwiO1xyXG5pbXBvcnQgdHlwZSB7IEJhc2VUZXh0dXJlIH0gZnJvbSBcImNvcmUvTWF0ZXJpYWxzL1RleHR1cmVzL2Jhc2VUZXh0dXJlXCI7XHJcblxyXG5jb25zdCBOQU1FID0gXCJLSFJfbWF0ZXJpYWxzX3NwZWN1bGFyXCI7XHJcblxyXG4vKipcclxuICogW1NwZWNpZmljYXRpb25dKGh0dHBzOi8vZ2l0aHViLmNvbS9LaHJvbm9zR3JvdXAvZ2xURi9ibG9iL21haW4vZXh0ZW5zaW9ucy8yLjAvS2hyb25vcy9LSFJfbWF0ZXJpYWxzX3NwZWN1bGFyL1JFQURNRS5tZClcclxuICovXHJcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbmFtaW5nLWNvbnZlbnRpb25cclxuZXhwb3J0IGNsYXNzIEtIUl9tYXRlcmlhbHNfc3BlY3VsYXIgaW1wbGVtZW50cyBJR0xURkV4cG9ydGVyRXh0ZW5zaW9uVjIge1xyXG4gICAgLyoqIE5hbWUgb2YgdGhpcyBleHRlbnNpb24gKi9cclxuICAgIHB1YmxpYyByZWFkb25seSBuYW1lID0gTkFNRTtcclxuXHJcbiAgICAvKiogRGVmaW5lcyB3aGV0aGVyIHRoaXMgZXh0ZW5zaW9uIGlzIGVuYWJsZWQgKi9cclxuICAgIHB1YmxpYyBlbmFibGVkID0gdHJ1ZTtcclxuXHJcbiAgICAvKiogRGVmaW5lcyB3aGV0aGVyIHRoaXMgZXh0ZW5zaW9uIGlzIHJlcXVpcmVkICovXHJcbiAgICBwdWJsaWMgcmVxdWlyZWQgPSBmYWxzZTtcclxuXHJcbiAgICBwcml2YXRlIF9leHBvcnRlcjogX0V4cG9ydGVyO1xyXG5cclxuICAgIHByaXZhdGUgX3dhc1VzZWQgPSBmYWxzZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihleHBvcnRlcjogX0V4cG9ydGVyKSB7XHJcbiAgICAgICAgdGhpcy5fZXhwb3J0ZXIgPSBleHBvcnRlcjtcclxuICAgIH1cclxuXHJcbiAgICAvKiogRGlzcG9zZSAqL1xyXG4gICAgcHVibGljIGRpc3Bvc2UoKSB7fVxyXG5cclxuICAgIC8qKiBAaW50ZXJuYWwgKi9cclxuICAgIHB1YmxpYyBnZXQgd2FzVXNlZCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fd2FzVXNlZDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFmdGVyIGV4cG9ydGluZyBhIG1hdGVyaWFsLCBkZWFsIHdpdGggdGhlIGFkZGl0aW9uYWwgdGV4dHVyZXNcclxuICAgICAqIEBwYXJhbSBjb250ZXh0IEdMVEYgY29udGV4dCBvZiB0aGUgbWF0ZXJpYWxcclxuICAgICAqIEBwYXJhbSBub2RlIGV4cG9ydGVkIEdMVEYgbm9kZVxyXG4gICAgICogQHBhcmFtIGJhYnlsb25NYXRlcmlhbCBjb3JyZXNwb25kaW5nIGJhYnlsb24gbWF0ZXJpYWxcclxuICAgICAqIEByZXR1cm5zIGFycmF5IG9mIGFkZGl0aW9uYWwgdGV4dHVyZXMgdG8gZXhwb3J0XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBwb3N0RXhwb3J0TWF0ZXJpYWxBZGRpdGlvbmFsVGV4dHVyZXM/KGNvbnRleHQ6IHN0cmluZywgbm9kZTogSU1hdGVyaWFsLCBiYWJ5bG9uTWF0ZXJpYWw6IE1hdGVyaWFsKTogQmFzZVRleHR1cmVbXSB7XHJcbiAgICAgICAgY29uc3QgYWRkaXRpb25hbFRleHR1cmVzOiBCYXNlVGV4dHVyZVtdID0gW107XHJcblxyXG4gICAgICAgIGlmIChiYWJ5bG9uTWF0ZXJpYWwgaW5zdGFuY2VvZiBQQlJNYXRlcmlhbCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5faXNFeHRlbnNpb25FbmFibGVkKGJhYnlsb25NYXRlcmlhbCkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChiYWJ5bG9uTWF0ZXJpYWwubWV0YWxsaWNSZWZsZWN0YW5jZVRleHR1cmUpIHtcclxuICAgICAgICAgICAgICAgICAgICBhZGRpdGlvbmFsVGV4dHVyZXMucHVzaChiYWJ5bG9uTWF0ZXJpYWwubWV0YWxsaWNSZWZsZWN0YW5jZVRleHR1cmUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGJhYnlsb25NYXRlcmlhbC5yZWZsZWN0YW5jZVRleHR1cmUpIHtcclxuICAgICAgICAgICAgICAgICAgICBhZGRpdGlvbmFsVGV4dHVyZXMucHVzaChiYWJ5bG9uTWF0ZXJpYWwucmVmbGVjdGFuY2VUZXh0dXJlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBhZGRpdGlvbmFsVGV4dHVyZXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBhZGRpdGlvbmFsVGV4dHVyZXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfaXNFeHRlbnNpb25FbmFibGVkKG1hdDogUEJSTWF0ZXJpYWwpOiBib29sZWFuIHtcclxuICAgICAgICAvLyBUaGlzIGV4dGVuc2lvbiBtdXN0IG5vdCBiZSB1c2VkIG9uIGEgbWF0ZXJpYWwgdGhhdCBhbHNvIHVzZXMgS0hSX21hdGVyaWFsc191bmxpdFxyXG4gICAgICAgIGlmIChtYXQudW5saXQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAobWF0Lm1ldGFsbGljRjBGYWN0b3IgIT0gdW5kZWZpbmVkICYmIG1hdC5tZXRhbGxpY0YwRmFjdG9yICE9IDEuMCkgfHxcclxuICAgICAgICAgICAgKG1hdC5tZXRhbGxpY1JlZmxlY3RhbmNlQ29sb3IgIT0gdW5kZWZpbmVkICYmICFtYXQubWV0YWxsaWNSZWZsZWN0YW5jZUNvbG9yLmVxdWFsc0Zsb2F0cygxLjAsIDEuMCwgMS4wKSkgfHxcclxuICAgICAgICAgICAgdGhpcy5faGFzVGV4dHVyZXNFeHRlbnNpb24obWF0KVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfaGFzVGV4dHVyZXNFeHRlbnNpb24obWF0OiBQQlJNYXRlcmlhbCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiBtYXQubWV0YWxsaWNSZWZsZWN0YW5jZVRleHR1cmUgIT0gbnVsbCB8fCBtYXQucmVmbGVjdGFuY2VUZXh0dXJlICE9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZnRlciBleHBvcnRpbmcgYSBtYXRlcmlhbFxyXG4gICAgICogQHBhcmFtIGNvbnRleHQgR0xURiBjb250ZXh0IG9mIHRoZSBtYXRlcmlhbFxyXG4gICAgICogQHBhcmFtIG5vZGUgZXhwb3J0ZWQgR0xURiBub2RlXHJcbiAgICAgKiBAcGFyYW0gYmFieWxvbk1hdGVyaWFsIGNvcnJlc3BvbmRpbmcgYmFieWxvbiBtYXRlcmlhbFxyXG4gICAgICogQHJldHVybnMgcHJvbWlzZSwgcmVzb2x2ZXMgd2l0aCB0aGUgbWF0ZXJpYWxcclxuICAgICAqL1xyXG4gICAgcHVibGljIHBvc3RFeHBvcnRNYXRlcmlhbEFzeW5jPyhjb250ZXh0OiBzdHJpbmcsIG5vZGU6IElNYXRlcmlhbCwgYmFieWxvbk1hdGVyaWFsOiBNYXRlcmlhbCk6IFByb21pc2U8SU1hdGVyaWFsPiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChiYWJ5bG9uTWF0ZXJpYWwgaW5zdGFuY2VvZiBQQlJNYXRlcmlhbCAmJiB0aGlzLl9pc0V4dGVuc2lvbkVuYWJsZWQoYmFieWxvbk1hdGVyaWFsKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fd2FzVXNlZCA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgbm9kZS5leHRlbnNpb25zID0gbm9kZS5leHRlbnNpb25zIHx8IHt9O1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IG1ldGFsbGljUmVmbGVjdGFuY2VUZXh0dXJlID0gdGhpcy5fZXhwb3J0ZXIuX2dsVEZNYXRlcmlhbEV4cG9ydGVyLl9nZXRUZXh0dXJlSW5mbyhiYWJ5bG9uTWF0ZXJpYWwubWV0YWxsaWNSZWZsZWN0YW5jZVRleHR1cmUpID8/IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlZmxlY3RhbmNlVGV4dHVyZSA9IHRoaXMuX2V4cG9ydGVyLl9nbFRGTWF0ZXJpYWxFeHBvcnRlci5fZ2V0VGV4dHVyZUluZm8oYmFieWxvbk1hdGVyaWFsLnJlZmxlY3RhbmNlVGV4dHVyZSkgPz8gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbWV0YWxsaWNGMEZhY3RvciA9IGJhYnlsb25NYXRlcmlhbC5tZXRhbGxpY0YwRmFjdG9yID09IDEuMCA/IHVuZGVmaW5lZCA6IGJhYnlsb25NYXRlcmlhbC5tZXRhbGxpY0YwRmFjdG9yO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbWV0YWxsaWNSZWZsZWN0YW5jZUNvbG9yID0gYmFieWxvbk1hdGVyaWFsLm1ldGFsbGljUmVmbGVjdGFuY2VDb2xvci5lcXVhbHNGbG9hdHMoMS4wLCAxLjAsIDEuMClcclxuICAgICAgICAgICAgICAgICAgICA/IHVuZGVmaW5lZFxyXG4gICAgICAgICAgICAgICAgICAgIDogYmFieWxvbk1hdGVyaWFsLm1ldGFsbGljUmVmbGVjdGFuY2VDb2xvci5hc0FycmF5KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3Qgc3BlY3VsYXJJbmZvOiBJS0hSTWF0ZXJpYWxzU3BlY3VsYXIgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3BlY3VsYXJGYWN0b3I6IG1ldGFsbGljRjBGYWN0b3IsXHJcbiAgICAgICAgICAgICAgICAgICAgc3BlY3VsYXJUZXh0dXJlOiBtZXRhbGxpY1JlZmxlY3RhbmNlVGV4dHVyZSxcclxuICAgICAgICAgICAgICAgICAgICBzcGVjdWxhckNvbG9yRmFjdG9yOiBtZXRhbGxpY1JlZmxlY3RhbmNlQ29sb3IsXHJcbiAgICAgICAgICAgICAgICAgICAgc3BlY3VsYXJDb2xvclRleHR1cmU6IHJlZmxlY3RhbmNlVGV4dHVyZSxcclxuICAgICAgICAgICAgICAgICAgICBoYXNUZXh0dXJlczogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5faGFzVGV4dHVyZXNFeHRlbnNpb24oYmFieWxvbk1hdGVyaWFsKTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIG5vZGUuZXh0ZW5zaW9uc1tOQU1FXSA9IHNwZWN1bGFySW5mbztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXNvbHZlKG5vZGUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcblxyXG5fRXhwb3J0ZXIuUmVnaXN0ZXJFeHRlbnNpb24oTkFNRSwgKGV4cG9ydGVyKSA9PiBuZXcgS0hSX21hdGVyaWFsc19zcGVjdWxhcihleHBvcnRlcikpO1xyXG4iLCJpbXBvcnQgdHlwZSB7IElNYXRlcmlhbCwgSUtIUk1hdGVyaWFsc1RyYW5zbWlzc2lvbiB9IGZyb20gXCJiYWJ5bG9uanMtZ2x0ZjJpbnRlcmZhY2VcIjtcclxuaW1wb3J0IHR5cGUgeyBJR0xURkV4cG9ydGVyRXh0ZW5zaW9uVjIgfSBmcm9tIFwiLi4vZ2xURkV4cG9ydGVyRXh0ZW5zaW9uXCI7XHJcbmltcG9ydCB7IF9FeHBvcnRlciB9IGZyb20gXCIuLi9nbFRGRXhwb3J0ZXJcIjtcclxuaW1wb3J0IHR5cGUgeyBNYXRlcmlhbCB9IGZyb20gXCJjb3JlL01hdGVyaWFscy9tYXRlcmlhbFwiO1xyXG5pbXBvcnQgeyBQQlJNYXRlcmlhbCB9IGZyb20gXCJjb3JlL01hdGVyaWFscy9QQlIvcGJyTWF0ZXJpYWxcIjtcclxuaW1wb3J0IHR5cGUgeyBCYXNlVGV4dHVyZSB9IGZyb20gXCJjb3JlL01hdGVyaWFscy9UZXh0dXJlcy9iYXNlVGV4dHVyZVwiO1xyXG5cclxuY29uc3QgTkFNRSA9IFwiS0hSX21hdGVyaWFsc190cmFuc21pc3Npb25cIjtcclxuXHJcbi8qKlxyXG4gKiBbU3BlY2lmaWNhdGlvbl0oaHR0cHM6Ly9naXRodWIuY29tL0tocm9ub3NHcm91cC9nbFRGL2Jsb2IvbWFpbi9leHRlbnNpb25zLzIuMC9LaHJvbm9zL0tIUl9tYXRlcmlhbHNfdHJhbnNtaXNzaW9uL1JFQURNRS5tZClcclxuICovXHJcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbmFtaW5nLWNvbnZlbnRpb25cclxuZXhwb3J0IGNsYXNzIEtIUl9tYXRlcmlhbHNfdHJhbnNtaXNzaW9uIGltcGxlbWVudHMgSUdMVEZFeHBvcnRlckV4dGVuc2lvblYyIHtcclxuICAgIC8qKiBOYW1lIG9mIHRoaXMgZXh0ZW5zaW9uICovXHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgbmFtZSA9IE5BTUU7XHJcblxyXG4gICAgLyoqIERlZmluZXMgd2hldGhlciB0aGlzIGV4dGVuc2lvbiBpcyBlbmFibGVkICovXHJcbiAgICBwdWJsaWMgZW5hYmxlZCA9IHRydWU7XHJcblxyXG4gICAgLyoqIERlZmluZXMgd2hldGhlciB0aGlzIGV4dGVuc2lvbiBpcyByZXF1aXJlZCAqL1xyXG4gICAgcHVibGljIHJlcXVpcmVkID0gZmFsc2U7XHJcblxyXG4gICAgcHJpdmF0ZSBfZXhwb3J0ZXI6IF9FeHBvcnRlcjtcclxuXHJcbiAgICBwcml2YXRlIF93YXNVc2VkID0gZmFsc2U7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZXhwb3J0ZXI6IF9FeHBvcnRlcikge1xyXG4gICAgICAgIHRoaXMuX2V4cG9ydGVyID0gZXhwb3J0ZXI7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIERpc3Bvc2UgKi9cclxuICAgIHB1YmxpYyBkaXNwb3NlKCkge31cclxuXHJcbiAgICAvKiogQGludGVybmFsICovXHJcbiAgICBwdWJsaWMgZ2V0IHdhc1VzZWQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3dhc1VzZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZnRlciBleHBvcnRpbmcgYSBtYXRlcmlhbCwgZGVhbCB3aXRoIGFkZGl0aW9uYWwgdGV4dHVyZXNcclxuICAgICAqIEBwYXJhbSBjb250ZXh0IEdMVEYgY29udGV4dCBvZiB0aGUgbWF0ZXJpYWxcclxuICAgICAqIEBwYXJhbSBub2RlIGV4cG9ydGVkIEdMVEYgbm9kZVxyXG4gICAgICogQHBhcmFtIGJhYnlsb25NYXRlcmlhbCBjb3JyZXNwb25kaW5nIGJhYnlsb24gbWF0ZXJpYWxcclxuICAgICAqIEByZXR1cm5zIGFycmF5IG9mIGFkZGl0aW9uYWwgdGV4dHVyZXMgdG8gZXhwb3J0XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBwb3N0RXhwb3J0TWF0ZXJpYWxBZGRpdGlvbmFsVGV4dHVyZXM/KGNvbnRleHQ6IHN0cmluZywgbm9kZTogSU1hdGVyaWFsLCBiYWJ5bG9uTWF0ZXJpYWw6IE1hdGVyaWFsKTogQmFzZVRleHR1cmVbXSB7XHJcbiAgICAgICAgY29uc3QgYWRkaXRpb25hbFRleHR1cmVzOiBCYXNlVGV4dHVyZVtdID0gW107XHJcblxyXG4gICAgICAgIGlmIChiYWJ5bG9uTWF0ZXJpYWwgaW5zdGFuY2VvZiBQQlJNYXRlcmlhbCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5faXNFeHRlbnNpb25FbmFibGVkKGJhYnlsb25NYXRlcmlhbCkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChiYWJ5bG9uTWF0ZXJpYWwuc3ViU3VyZmFjZS50aGlja25lc3NUZXh0dXJlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWRkaXRpb25hbFRleHR1cmVzLnB1c2goYmFieWxvbk1hdGVyaWFsLnN1YlN1cmZhY2UudGhpY2tuZXNzVGV4dHVyZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYWRkaXRpb25hbFRleHR1cmVzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gYWRkaXRpb25hbFRleHR1cmVzO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2lzRXh0ZW5zaW9uRW5hYmxlZChtYXQ6IFBCUk1hdGVyaWFsKTogYm9vbGVhbiB7XHJcbiAgICAgICAgLy8gVGhpcyBleHRlbnNpb24gbXVzdCBub3QgYmUgdXNlZCBvbiBhIG1hdGVyaWFsIHRoYXQgYWxzbyB1c2VzIEtIUl9tYXRlcmlhbHNfdW5saXRcclxuICAgICAgICBpZiAobWF0LnVubGl0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3Qgc3VicyA9IG1hdC5zdWJTdXJmYWNlO1xyXG4gICAgICAgIHJldHVybiAoc3Vicy5pc1JlZnJhY3Rpb25FbmFibGVkICYmIHN1YnMucmVmcmFjdGlvbkludGVuc2l0eSAhPSB1bmRlZmluZWQgJiYgc3Vicy5yZWZyYWN0aW9uSW50ZW5zaXR5ICE9IDApIHx8IHRoaXMuX2hhc1RleHR1cmVzRXh0ZW5zaW9uKG1hdCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfaGFzVGV4dHVyZXNFeHRlbnNpb24obWF0OiBQQlJNYXRlcmlhbCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiBtYXQuc3ViU3VyZmFjZS5yZWZyYWN0aW9uSW50ZW5zaXR5VGV4dHVyZSAhPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWZ0ZXIgZXhwb3J0aW5nIGEgbWF0ZXJpYWxcclxuICAgICAqIEBwYXJhbSBjb250ZXh0IEdMVEYgY29udGV4dCBvZiB0aGUgbWF0ZXJpYWxcclxuICAgICAqIEBwYXJhbSBub2RlIGV4cG9ydGVkIEdMVEYgbm9kZVxyXG4gICAgICogQHBhcmFtIGJhYnlsb25NYXRlcmlhbCBjb3JyZXNwb25kaW5nIGJhYnlsb24gbWF0ZXJpYWxcclxuICAgICAqIEByZXR1cm5zIHRydWUgaWYgc3VjY2Vzc2Z1bFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcG9zdEV4cG9ydE1hdGVyaWFsQXN5bmM/KGNvbnRleHQ6IHN0cmluZywgbm9kZTogSU1hdGVyaWFsLCBiYWJ5bG9uTWF0ZXJpYWw6IE1hdGVyaWFsKTogUHJvbWlzZTxJTWF0ZXJpYWw+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgaWYgKGJhYnlsb25NYXRlcmlhbCBpbnN0YW5jZW9mIFBCUk1hdGVyaWFsICYmIHRoaXMuX2lzRXh0ZW5zaW9uRW5hYmxlZChiYWJ5bG9uTWF0ZXJpYWwpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl93YXNVc2VkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBzdWJzID0gYmFieWxvbk1hdGVyaWFsLnN1YlN1cmZhY2U7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0cmFuc21pc3Npb25GYWN0b3IgPSBzdWJzLnJlZnJhY3Rpb25JbnRlbnNpdHkgPT09IDAgPyB1bmRlZmluZWQgOiBzdWJzLnJlZnJhY3Rpb25JbnRlbnNpdHk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgdHJhbnNtaXNzaW9uVGV4dHVyZSA9IHRoaXMuX2V4cG9ydGVyLl9nbFRGTWF0ZXJpYWxFeHBvcnRlci5fZ2V0VGV4dHVyZUluZm8oc3Vicy5yZWZyYWN0aW9uSW50ZW5zaXR5VGV4dHVyZSkgPz8gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IHZvbHVtZUluZm86IElLSFJNYXRlcmlhbHNUcmFuc21pc3Npb24gPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNtaXNzaW9uRmFjdG9yOiB0cmFuc21pc3Npb25GYWN0b3IsXHJcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNtaXNzaW9uVGV4dHVyZTogdHJhbnNtaXNzaW9uVGV4dHVyZSxcclxuICAgICAgICAgICAgICAgICAgICBoYXNUZXh0dXJlczogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5faGFzVGV4dHVyZXNFeHRlbnNpb24oYmFieWxvbk1hdGVyaWFsKTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIG5vZGUuZXh0ZW5zaW9ucyA9IG5vZGUuZXh0ZW5zaW9ucyB8fCB7fTtcclxuICAgICAgICAgICAgICAgIG5vZGUuZXh0ZW5zaW9uc1tOQU1FXSA9IHZvbHVtZUluZm87XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmVzb2x2ZShub2RlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cclxuX0V4cG9ydGVyLlJlZ2lzdGVyRXh0ZW5zaW9uKE5BTUUsIChleHBvcnRlcikgPT4gbmV3IEtIUl9tYXRlcmlhbHNfdHJhbnNtaXNzaW9uKGV4cG9ydGVyKSk7XHJcbiIsImltcG9ydCB0eXBlIHsgSU1hdGVyaWFsIH0gZnJvbSBcImJhYnlsb25qcy1nbHRmMmludGVyZmFjZVwiO1xyXG5pbXBvcnQgdHlwZSB7IElHTFRGRXhwb3J0ZXJFeHRlbnNpb25WMiB9IGZyb20gXCIuLi9nbFRGRXhwb3J0ZXJFeHRlbnNpb25cIjtcclxuaW1wb3J0IHsgX0V4cG9ydGVyIH0gZnJvbSBcIi4uL2dsVEZFeHBvcnRlclwiO1xyXG5pbXBvcnQgdHlwZSB7IE1hdGVyaWFsIH0gZnJvbSBcImNvcmUvTWF0ZXJpYWxzL21hdGVyaWFsXCI7XHJcbmltcG9ydCB7IFBCUk1hdGVyaWFsIH0gZnJvbSBcImNvcmUvTWF0ZXJpYWxzL1BCUi9wYnJNYXRlcmlhbFwiO1xyXG5pbXBvcnQgeyBTdGFuZGFyZE1hdGVyaWFsIH0gZnJvbSBcImNvcmUvTWF0ZXJpYWxzL3N0YW5kYXJkTWF0ZXJpYWxcIjtcclxuXHJcbmNvbnN0IE5BTUUgPSBcIktIUl9tYXRlcmlhbHNfdW5saXRcIjtcclxuXHJcbi8qKlxyXG4gKiBAaW50ZXJuYWxcclxuICovXHJcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbmFtaW5nLWNvbnZlbnRpb25cclxuZXhwb3J0IGNsYXNzIEtIUl9tYXRlcmlhbHNfdW5saXQgaW1wbGVtZW50cyBJR0xURkV4cG9ydGVyRXh0ZW5zaW9uVjIge1xyXG4gICAgLyoqIE5hbWUgb2YgdGhpcyBleHRlbnNpb24gKi9cclxuICAgIHB1YmxpYyByZWFkb25seSBuYW1lID0gTkFNRTtcclxuXHJcbiAgICAvKiogRGVmaW5lcyB3aGV0aGVyIHRoaXMgZXh0ZW5zaW9uIGlzIGVuYWJsZWQgKi9cclxuICAgIHB1YmxpYyBlbmFibGVkID0gdHJ1ZTtcclxuXHJcbiAgICAvKiogRGVmaW5lcyB3aGV0aGVyIHRoaXMgZXh0ZW5zaW9uIGlzIHJlcXVpcmVkICovXHJcbiAgICBwdWJsaWMgcmVxdWlyZWQgPSBmYWxzZTtcclxuXHJcbiAgICBwcml2YXRlIF93YXNVc2VkID0gZmFsc2U7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7fVxyXG5cclxuICAgIC8qKiBAaW50ZXJuYWwgKi9cclxuICAgIHB1YmxpYyBnZXQgd2FzVXNlZCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fd2FzVXNlZDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGlzcG9zZSgpIHt9XHJcblxyXG4gICAgcHVibGljIHBvc3RFeHBvcnRNYXRlcmlhbEFzeW5jPyhjb250ZXh0OiBzdHJpbmcsIG5vZGU6IElNYXRlcmlhbCwgYmFieWxvbk1hdGVyaWFsOiBNYXRlcmlhbCk6IFByb21pc2U8SU1hdGVyaWFsPiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCB1bmxpdE1hdGVyaWFsID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICBpZiAoYmFieWxvbk1hdGVyaWFsIGluc3RhbmNlb2YgUEJSTWF0ZXJpYWwpIHtcclxuICAgICAgICAgICAgICAgIHVubGl0TWF0ZXJpYWwgPSBiYWJ5bG9uTWF0ZXJpYWwudW5saXQ7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYmFieWxvbk1hdGVyaWFsIGluc3RhbmNlb2YgU3RhbmRhcmRNYXRlcmlhbCkge1xyXG4gICAgICAgICAgICAgICAgdW5saXRNYXRlcmlhbCA9IGJhYnlsb25NYXRlcmlhbC5kaXNhYmxlTGlnaHRpbmc7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh1bmxpdE1hdGVyaWFsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl93YXNVc2VkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAobm9kZS5leHRlbnNpb25zID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICBub2RlLmV4dGVuc2lvbnMgPSB7fTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBub2RlLmV4dGVuc2lvbnNbTkFNRV0gPSB7fTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmVzb2x2ZShub2RlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cclxuX0V4cG9ydGVyLlJlZ2lzdGVyRXh0ZW5zaW9uKE5BTUUsICgpID0+IG5ldyBLSFJfbWF0ZXJpYWxzX3VubGl0KCkpO1xyXG4iLCJpbXBvcnQgdHlwZSB7IElNYXRlcmlhbCwgSUtIUk1hdGVyaWFsc1ZvbHVtZSB9IGZyb20gXCJiYWJ5bG9uanMtZ2x0ZjJpbnRlcmZhY2VcIjtcclxuaW1wb3J0IHR5cGUgeyBJR0xURkV4cG9ydGVyRXh0ZW5zaW9uVjIgfSBmcm9tIFwiLi4vZ2xURkV4cG9ydGVyRXh0ZW5zaW9uXCI7XHJcbmltcG9ydCB7IF9FeHBvcnRlciB9IGZyb20gXCIuLi9nbFRGRXhwb3J0ZXJcIjtcclxuaW1wb3J0IHR5cGUgeyBNYXRlcmlhbCB9IGZyb20gXCJjb3JlL01hdGVyaWFscy9tYXRlcmlhbFwiO1xyXG5pbXBvcnQgeyBQQlJNYXRlcmlhbCB9IGZyb20gXCJjb3JlL01hdGVyaWFscy9QQlIvcGJyTWF0ZXJpYWxcIjtcclxuaW1wb3J0IHR5cGUgeyBCYXNlVGV4dHVyZSB9IGZyb20gXCJjb3JlL01hdGVyaWFscy9UZXh0dXJlcy9iYXNlVGV4dHVyZVwiO1xyXG5pbXBvcnQgeyBDb2xvcjMgfSBmcm9tIFwiY29yZS9NYXRocy9tYXRoLmNvbG9yXCI7XHJcblxyXG5jb25zdCBOQU1FID0gXCJLSFJfbWF0ZXJpYWxzX3ZvbHVtZVwiO1xyXG5cclxuLyoqXHJcbiAqIFtTcGVjaWZpY2F0aW9uXShodHRwczovL2dpdGh1Yi5jb20vS2hyb25vc0dyb3VwL2dsVEYvYmxvYi9tYWluL2V4dGVuc2lvbnMvMi4wL0tocm9ub3MvS0hSX21hdGVyaWFsc192b2x1bWUvUkVBRE1FLm1kKVxyXG4gKi9cclxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uYW1pbmctY29udmVudGlvblxyXG5leHBvcnQgY2xhc3MgS0hSX21hdGVyaWFsc192b2x1bWUgaW1wbGVtZW50cyBJR0xURkV4cG9ydGVyRXh0ZW5zaW9uVjIge1xyXG4gICAgLyoqIE5hbWUgb2YgdGhpcyBleHRlbnNpb24gKi9cclxuICAgIHB1YmxpYyByZWFkb25seSBuYW1lID0gTkFNRTtcclxuXHJcbiAgICAvKiogRGVmaW5lcyB3aGV0aGVyIHRoaXMgZXh0ZW5zaW9uIGlzIGVuYWJsZWQgKi9cclxuICAgIHB1YmxpYyBlbmFibGVkID0gdHJ1ZTtcclxuXHJcbiAgICAvKiogRGVmaW5lcyB3aGV0aGVyIHRoaXMgZXh0ZW5zaW9uIGlzIHJlcXVpcmVkICovXHJcbiAgICBwdWJsaWMgcmVxdWlyZWQgPSBmYWxzZTtcclxuXHJcbiAgICBwcml2YXRlIF9leHBvcnRlcjogX0V4cG9ydGVyO1xyXG5cclxuICAgIHByaXZhdGUgX3dhc1VzZWQgPSBmYWxzZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihleHBvcnRlcjogX0V4cG9ydGVyKSB7XHJcbiAgICAgICAgdGhpcy5fZXhwb3J0ZXIgPSBleHBvcnRlcjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGlzcG9zZSgpIHt9XHJcblxyXG4gICAgLyoqIEBpbnRlcm5hbCAqL1xyXG4gICAgcHVibGljIGdldCB3YXNVc2VkKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl93YXNVc2VkO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWZ0ZXIgZXhwb3J0aW5nIGEgbWF0ZXJpYWwsIGRlYWwgd2l0aCBhZGRpdGlvbmFsIHRleHR1cmVzXHJcbiAgICAgKiBAcGFyYW0gY29udGV4dCBHTFRGIGNvbnRleHQgb2YgdGhlIG1hdGVyaWFsXHJcbiAgICAgKiBAcGFyYW0gbm9kZSBleHBvcnRlZCBHTFRGIG5vZGVcclxuICAgICAqIEBwYXJhbSBiYWJ5bG9uTWF0ZXJpYWwgY29ycmVzcG9uZGluZyBiYWJ5bG9uIG1hdGVyaWFsXHJcbiAgICAgKiBAcmV0dXJucyBhcnJheSBvZiBhZGRpdGlvbmFsIHRleHR1cmVzIHRvIGV4cG9ydFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcG9zdEV4cG9ydE1hdGVyaWFsQWRkaXRpb25hbFRleHR1cmVzPyhjb250ZXh0OiBzdHJpbmcsIG5vZGU6IElNYXRlcmlhbCwgYmFieWxvbk1hdGVyaWFsOiBNYXRlcmlhbCk6IEJhc2VUZXh0dXJlW10ge1xyXG4gICAgICAgIGNvbnN0IGFkZGl0aW9uYWxUZXh0dXJlczogQmFzZVRleHR1cmVbXSA9IFtdO1xyXG5cclxuICAgICAgICBpZiAoYmFieWxvbk1hdGVyaWFsIGluc3RhbmNlb2YgUEJSTWF0ZXJpYWwpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2lzRXh0ZW5zaW9uRW5hYmxlZChiYWJ5bG9uTWF0ZXJpYWwpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYmFieWxvbk1hdGVyaWFsLnN1YlN1cmZhY2UudGhpY2tuZXNzVGV4dHVyZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFkZGl0aW9uYWxUZXh0dXJlcy5wdXNoKGJhYnlsb25NYXRlcmlhbC5zdWJTdXJmYWNlLnRoaWNrbmVzc1RleHR1cmUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFkZGl0aW9uYWxUZXh0dXJlcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGFkZGl0aW9uYWxUZXh0dXJlcztcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9pc0V4dGVuc2lvbkVuYWJsZWQobWF0OiBQQlJNYXRlcmlhbCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIC8vIFRoaXMgZXh0ZW5zaW9uIG11c3Qgbm90IGJlIHVzZWQgb24gYSBtYXRlcmlhbCB0aGF0IGFsc28gdXNlcyBLSFJfbWF0ZXJpYWxzX3VubGl0XHJcbiAgICAgICAgaWYgKG1hdC51bmxpdCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHN1YnMgPSBtYXQuc3ViU3VyZmFjZTtcclxuICAgICAgICAvLyB0aGlzIGV4dGVuc2lvbiByZXF1aXJlcyBlaXRoZXIgdGhlIEtIUl9tYXRlcmlhbHNfdHJhbnNtaXNzaW9uIG9yIEtIUl9tYXRlcmlhbHNfZGlmZnVzZV90cmFuc21pc3Npb24gZXh0ZW5zaW9ucy5cclxuICAgICAgICBpZiAoIXN1YnMuaXNSZWZyYWN0aW9uRW5hYmxlZCAmJiAhc3Vicy5pc1RyYW5zbHVjZW5jeUVuYWJsZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAoc3Vicy5tYXhpbXVtVGhpY2tuZXNzICE9IHVuZGVmaW5lZCAmJiBzdWJzLm1heGltdW1UaGlja25lc3MgIT0gMCkgfHxcclxuICAgICAgICAgICAgKHN1YnMudGludENvbG9yQXREaXN0YW5jZSAhPSB1bmRlZmluZWQgJiYgc3Vicy50aW50Q29sb3JBdERpc3RhbmNlICE9IE51bWJlci5QT1NJVElWRV9JTkZJTklUWSkgfHxcclxuICAgICAgICAgICAgKHN1YnMudGludENvbG9yICE9IHVuZGVmaW5lZCAmJiBzdWJzLnRpbnRDb2xvciAhPSBDb2xvcjMuV2hpdGUoKSkgfHxcclxuICAgICAgICAgICAgdGhpcy5faGFzVGV4dHVyZXNFeHRlbnNpb24obWF0KVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfaGFzVGV4dHVyZXNFeHRlbnNpb24obWF0OiBQQlJNYXRlcmlhbCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiBtYXQuc3ViU3VyZmFjZS50aGlja25lc3NUZXh0dXJlICE9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZnRlciBleHBvcnRpbmcgYSBtYXRlcmlhbFxyXG4gICAgICogQHBhcmFtIGNvbnRleHQgR0xURiBjb250ZXh0IG9mIHRoZSBtYXRlcmlhbFxyXG4gICAgICogQHBhcmFtIG5vZGUgZXhwb3J0ZWQgR0xURiBub2RlXHJcbiAgICAgKiBAcGFyYW0gYmFieWxvbk1hdGVyaWFsIGNvcnJlc3BvbmRpbmcgYmFieWxvbiBtYXRlcmlhbFxyXG4gICAgICogQHJldHVybnMgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHdpdGggdGhlIHVwZGF0ZWQgbm9kZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcG9zdEV4cG9ydE1hdGVyaWFsQXN5bmM/KGNvbnRleHQ6IHN0cmluZywgbm9kZTogSU1hdGVyaWFsLCBiYWJ5bG9uTWF0ZXJpYWw6IE1hdGVyaWFsKTogUHJvbWlzZTxJTWF0ZXJpYWw+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgaWYgKGJhYnlsb25NYXRlcmlhbCBpbnN0YW5jZW9mIFBCUk1hdGVyaWFsICYmIHRoaXMuX2lzRXh0ZW5zaW9uRW5hYmxlZChiYWJ5bG9uTWF0ZXJpYWwpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl93YXNVc2VkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBzdWJzID0gYmFieWxvbk1hdGVyaWFsLnN1YlN1cmZhY2U7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0aGlja25lc3NGYWN0b3IgPSBzdWJzLm1heGltdW1UaGlja25lc3MgPT0gMCA/IHVuZGVmaW5lZCA6IHN1YnMubWF4aW11bVRoaWNrbmVzcztcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRoaWNrbmVzc1RleHR1cmUgPSB0aGlzLl9leHBvcnRlci5fZ2xURk1hdGVyaWFsRXhwb3J0ZXIuX2dldFRleHR1cmVJbmZvKHN1YnMudGhpY2tuZXNzVGV4dHVyZSkgPz8gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYXR0ZW51YXRpb25EaXN0YW5jZSA9IHN1YnMudGludENvbG9yQXREaXN0YW5jZSA9PSBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFkgPyB1bmRlZmluZWQgOiBzdWJzLnRpbnRDb2xvckF0RGlzdGFuY2U7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhdHRlbnVhdGlvbkNvbG9yID0gc3Vicy50aW50Q29sb3IuZXF1YWxzRmxvYXRzKDEuMCwgMS4wLCAxLjApID8gdW5kZWZpbmVkIDogc3Vicy50aW50Q29sb3IuYXNBcnJheSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IHZvbHVtZUluZm86IElLSFJNYXRlcmlhbHNWb2x1bWUgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpY2tuZXNzRmFjdG9yOiB0aGlja25lc3NGYWN0b3IsXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpY2tuZXNzVGV4dHVyZTogdGhpY2tuZXNzVGV4dHVyZSxcclxuICAgICAgICAgICAgICAgICAgICBhdHRlbnVhdGlvbkRpc3RhbmNlOiBhdHRlbnVhdGlvbkRpc3RhbmNlLFxyXG4gICAgICAgICAgICAgICAgICAgIGF0dGVudWF0aW9uQ29sb3I6IGF0dGVudWF0aW9uQ29sb3IsXHJcbiAgICAgICAgICAgICAgICAgICAgaGFzVGV4dHVyZXM6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2hhc1RleHR1cmVzRXh0ZW5zaW9uKGJhYnlsb25NYXRlcmlhbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBub2RlLmV4dGVuc2lvbnMgPSBub2RlLmV4dGVuc2lvbnMgfHwge307XHJcbiAgICAgICAgICAgICAgICBub2RlLmV4dGVuc2lvbnNbTkFNRV0gPSB2b2x1bWVJbmZvO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJlc29sdmUobm9kZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbl9FeHBvcnRlci5SZWdpc3RlckV4dGVuc2lvbihOQU1FLCAoZXhwb3J0ZXIpID0+IG5ldyBLSFJfbWF0ZXJpYWxzX3ZvbHVtZShleHBvcnRlcikpO1xyXG4iLCJpbXBvcnQgdHlwZSB7IElUZXh0dXJlSW5mbywgSUtIUlRleHR1cmVUcmFuc2Zvcm0gfSBmcm9tIFwiYmFieWxvbmpzLWdsdGYyaW50ZXJmYWNlXCI7XHJcbmltcG9ydCB7IFRvb2xzIH0gZnJvbSBcImNvcmUvTWlzYy90b29sc1wiO1xyXG5pbXBvcnQgdHlwZSB7IFRleHR1cmUgfSBmcm9tIFwiY29yZS9NYXRlcmlhbHMvVGV4dHVyZXMvdGV4dHVyZVwiO1xyXG5pbXBvcnQgdHlwZSB7IE51bGxhYmxlIH0gZnJvbSBcImNvcmUvdHlwZXNcIjtcclxuaW1wb3J0IHR5cGUgeyBJR0xURkV4cG9ydGVyRXh0ZW5zaW9uVjIgfSBmcm9tIFwiLi4vZ2xURkV4cG9ydGVyRXh0ZW5zaW9uXCI7XHJcbmltcG9ydCB7IF9FeHBvcnRlciB9IGZyb20gXCIuLi9nbFRGRXhwb3J0ZXJcIjtcclxuXHJcbmNvbnN0IE5BTUUgPSBcIktIUl90ZXh0dXJlX3RyYW5zZm9ybVwiO1xyXG5cclxuLyoqXHJcbiAqIEBpbnRlcm5hbFxyXG4gKi9cclxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uYW1pbmctY29udmVudGlvblxyXG5leHBvcnQgY2xhc3MgS0hSX3RleHR1cmVfdHJhbnNmb3JtIGltcGxlbWVudHMgSUdMVEZFeHBvcnRlckV4dGVuc2lvblYyIHtcclxuICAgIC8qKiBOYW1lIG9mIHRoaXMgZXh0ZW5zaW9uICovXHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgbmFtZSA9IE5BTUU7XHJcblxyXG4gICAgLyoqIERlZmluZXMgd2hldGhlciB0aGlzIGV4dGVuc2lvbiBpcyBlbmFibGVkICovXHJcbiAgICBwdWJsaWMgZW5hYmxlZCA9IHRydWU7XHJcblxyXG4gICAgLyoqIERlZmluZXMgd2hldGhlciB0aGlzIGV4dGVuc2lvbiBpcyByZXF1aXJlZCAqL1xyXG4gICAgcHVibGljIHJlcXVpcmVkID0gZmFsc2U7XHJcblxyXG4gICAgLyoqIFJlZmVyZW5jZSB0byB0aGUgZ2xURiBleHBvcnRlciAqL1xyXG4gICAgcHJpdmF0ZSBfd2FzVXNlZCA9IGZhbHNlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge31cclxuXHJcbiAgICBwdWJsaWMgZGlzcG9zZSgpIHt9XHJcblxyXG4gICAgLyoqIEBpbnRlcm5hbCAqL1xyXG4gICAgcHVibGljIGdldCB3YXNVc2VkKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl93YXNVc2VkO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBwb3N0RXhwb3J0VGV4dHVyZT8oY29udGV4dDogc3RyaW5nLCB0ZXh0dXJlSW5mbzogSVRleHR1cmVJbmZvLCBiYWJ5bG9uVGV4dHVyZTogVGV4dHVyZSk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IGNhblVzZUV4dGVuc2lvbiA9XHJcbiAgICAgICAgICAgIGJhYnlsb25UZXh0dXJlICYmXHJcbiAgICAgICAgICAgICgoYmFieWxvblRleHR1cmUudUFuZyA9PT0gMCAmJiBiYWJ5bG9uVGV4dHVyZS53QW5nID09PSAwICYmIGJhYnlsb25UZXh0dXJlLnZBbmcgPT09IDApIHx8XHJcbiAgICAgICAgICAgICAgICAoYmFieWxvblRleHR1cmUudVJvdGF0aW9uQ2VudGVyID09PSAwICYmIGJhYnlsb25UZXh0dXJlLnZSb3RhdGlvbkNlbnRlciA9PT0gMCkpO1xyXG5cclxuICAgICAgICBpZiAoY2FuVXNlRXh0ZW5zaW9uKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRleHR1cmVUcmFuc2Zvcm06IElLSFJUZXh0dXJlVHJhbnNmb3JtID0ge307XHJcbiAgICAgICAgICAgIGxldCB0cmFuc2Zvcm1Jc1JlcXVpcmVkID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICBpZiAoYmFieWxvblRleHR1cmUudU9mZnNldCAhPT0gMCB8fCBiYWJ5bG9uVGV4dHVyZS52T2Zmc2V0ICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0dXJlVHJhbnNmb3JtLm9mZnNldCA9IFtiYWJ5bG9uVGV4dHVyZS51T2Zmc2V0LCBiYWJ5bG9uVGV4dHVyZS52T2Zmc2V0XTtcclxuICAgICAgICAgICAgICAgIHRyYW5zZm9ybUlzUmVxdWlyZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoYmFieWxvblRleHR1cmUudVNjYWxlICE9PSAxIHx8IGJhYnlsb25UZXh0dXJlLnZTY2FsZSAhPT0gMSkge1xyXG4gICAgICAgICAgICAgICAgdGV4dHVyZVRyYW5zZm9ybS5zY2FsZSA9IFtiYWJ5bG9uVGV4dHVyZS51U2NhbGUsIGJhYnlsb25UZXh0dXJlLnZTY2FsZV07XHJcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm1Jc1JlcXVpcmVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGJhYnlsb25UZXh0dXJlLndBbmcgIT09IDApIHtcclxuICAgICAgICAgICAgICAgIHRleHR1cmVUcmFuc2Zvcm0ucm90YXRpb24gPSAtYmFieWxvblRleHR1cmUud0FuZztcclxuICAgICAgICAgICAgICAgIHRyYW5zZm9ybUlzUmVxdWlyZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoYmFieWxvblRleHR1cmUuY29vcmRpbmF0ZXNJbmRleCAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgdGV4dHVyZVRyYW5zZm9ybS50ZXhDb29yZCA9IGJhYnlsb25UZXh0dXJlLmNvb3JkaW5hdGVzSW5kZXg7XHJcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm1Jc1JlcXVpcmVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCF0cmFuc2Zvcm1Jc1JlcXVpcmVkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuX3dhc1VzZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICBpZiAoIXRleHR1cmVJbmZvLmV4dGVuc2lvbnMpIHtcclxuICAgICAgICAgICAgICAgIHRleHR1cmVJbmZvLmV4dGVuc2lvbnMgPSB7fTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0ZXh0dXJlSW5mby5leHRlbnNpb25zW05BTUVdID0gdGV4dHVyZVRyYW5zZm9ybTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHByZUV4cG9ydFRleHR1cmVBc3luYyhjb250ZXh0OiBzdHJpbmcsIGJhYnlsb25UZXh0dXJlOiBUZXh0dXJlKTogUHJvbWlzZTxOdWxsYWJsZTxUZXh0dXJlPj4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNjZW5lID0gYmFieWxvblRleHR1cmUuZ2V0U2NlbmUoKTtcclxuICAgICAgICAgICAgaWYgKCFzY2VuZSkge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGAke2NvbnRleHR9OiBcInNjZW5lXCIgaXMgbm90IGRlZmluZWQgZm9yIEJhYnlsb24gdGV4dHVyZSAke2JhYnlsb25UZXh0dXJlLm5hbWV9IWApO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBUaGUgS0hSX3RleHR1cmVfdHJhbnNmb3JtIHNjaGVtYSBvbmx5IHN1cHBvcnRzIHcgcm90YXRpb24gYXJvdW5kIHRoZSBvcmlnaW4uXHJcbiAgICAgICAgICAgICAqIFNlZSBodHRwczovL2dpdGh1Yi5jb20vS2hyb25vc0dyb3VwL2dsVEYvdHJlZS9tYWluL2V4dGVuc2lvbnMvMi4wL0tocm9ub3MvS0hSX3RleHR1cmVfdHJhbnNmb3JtI2dsdGYtc2NoZW1hLXVwZGF0ZXMuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpZiAoYmFieWxvblRleHR1cmUudUFuZyAhPT0gMCB8fCBiYWJ5bG9uVGV4dHVyZS52QW5nICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBUb29scy5XYXJuKGAke2NvbnRleHR9OiBUZXh0dXJlICR7YmFieWxvblRleHR1cmUubmFtZX0gd2l0aCByb3RhdGlvbiBpbiB0aGUgdSBvciB2IGF4aXMgaXMgbm90IHN1cHBvcnRlZCBpbiBnbFRGLmApO1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShudWxsKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChiYWJ5bG9uVGV4dHVyZS53QW5nICE9PSAwICYmIChiYWJ5bG9uVGV4dHVyZS51Um90YXRpb25DZW50ZXIgIT09IDAgfHwgYmFieWxvblRleHR1cmUudlJvdGF0aW9uQ2VudGVyICE9PSAwKSkge1xyXG4gICAgICAgICAgICAgICAgVG9vbHMuV2FybihgJHtjb250ZXh0fTogVGV4dHVyZSAke2JhYnlsb25UZXh0dXJlLm5hbWV9IHdpdGggcm90YXRpb24gbm90IGNlbnRlcmVkIGF0IHRoZSBvcmlnaW4gY2Fubm90IGJlIGV4cG9ydGVkIHdpdGggJHtOQU1FfWApO1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShudWxsKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoYmFieWxvblRleHR1cmUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbl9FeHBvcnRlci5SZWdpc3RlckV4dGVuc2lvbihOQU1FLCAoKSA9PiBuZXcgS0hSX3RleHR1cmVfdHJhbnNmb3JtKCkpO1xyXG4iLCJleHBvcnQgKiBmcm9tIFwiLi9LSFJfdGV4dHVyZV90cmFuc2Zvcm1cIjtcclxuZXhwb3J0ICogZnJvbSBcIi4vS0hSX2xpZ2h0c19wdW5jdHVhbFwiO1xyXG5leHBvcnQgKiBmcm9tIFwiLi9LSFJfbWF0ZXJpYWxzX2NsZWFyY29hdFwiO1xyXG5leHBvcnQgKiBmcm9tIFwiLi9LSFJfbWF0ZXJpYWxzX2lyaWRlc2NlbmNlXCI7XHJcbmV4cG9ydCAqIGZyb20gXCIuL0tIUl9tYXRlcmlhbHNfYW5pc290cm9weVwiO1xyXG5leHBvcnQgKiBmcm9tIFwiLi9LSFJfbWF0ZXJpYWxzX3NoZWVuXCI7XHJcbmV4cG9ydCAqIGZyb20gXCIuL0tIUl9tYXRlcmlhbHNfdW5saXRcIjtcclxuZXhwb3J0ICogZnJvbSBcIi4vS0hSX21hdGVyaWFsc19pb3JcIjtcclxuZXhwb3J0ICogZnJvbSBcIi4vS0hSX21hdGVyaWFsc19zcGVjdWxhclwiO1xyXG5leHBvcnQgKiBmcm9tIFwiLi9LSFJfbWF0ZXJpYWxzX3ZvbHVtZVwiO1xyXG5leHBvcnQgKiBmcm9tIFwiLi9LSFJfbWF0ZXJpYWxzX2Rpc3BlcnNpb25cIjtcclxuZXhwb3J0ICogZnJvbSBcIi4vS0hSX21hdGVyaWFsc190cmFuc21pc3Npb25cIjtcclxuZXhwb3J0ICogZnJvbSBcIi4vRVhUX21lc2hfZ3B1X2luc3RhbmNpbmdcIjtcclxuZXhwb3J0ICogZnJvbSBcIi4vS0hSX21hdGVyaWFsc19lbWlzc2l2ZV9zdHJlbmd0aFwiO1xyXG5leHBvcnQgKiBmcm9tIFwiLi9LSFJfbWF0ZXJpYWxzX2RpZmZ1c2VfdHJhbnNtaXNzaW9uXCI7XHJcbiIsImltcG9ydCB0eXBlIHsgSUFuaW1hdGlvbiwgSU5vZGUsIElCdWZmZXJWaWV3LCBJQWNjZXNzb3IsIElBbmltYXRpb25TYW1wbGVyLCBJQW5pbWF0aW9uQ2hhbm5lbCB9IGZyb20gXCJiYWJ5bG9uanMtZ2x0ZjJpbnRlcmZhY2VcIjtcclxuaW1wb3J0IHsgQW5pbWF0aW9uU2FtcGxlckludGVycG9sYXRpb24sIEFuaW1hdGlvbkNoYW5uZWxUYXJnZXRQYXRoLCBBY2Nlc3NvclR5cGUsIEFjY2Vzc29yQ29tcG9uZW50VHlwZSB9IGZyb20gXCJiYWJ5bG9uanMtZ2x0ZjJpbnRlcmZhY2VcIjtcclxuaW1wb3J0IHR5cGUgeyBOb2RlIH0gZnJvbSBcImNvcmUvbm9kZVwiO1xyXG5pbXBvcnQgdHlwZSB7IE51bGxhYmxlIH0gZnJvbSBcImNvcmUvdHlwZXNcIjtcclxuaW1wb3J0IHsgVmVjdG9yMywgUXVhdGVybmlvbiB9IGZyb20gXCJjb3JlL01hdGhzL21hdGgudmVjdG9yXCI7XHJcbmltcG9ydCB7IFRvb2xzIH0gZnJvbSBcImNvcmUvTWlzYy90b29sc1wiO1xyXG5pbXBvcnQgeyBBbmltYXRpb24gfSBmcm9tIFwiY29yZS9BbmltYXRpb25zL2FuaW1hdGlvblwiO1xyXG5pbXBvcnQgeyBUcmFuc2Zvcm1Ob2RlIH0gZnJvbSBcImNvcmUvTWVzaGVzL3RyYW5zZm9ybU5vZGVcIjtcclxuaW1wb3J0IHR5cGUgeyBTY2VuZSB9IGZyb20gXCJjb3JlL3NjZW5lXCI7XHJcbmltcG9ydCB7IE1vcnBoVGFyZ2V0IH0gZnJvbSBcImNvcmUvTW9ycGgvbW9ycGhUYXJnZXRcIjtcclxuaW1wb3J0IHsgTWVzaCB9IGZyb20gXCJjb3JlL01lc2hlcy9tZXNoXCI7XHJcblxyXG5pbXBvcnQgdHlwZSB7IF9CaW5hcnlXcml0ZXIgfSBmcm9tIFwiLi9nbFRGRXhwb3J0ZXJcIjtcclxuaW1wb3J0IHsgX0dMVEZVdGlsaXRpZXMgfSBmcm9tIFwiLi9nbFRGVXRpbGl0aWVzXCI7XHJcbmltcG9ydCB0eXBlIHsgSUFuaW1hdGlvbktleSB9IGZyb20gXCJjb3JlL0FuaW1hdGlvbnMvYW5pbWF0aW9uS2V5XCI7XHJcbmltcG9ydCB7IEFuaW1hdGlvbktleUludGVycG9sYXRpb24gfSBmcm9tIFwiY29yZS9BbmltYXRpb25zL2FuaW1hdGlvbktleVwiO1xyXG5cclxuaW1wb3J0IHsgQ2FtZXJhIH0gZnJvbSBcImNvcmUvQ2FtZXJhcy9jYW1lcmFcIjtcclxuaW1wb3J0IHsgTGlnaHQgfSBmcm9tIFwiY29yZS9MaWdodHMvbGlnaHRcIjtcclxuXHJcbi8qKlxyXG4gKiBAaW50ZXJuYWxcclxuICogSW50ZXJmYWNlIHRvIHN0b3JlIGFuaW1hdGlvbiBkYXRhLlxyXG4gKi9cclxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uYW1pbmctY29udmVudGlvblxyXG5leHBvcnQgaW50ZXJmYWNlIF9JQW5pbWF0aW9uRGF0YSB7XHJcbiAgICAvKipcclxuICAgICAqIEtleWZyYW1lIGRhdGEuXHJcbiAgICAgKi9cclxuICAgIGlucHV0czogbnVtYmVyW107XHJcbiAgICAvKipcclxuICAgICAqIFZhbHVlIGRhdGEuXHJcbiAgICAgKi9cclxuICAgIG91dHB1dHM6IG51bWJlcltdW107XHJcbiAgICAvKipcclxuICAgICAqIEFuaW1hdGlvbiBpbnRlcnBvbGF0aW9uIGRhdGEuXHJcbiAgICAgKi9cclxuICAgIHNhbXBsZXJJbnRlcnBvbGF0aW9uOiBBbmltYXRpb25TYW1wbGVySW50ZXJwb2xhdGlvbjtcclxuICAgIC8qKlxyXG4gICAgICogTWluaW11bSBrZXlmcmFtZSB2YWx1ZS5cclxuICAgICAqL1xyXG4gICAgaW5wdXRzTWluOiBudW1iZXI7XHJcbiAgICAvKipcclxuICAgICAqIE1heGltdW0ga2V5ZnJhbWUgdmFsdWUuXHJcbiAgICAgKi9cclxuICAgIGlucHV0c01heDogbnVtYmVyO1xyXG59XHJcblxyXG4vKipcclxuICogQGludGVybmFsXHJcbiAqL1xyXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25hbWluZy1jb252ZW50aW9uXHJcbmV4cG9ydCBpbnRlcmZhY2UgX0lBbmltYXRpb25JbmZvIHtcclxuICAgIC8qKlxyXG4gICAgICogVGhlIHRhcmdldCBjaGFubmVsIGZvciB0aGUgYW5pbWF0aW9uXHJcbiAgICAgKi9cclxuICAgIGFuaW1hdGlvbkNoYW5uZWxUYXJnZXRQYXRoOiBBbmltYXRpb25DaGFubmVsVGFyZ2V0UGF0aDtcclxuICAgIC8qKlxyXG4gICAgICogVGhlIGdsVEYgYWNjZXNzb3IgdHlwZSBmb3IgdGhlIGRhdGEuXHJcbiAgICAgKi9cclxuICAgIGRhdGFBY2Nlc3NvclR5cGU6IEFjY2Vzc29yVHlwZS5WRUMzIHwgQWNjZXNzb3JUeXBlLlZFQzQgfCBBY2Nlc3NvclR5cGUuU0NBTEFSO1xyXG4gICAgLyoqXHJcbiAgICAgKiBTcGVjaWZpZXMgaWYgcXVhdGVybmlvbnMgc2hvdWxkIGJlIHVzZWQuXHJcbiAgICAgKi9cclxuICAgIHVzZVF1YXRlcm5pb246IGJvb2xlYW47XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAaW50ZXJuYWxcclxuICogRW51bSBmb3IgaGFuZGxpbmcgaW4gdGFuZ2VudCBhbmQgb3V0IHRhbmdlbnQuXHJcbiAqL1xyXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25hbWluZy1jb252ZW50aW9uXHJcbmVudW0gX1RhbmdlbnRUeXBlIHtcclxuICAgIC8qKlxyXG4gICAgICogU3BlY2lmaWVzIHRoYXQgaW5wdXQgdGFuZ2VudHMgYXJlIHVzZWQuXHJcbiAgICAgKi9cclxuICAgIElOVEFOR0VOVCxcclxuICAgIC8qKlxyXG4gICAgICogU3BlY2lmaWVzIHRoYXQgb3V0cHV0IHRhbmdlbnRzIGFyZSB1c2VkLlxyXG4gICAgICovXHJcbiAgICBPVVRUQU5HRU5ULFxyXG59XHJcblxyXG4vKipcclxuICogQGludGVybmFsXHJcbiAqIFV0aWxpdHkgY2xhc3MgZm9yIGdlbmVyYXRpbmcgZ2xURiBhbmltYXRpb24gZGF0YSBmcm9tIEJhYnlsb25KUy5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBfR0xURkFuaW1hdGlvbiB7XHJcbiAgICAvKipcclxuICAgICAqIERldGVybWluZSBpZiBhIG5vZGUgaXMgdHJhbnNmb3JtYWJsZSAtIGllIGhhcyBwcm9wZXJ0aWVzIGl0IHNob3VsZCBiZSBwYXJ0IG9mIGFuaW1hdGlvbiBvZiB0cmFuc2Zvcm1hdGlvbi5cclxuICAgICAqIEBwYXJhbSBiYWJ5bG9uTm9kZSB0aGUgbm9kZSB0byB0ZXN0XHJcbiAgICAgKiBAcmV0dXJucyB0cnVlIGlmIGNhbiBiZSBhbmltYXRlZCwgZmFsc2Ugb3RoZXJ3aXNlLiBGYWxzZSBpZiB0aGUgcGFyYW1ldGVyIGlzIG51bGwgb3IgdW5kZWZpbmVkLlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyBfSXNUcmFuc2Zvcm1hYmxlKGJhYnlsb25Ob2RlOiBOb2RlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIGJhYnlsb25Ob2RlICYmIChiYWJ5bG9uTm9kZSBpbnN0YW5jZW9mIFRyYW5zZm9ybU5vZGUgfHwgYmFieWxvbk5vZGUgaW5zdGFuY2VvZiBDYW1lcmEgfHwgYmFieWxvbk5vZGUgaW5zdGFuY2VvZiBMaWdodCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaWdub3JlXHJcbiAgICAgKlxyXG4gICAgICogQ3JlYXRlcyBnbFRGIGNoYW5uZWwgYW5pbWF0aW9uIGZyb20gQmFieWxvbkpTIGFuaW1hdGlvbi5cclxuICAgICAqIEBwYXJhbSBiYWJ5bG9uVHJhbnNmb3JtTm9kZSAtIEJhYnlsb25KUyBtZXNoLlxyXG4gICAgICogQHBhcmFtIGFuaW1hdGlvbiAtIGFuaW1hdGlvbi5cclxuICAgICAqIEBwYXJhbSBhbmltYXRpb25DaGFubmVsVGFyZ2V0UGF0aCAtIFRoZSB0YXJnZXQgYW5pbWF0aW9uIGNoYW5uZWwuXHJcbiAgICAgKiBAcGFyYW0gdXNlUXVhdGVybmlvbiAtIFNwZWNpZmllcyBpZiBxdWF0ZXJuaW9ucyBhcmUgdXNlZC5cclxuICAgICAqIEByZXR1cm5zIG51bGxhYmxlIElBbmltYXRpb25EYXRhXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgX0NyZWF0ZU5vZGVBbmltYXRpb24oXHJcbiAgICAgICAgYmFieWxvblRyYW5zZm9ybU5vZGU6IE5vZGUsXHJcbiAgICAgICAgYW5pbWF0aW9uOiBBbmltYXRpb24sXHJcbiAgICAgICAgYW5pbWF0aW9uQ2hhbm5lbFRhcmdldFBhdGg6IEFuaW1hdGlvbkNoYW5uZWxUYXJnZXRQYXRoLFxyXG4gICAgICAgIHVzZVF1YXRlcm5pb246IGJvb2xlYW4sXHJcbiAgICAgICAgYW5pbWF0aW9uU2FtcGxlUmF0ZTogbnVtYmVyXHJcbiAgICApOiBOdWxsYWJsZTxfSUFuaW1hdGlvbkRhdGE+IHtcclxuICAgICAgICBpZiAodGhpcy5fSXNUcmFuc2Zvcm1hYmxlKGJhYnlsb25UcmFuc2Zvcm1Ob2RlKSkge1xyXG4gICAgICAgICAgICBjb25zdCBpbnB1dHM6IG51bWJlcltdID0gW107XHJcbiAgICAgICAgICAgIGNvbnN0IG91dHB1dHM6IG51bWJlcltdW10gPSBbXTtcclxuICAgICAgICAgICAgY29uc3Qga2V5RnJhbWVzID0gYW5pbWF0aW9uLmdldEtleXMoKTtcclxuICAgICAgICAgICAgY29uc3QgbWluTWF4S2V5RnJhbWVzID0gX0dMVEZBbmltYXRpb24uX0NhbGN1bGF0ZU1pbk1heEtleUZyYW1lcyhrZXlGcmFtZXMpO1xyXG4gICAgICAgICAgICBjb25zdCBpbnRlcnBvbGF0aW9uT3JCYWtlID0gX0dMVEZBbmltYXRpb24uX0RlZHVjZUludGVycG9sYXRpb24oa2V5RnJhbWVzLCBhbmltYXRpb25DaGFubmVsVGFyZ2V0UGF0aCwgdXNlUXVhdGVybmlvbik7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBpbnRlcnBvbGF0aW9uID0gaW50ZXJwb2xhdGlvbk9yQmFrZS5pbnRlcnBvbGF0aW9uVHlwZTtcclxuICAgICAgICAgICAgY29uc3Qgc2hvdWxkQmFrZUFuaW1hdGlvbiA9IGludGVycG9sYXRpb25PckJha2Uuc2hvdWxkQmFrZUFuaW1hdGlvbjtcclxuXHJcbiAgICAgICAgICAgIGlmIChzaG91bGRCYWtlQW5pbWF0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICBfR0xURkFuaW1hdGlvbi5fQ3JlYXRlQmFrZWRBbmltYXRpb24oXHJcbiAgICAgICAgICAgICAgICAgICAgYmFieWxvblRyYW5zZm9ybU5vZGUsXHJcbiAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uLFxyXG4gICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvbkNoYW5uZWxUYXJnZXRQYXRoLFxyXG4gICAgICAgICAgICAgICAgICAgIG1pbk1heEtleUZyYW1lcy5taW4sXHJcbiAgICAgICAgICAgICAgICAgICAgbWluTWF4S2V5RnJhbWVzLm1heCxcclxuICAgICAgICAgICAgICAgICAgICBhbmltYXRpb24uZnJhbWVQZXJTZWNvbmQsXHJcbiAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uU2FtcGxlUmF0ZSxcclxuICAgICAgICAgICAgICAgICAgICBpbnB1dHMsXHJcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0cyxcclxuICAgICAgICAgICAgICAgICAgICBtaW5NYXhLZXlGcmFtZXMsXHJcbiAgICAgICAgICAgICAgICAgICAgdXNlUXVhdGVybmlvblxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChpbnRlcnBvbGF0aW9uID09PSBBbmltYXRpb25TYW1wbGVySW50ZXJwb2xhdGlvbi5MSU5FQVIgfHwgaW50ZXJwb2xhdGlvbiA9PT0gQW5pbWF0aW9uU2FtcGxlckludGVycG9sYXRpb24uU1RFUCkge1xyXG4gICAgICAgICAgICAgICAgICAgIF9HTFRGQW5pbWF0aW9uLl9DcmVhdGVMaW5lYXJPclN0ZXBBbmltYXRpb24oYmFieWxvblRyYW5zZm9ybU5vZGUsIGFuaW1hdGlvbiwgYW5pbWF0aW9uQ2hhbm5lbFRhcmdldFBhdGgsIGlucHV0cywgb3V0cHV0cywgdXNlUXVhdGVybmlvbik7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGludGVycG9sYXRpb24gPT09IEFuaW1hdGlvblNhbXBsZXJJbnRlcnBvbGF0aW9uLkNVQklDU1BMSU5FKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgX0dMVEZBbmltYXRpb24uX0NyZWF0ZUN1YmljU3BsaW5lQW5pbWF0aW9uKGJhYnlsb25UcmFuc2Zvcm1Ob2RlLCBhbmltYXRpb24sIGFuaW1hdGlvbkNoYW5uZWxUYXJnZXRQYXRoLCBpbnB1dHMsIG91dHB1dHMsIHVzZVF1YXRlcm5pb24pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBfR0xURkFuaW1hdGlvbi5fQ3JlYXRlQmFrZWRBbmltYXRpb24oXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhYnlsb25UcmFuc2Zvcm1Ob2RlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvbkNoYW5uZWxUYXJnZXRQYXRoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtaW5NYXhLZXlGcmFtZXMubWluLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtaW5NYXhLZXlGcmFtZXMubWF4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRpb24uZnJhbWVQZXJTZWNvbmQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvblNhbXBsZVJhdGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0cyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0cyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWluTWF4S2V5RnJhbWVzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB1c2VRdWF0ZXJuaW9uXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGlucHV0cy5sZW5ndGggJiYgb3V0cHV0cy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdDogX0lBbmltYXRpb25EYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlucHV0czogaW5wdXRzLFxyXG4gICAgICAgICAgICAgICAgICAgIG91dHB1dHM6IG91dHB1dHMsXHJcbiAgICAgICAgICAgICAgICAgICAgc2FtcGxlckludGVycG9sYXRpb246IGludGVycG9sYXRpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgaW5wdXRzTWluOiBzaG91bGRCYWtlQW5pbWF0aW9uID8gbWluTWF4S2V5RnJhbWVzLm1pbiA6IFRvb2xzLkZsb2F0Um91bmQobWluTWF4S2V5RnJhbWVzLm1pbiAvIGFuaW1hdGlvbi5mcmFtZVBlclNlY29uZCksXHJcbiAgICAgICAgICAgICAgICAgICAgaW5wdXRzTWF4OiBzaG91bGRCYWtlQW5pbWF0aW9uID8gbWluTWF4S2V5RnJhbWVzLm1heCA6IFRvb2xzLkZsb2F0Um91bmQobWluTWF4S2V5RnJhbWVzLm1heCAvIGFuaW1hdGlvbi5mcmFtZVBlclNlY29uZCksXHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIF9EZWR1Y2VBbmltYXRpb25JbmZvKGFuaW1hdGlvbjogQW5pbWF0aW9uKTogTnVsbGFibGU8X0lBbmltYXRpb25JbmZvPiB7XHJcbiAgICAgICAgbGV0IGFuaW1hdGlvbkNoYW5uZWxUYXJnZXRQYXRoOiBOdWxsYWJsZTxBbmltYXRpb25DaGFubmVsVGFyZ2V0UGF0aD4gPSBudWxsO1xyXG4gICAgICAgIGxldCBkYXRhQWNjZXNzb3JUeXBlID0gQWNjZXNzb3JUeXBlLlZFQzM7XHJcbiAgICAgICAgbGV0IHVzZVF1YXRlcm5pb246IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICBjb25zdCBwcm9wZXJ0eSA9IGFuaW1hdGlvbi50YXJnZXRQcm9wZXJ0eS5zcGxpdChcIi5cIik7XHJcbiAgICAgICAgc3dpdGNoIChwcm9wZXJ0eVswXSkge1xyXG4gICAgICAgICAgICBjYXNlIFwic2NhbGluZ1wiOiB7XHJcbiAgICAgICAgICAgICAgICBhbmltYXRpb25DaGFubmVsVGFyZ2V0UGF0aCA9IEFuaW1hdGlvbkNoYW5uZWxUYXJnZXRQYXRoLlNDQUxFO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSBcInBvc2l0aW9uXCI6IHtcclxuICAgICAgICAgICAgICAgIGFuaW1hdGlvbkNoYW5uZWxUYXJnZXRQYXRoID0gQW5pbWF0aW9uQ2hhbm5lbFRhcmdldFBhdGguVFJBTlNMQVRJT047XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIFwicm90YXRpb25cIjoge1xyXG4gICAgICAgICAgICAgICAgZGF0YUFjY2Vzc29yVHlwZSA9IEFjY2Vzc29yVHlwZS5WRUM0O1xyXG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uQ2hhbm5lbFRhcmdldFBhdGggPSBBbmltYXRpb25DaGFubmVsVGFyZ2V0UGF0aC5ST1RBVElPTjtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhc2UgXCJyb3RhdGlvblF1YXRlcm5pb25cIjoge1xyXG4gICAgICAgICAgICAgICAgZGF0YUFjY2Vzc29yVHlwZSA9IEFjY2Vzc29yVHlwZS5WRUM0O1xyXG4gICAgICAgICAgICAgICAgdXNlUXVhdGVybmlvbiA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBhbmltYXRpb25DaGFubmVsVGFyZ2V0UGF0aCA9IEFuaW1hdGlvbkNoYW5uZWxUYXJnZXRQYXRoLlJPVEFUSU9OO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSBcImluZmx1ZW5jZVwiOiB7XHJcbiAgICAgICAgICAgICAgICBkYXRhQWNjZXNzb3JUeXBlID0gQWNjZXNzb3JUeXBlLlNDQUxBUjtcclxuICAgICAgICAgICAgICAgIGFuaW1hdGlvbkNoYW5uZWxUYXJnZXRQYXRoID0gQW5pbWF0aW9uQ2hhbm5lbFRhcmdldFBhdGguV0VJR0hUUztcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IHtcclxuICAgICAgICAgICAgICAgIFRvb2xzLkVycm9yKGBVbnN1cHBvcnRlZCBhbmltYXRhYmxlIHByb3BlcnR5ICR7cHJvcGVydHlbMF19YCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGFuaW1hdGlvbkNoYW5uZWxUYXJnZXRQYXRoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7IGFuaW1hdGlvbkNoYW5uZWxUYXJnZXRQYXRoOiBhbmltYXRpb25DaGFubmVsVGFyZ2V0UGF0aCwgZGF0YUFjY2Vzc29yVHlwZTogZGF0YUFjY2Vzc29yVHlwZSwgdXNlUXVhdGVybmlvbjogdXNlUXVhdGVybmlvbiB9O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIFRvb2xzLkVycm9yKFwiYW5pbWF0aW9uIGNoYW5uZWwgdGFyZ2V0IHBhdGggYW5kIGRhdGEgYWNjZXNzb3IgdHlwZSBjb3VsZCBiZSBkZWR1Y2VkXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBpZ25vcmVcclxuICAgICAqIENyZWF0ZSBub2RlIGFuaW1hdGlvbnMgZnJvbSB0aGUgdHJhbnNmb3JtIG5vZGUgYW5pbWF0aW9uc1xyXG4gICAgICogQHBhcmFtIGJhYnlsb25Ob2RlXHJcbiAgICAgKiBAcGFyYW0gcnVudGltZUdMVEZBbmltYXRpb25cclxuICAgICAqIEBwYXJhbSBpZGxlR0xURkFuaW1hdGlvbnNcclxuICAgICAqIEBwYXJhbSBub2RlTWFwXHJcbiAgICAgKiBAcGFyYW0gbm9kZXNcclxuICAgICAqIEBwYXJhbSBiaW5hcnlXcml0ZXJcclxuICAgICAqIEBwYXJhbSBidWZmZXJWaWV3c1xyXG4gICAgICogQHBhcmFtIGFjY2Vzc29yc1xyXG4gICAgICogQHBhcmFtIGFuaW1hdGlvblNhbXBsZVJhdGVcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBfQ3JlYXRlTm9kZUFuaW1hdGlvbkZyb21Ob2RlQW5pbWF0aW9ucyhcclxuICAgICAgICBiYWJ5bG9uTm9kZTogTm9kZSxcclxuICAgICAgICBydW50aW1lR0xURkFuaW1hdGlvbjogSUFuaW1hdGlvbixcclxuICAgICAgICBpZGxlR0xURkFuaW1hdGlvbnM6IElBbmltYXRpb25bXSxcclxuICAgICAgICBub2RlTWFwOiB7IFtrZXk6IG51bWJlcl06IG51bWJlciB9LFxyXG4gICAgICAgIG5vZGVzOiBJTm9kZVtdLFxyXG4gICAgICAgIGJpbmFyeVdyaXRlcjogX0JpbmFyeVdyaXRlcixcclxuICAgICAgICBidWZmZXJWaWV3czogSUJ1ZmZlclZpZXdbXSxcclxuICAgICAgICBhY2Nlc3NvcnM6IElBY2Nlc3NvcltdLFxyXG4gICAgICAgIGFuaW1hdGlvblNhbXBsZVJhdGU6IG51bWJlcixcclxuICAgICAgICBzaG91bGRFeHBvcnRBbmltYXRpb24/OiAoYW5pbWF0aW9uOiBBbmltYXRpb24pID0+IGJvb2xlYW5cclxuICAgICkge1xyXG4gICAgICAgIGxldCBnbFRGQW5pbWF0aW9uOiBJQW5pbWF0aW9uO1xyXG4gICAgICAgIGlmIChfR0xURkFuaW1hdGlvbi5fSXNUcmFuc2Zvcm1hYmxlKGJhYnlsb25Ob2RlKSkge1xyXG4gICAgICAgICAgICBpZiAoYmFieWxvbk5vZGUuYW5pbWF0aW9ucykge1xyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBhbmltYXRpb24gb2YgYmFieWxvbk5vZGUuYW5pbWF0aW9ucykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzaG91bGRFeHBvcnRBbmltYXRpb24gJiYgIXNob3VsZEV4cG9ydEFuaW1hdGlvbihhbmltYXRpb24pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhbmltYXRpb25JbmZvID0gX0dMVEZBbmltYXRpb24uX0RlZHVjZUFuaW1hdGlvbkluZm8oYW5pbWF0aW9uKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYW5pbWF0aW9uSW5mbykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBnbFRGQW5pbWF0aW9uID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogYW5pbWF0aW9uLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzYW1wbGVyczogW10sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFubmVsczogW10sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9HTFRGQW5pbWF0aW9uLl9BZGRBbmltYXRpb24oXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBgJHthbmltYXRpb24ubmFtZX1gLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uLmhhc1J1bm5pbmdSdW50aW1lQW5pbWF0aW9ucyA/IHJ1bnRpbWVHTFRGQW5pbWF0aW9uIDogZ2xURkFuaW1hdGlvbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhYnlsb25Ob2RlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uSW5mby5kYXRhQWNjZXNzb3JUeXBlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uSW5mby5hbmltYXRpb25DaGFubmVsVGFyZ2V0UGF0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVNYXAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiaW5hcnlXcml0ZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWZmZXJWaWV3cyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjY2Vzc29ycyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvbkluZm8udXNlUXVhdGVybmlvbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvblNhbXBsZVJhdGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGdsVEZBbmltYXRpb24uc2FtcGxlcnMubGVuZ3RoICYmIGdsVEZBbmltYXRpb24uY2hhbm5lbHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZGxlR0xURkFuaW1hdGlvbnMucHVzaChnbFRGQW5pbWF0aW9uKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBpZ25vcmVcclxuICAgICAqIENyZWF0ZSBpbmRpdmlkdWFsIG1vcnBoIGFuaW1hdGlvbnMgZnJvbSB0aGUgbWVzaCdzIG1vcnBoIHRhcmdldCBhbmltYXRpb24gdHJhY2tzXHJcbiAgICAgKiBAcGFyYW0gYmFieWxvbk5vZGVcclxuICAgICAqIEBwYXJhbSBydW50aW1lR0xURkFuaW1hdGlvblxyXG4gICAgICogQHBhcmFtIGlkbGVHTFRGQW5pbWF0aW9uc1xyXG4gICAgICogQHBhcmFtIG5vZGVNYXBcclxuICAgICAqIEBwYXJhbSBub2Rlc1xyXG4gICAgICogQHBhcmFtIGJpbmFyeVdyaXRlclxyXG4gICAgICogQHBhcmFtIGJ1ZmZlclZpZXdzXHJcbiAgICAgKiBAcGFyYW0gYWNjZXNzb3JzXHJcbiAgICAgKiBAcGFyYW0gYW5pbWF0aW9uU2FtcGxlUmF0ZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIF9DcmVhdGVNb3JwaFRhcmdldEFuaW1hdGlvbkZyb21Nb3JwaFRhcmdldEFuaW1hdGlvbnMoXHJcbiAgICAgICAgYmFieWxvbk5vZGU6IE5vZGUsXHJcbiAgICAgICAgcnVudGltZUdMVEZBbmltYXRpb246IElBbmltYXRpb24sXHJcbiAgICAgICAgaWRsZUdMVEZBbmltYXRpb25zOiBJQW5pbWF0aW9uW10sXHJcbiAgICAgICAgbm9kZU1hcDogeyBba2V5OiBudW1iZXJdOiBudW1iZXIgfSxcclxuICAgICAgICBub2RlczogSU5vZGVbXSxcclxuICAgICAgICBiaW5hcnlXcml0ZXI6IF9CaW5hcnlXcml0ZXIsXHJcbiAgICAgICAgYnVmZmVyVmlld3M6IElCdWZmZXJWaWV3W10sXHJcbiAgICAgICAgYWNjZXNzb3JzOiBJQWNjZXNzb3JbXSxcclxuICAgICAgICBhbmltYXRpb25TYW1wbGVSYXRlOiBudW1iZXIsXHJcbiAgICAgICAgc2hvdWxkRXhwb3J0QW5pbWF0aW9uPzogKGFuaW1hdGlvbjogQW5pbWF0aW9uKSA9PiBib29sZWFuXHJcbiAgICApIHtcclxuICAgICAgICBsZXQgZ2xURkFuaW1hdGlvbjogSUFuaW1hdGlvbjtcclxuICAgICAgICBpZiAoYmFieWxvbk5vZGUgaW5zdGFuY2VvZiBNZXNoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG1vcnBoVGFyZ2V0TWFuYWdlciA9IGJhYnlsb25Ob2RlLm1vcnBoVGFyZ2V0TWFuYWdlcjtcclxuICAgICAgICAgICAgaWYgKG1vcnBoVGFyZ2V0TWFuYWdlcikge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtb3JwaFRhcmdldE1hbmFnZXIubnVtVGFyZ2V0czsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbW9ycGhUYXJnZXQgPSBtb3JwaFRhcmdldE1hbmFnZXIuZ2V0VGFyZ2V0KGkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgYW5pbWF0aW9uIG9mIG1vcnBoVGFyZ2V0LmFuaW1hdGlvbnMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNob3VsZEV4cG9ydEFuaW1hdGlvbiAmJiAhc2hvdWxkRXhwb3J0QW5pbWF0aW9uKGFuaW1hdGlvbikpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbWJpbmVkQW5pbWF0aW9uID0gbmV3IEFuaW1hdGlvbihcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGAke2FuaW1hdGlvbi5uYW1lfWAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImluZmx1ZW5jZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uLmZyYW1lUGVyU2Vjb25kLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uLmRhdGFUeXBlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uLmxvb3BNb2RlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uLmVuYWJsZUJsZW5kaW5nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbWJpbmVkQW5pbWF0aW9uS2V5czogSUFuaW1hdGlvbktleVtdID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGFuaW1hdGlvbktleXMgPSBhbmltYXRpb24uZ2V0S2V5cygpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBhbmltYXRpb25LZXlzLmxlbmd0aDsgKytqKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBhbmltYXRpb25LZXkgPSBhbmltYXRpb25LZXlzW2pdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBtb3JwaFRhcmdldE1hbmFnZXIubnVtVGFyZ2V0czsgKytrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGsgPT0gaSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21iaW5lZEFuaW1hdGlvbktleXMucHVzaChhbmltYXRpb25LZXkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbWJpbmVkQW5pbWF0aW9uS2V5cy5wdXNoKHsgZnJhbWU6IGFuaW1hdGlvbktleS5mcmFtZSwgdmFsdWU6IDAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbWJpbmVkQW5pbWF0aW9uLnNldEtleXMoY29tYmluZWRBbmltYXRpb25LZXlzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYW5pbWF0aW9uSW5mbyA9IF9HTFRGQW5pbWF0aW9uLl9EZWR1Y2VBbmltYXRpb25JbmZvKGNvbWJpbmVkQW5pbWF0aW9uKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFuaW1hdGlvbkluZm8pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsVEZBbmltYXRpb24gPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogY29tYmluZWRBbmltYXRpb24ubmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzYW1wbGVyczogW10sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhbm5lbHM6IFtdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9HTFRGQW5pbWF0aW9uLl9BZGRBbmltYXRpb24oXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uLmhhc1J1bm5pbmdSdW50aW1lQW5pbWF0aW9ucyA/IHJ1bnRpbWVHTFRGQW5pbWF0aW9uIDogZ2xURkFuaW1hdGlvbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWJ5bG9uTm9kZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21iaW5lZEFuaW1hdGlvbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRpb25JbmZvLmRhdGFBY2Nlc3NvclR5cGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uSW5mby5hbmltYXRpb25DaGFubmVsVGFyZ2V0UGF0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlTWFwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJpbmFyeVdyaXRlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWZmZXJWaWV3cyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY2Nlc3NvcnMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uSW5mby51c2VRdWF0ZXJuaW9uLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvblNhbXBsZVJhdGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9ycGhUYXJnZXRNYW5hZ2VyLm51bVRhcmdldHNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZ2xURkFuaW1hdGlvbi5zYW1wbGVycy5sZW5ndGggJiYgZ2xURkFuaW1hdGlvbi5jaGFubmVscy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZGxlR0xURkFuaW1hdGlvbnMucHVzaChnbFRGQW5pbWF0aW9uKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBpbnRlcm5hbFxyXG4gICAgICogQ3JlYXRlIG5vZGUgYW5kIG1vcnBoIGFuaW1hdGlvbnMgZnJvbSB0aGUgYW5pbWF0aW9uIGdyb3Vwc1xyXG4gICAgICogQHBhcmFtIGJhYnlsb25TY2VuZVxyXG4gICAgICogQHBhcmFtIGdsVEZBbmltYXRpb25zXHJcbiAgICAgKiBAcGFyYW0gbm9kZU1hcFxyXG4gICAgICogQHBhcmFtIG5vZGVzXHJcbiAgICAgKiBAcGFyYW0gYmluYXJ5V3JpdGVyXHJcbiAgICAgKiBAcGFyYW0gYnVmZmVyVmlld3NcclxuICAgICAqIEBwYXJhbSBhY2Nlc3NvcnNcclxuICAgICAqIEBwYXJhbSBhbmltYXRpb25TYW1wbGVSYXRlXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgX0NyZWF0ZU5vZGVBbmRNb3JwaEFuaW1hdGlvbkZyb21BbmltYXRpb25Hcm91cHMoXHJcbiAgICAgICAgYmFieWxvblNjZW5lOiBTY2VuZSxcclxuICAgICAgICBnbFRGQW5pbWF0aW9uczogSUFuaW1hdGlvbltdLFxyXG4gICAgICAgIG5vZGVNYXA6IHsgW2tleTogbnVtYmVyXTogbnVtYmVyIH0sXHJcbiAgICAgICAgYmluYXJ5V3JpdGVyOiBfQmluYXJ5V3JpdGVyLFxyXG4gICAgICAgIGJ1ZmZlclZpZXdzOiBJQnVmZmVyVmlld1tdLFxyXG4gICAgICAgIGFjY2Vzc29yczogSUFjY2Vzc29yW10sXHJcbiAgICAgICAgYW5pbWF0aW9uU2FtcGxlUmF0ZTogbnVtYmVyLFxyXG4gICAgICAgIHNob3VsZEV4cG9ydEFuaW1hdGlvbj86IChhbmltYXRpb246IEFuaW1hdGlvbikgPT4gYm9vbGVhblxyXG4gICAgKSB7XHJcbiAgICAgICAgbGV0IGdsVEZBbmltYXRpb246IElBbmltYXRpb247XHJcbiAgICAgICAgaWYgKGJhYnlsb25TY2VuZS5hbmltYXRpb25Hcm91cHMpIHtcclxuICAgICAgICAgICAgY29uc3QgYW5pbWF0aW9uR3JvdXBzID0gYmFieWxvblNjZW5lLmFuaW1hdGlvbkdyb3VwcztcclxuICAgICAgICAgICAgZm9yIChjb25zdCBhbmltYXRpb25Hcm91cCBvZiBhbmltYXRpb25Hcm91cHMpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG1vcnBoQW5pbWF0aW9uczogTWFwPE1lc2gsIE1hcDxNb3JwaFRhcmdldCwgQW5pbWF0aW9uPj4gPSBuZXcgTWFwKCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzYW1wbGVBbmltYXRpb25zOiBNYXA8TWVzaCwgQW5pbWF0aW9uPiA9IG5ldyBNYXAoKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG1vcnBoQW5pbWF0aW9uTWVzaGVzOiBTZXQ8TWVzaD4gPSBuZXcgU2V0KCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhbmltYXRpb25Hcm91cEZyYW1lRGlmZiA9IGFuaW1hdGlvbkdyb3VwLnRvIC0gYW5pbWF0aW9uR3JvdXAuZnJvbTtcclxuICAgICAgICAgICAgICAgIGdsVEZBbmltYXRpb24gPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogYW5pbWF0aW9uR3JvdXAubmFtZSxcclxuICAgICAgICAgICAgICAgICAgICBjaGFubmVsczogW10sXHJcbiAgICAgICAgICAgICAgICAgICAgc2FtcGxlcnM6IFtdLFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYW5pbWF0aW9uR3JvdXAudGFyZ2V0ZWRBbmltYXRpb25zLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0QW5pbWF0aW9uID0gYW5pbWF0aW9uR3JvdXAudGFyZ2V0ZWRBbmltYXRpb25zW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IHRhcmdldEFuaW1hdGlvbi50YXJnZXQ7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYW5pbWF0aW9uID0gdGFyZ2V0QW5pbWF0aW9uLmFuaW1hdGlvbjtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2hvdWxkRXhwb3J0QW5pbWF0aW9uICYmICFzaG91bGRFeHBvcnRBbmltYXRpb24oYW5pbWF0aW9uKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX0lzVHJhbnNmb3JtYWJsZSh0YXJnZXQpIHx8ICh0YXJnZXQubGVuZ3RoID09PSAxICYmIHRoaXMuX0lzVHJhbnNmb3JtYWJsZSh0YXJnZXRbMF0pKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBhbmltYXRpb25JbmZvID0gX0dMVEZBbmltYXRpb24uX0RlZHVjZUFuaW1hdGlvbkluZm8odGFyZ2V0QW5pbWF0aW9uLmFuaW1hdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbmltYXRpb25JbmZvKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBiYWJ5bG9uVHJhbnNmb3JtTm9kZSA9IHRoaXMuX0lzVHJhbnNmb3JtYWJsZSh0YXJnZXQpID8gdGFyZ2V0IDogdGhpcy5fSXNUcmFuc2Zvcm1hYmxlKHRhcmdldFswXSkgPyB0YXJnZXRbMF0gOiBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJhYnlsb25UcmFuc2Zvcm1Ob2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX0dMVEZBbmltYXRpb24uX0FkZEFuaW1hdGlvbihcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYCR7YW5pbWF0aW9uLm5hbWV9YCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2xURkFuaW1hdGlvbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFieWxvblRyYW5zZm9ybU5vZGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uSW5mby5kYXRhQWNjZXNzb3JUeXBlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRpb25JbmZvLmFuaW1hdGlvbkNoYW5uZWxUYXJnZXRQYXRoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlTWFwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiaW5hcnlXcml0ZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlclZpZXdzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY2Nlc3NvcnMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvbkluZm8udXNlUXVhdGVybmlvbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uU2FtcGxlUmF0ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRhcmdldCBpbnN0YW5jZW9mIE1vcnBoVGFyZ2V0IHx8ICh0YXJnZXQubGVuZ3RoID09PSAxICYmIHRhcmdldFswXSBpbnN0YW5jZW9mIE1vcnBoVGFyZ2V0KSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBhbmltYXRpb25JbmZvID0gX0dMVEZBbmltYXRpb24uX0RlZHVjZUFuaW1hdGlvbkluZm8odGFyZ2V0QW5pbWF0aW9uLmFuaW1hdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbmltYXRpb25JbmZvKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBiYWJ5bG9uTW9ycGhUYXJnZXQgPSB0YXJnZXQgaW5zdGFuY2VvZiBNb3JwaFRhcmdldCA/ICh0YXJnZXQgYXMgTW9ycGhUYXJnZXQpIDogKHRhcmdldFswXSBhcyBNb3JwaFRhcmdldCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYmFieWxvbk1vcnBoVGFyZ2V0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYmFieWxvbk1vcnBoVGFyZ2V0TWFuYWdlciA9IGJhYnlsb25TY2VuZS5tb3JwaFRhcmdldE1hbmFnZXJzLmZpbmQoKG1vcnBoVGFyZ2V0TWFuYWdlcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IG1vcnBoVGFyZ2V0TWFuYWdlci5udW1UYXJnZXRzOyArK2opIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtb3JwaFRhcmdldE1hbmFnZXIuZ2V0VGFyZ2V0KGopID09PSBiYWJ5bG9uTW9ycGhUYXJnZXQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJhYnlsb25Nb3JwaFRhcmdldE1hbmFnZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYmFieWxvbk1lc2ggPSBiYWJ5bG9uU2NlbmUubWVzaGVzLmZpbmQoKG1lc2gpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAobWVzaCBhcyBNZXNoKS5tb3JwaFRhcmdldE1hbmFnZXIgPT09IGJhYnlsb25Nb3JwaFRhcmdldE1hbmFnZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pIGFzIE1lc2g7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChiYWJ5bG9uTWVzaCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFtb3JwaEFuaW1hdGlvbnMuaGFzKGJhYnlsb25NZXNoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vcnBoQW5pbWF0aW9ucy5zZXQoYmFieWxvbk1lc2gsIG5ldyBNYXAoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb3JwaEFuaW1hdGlvbnMuZ2V0KGJhYnlsb25NZXNoKT8uc2V0KGJhYnlsb25Nb3JwaFRhcmdldCwgYW5pbWF0aW9uKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vcnBoQW5pbWF0aW9uTWVzaGVzLmFkZChiYWJ5bG9uTWVzaCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzYW1wbGVBbmltYXRpb25zLnNldChiYWJ5bG9uTWVzaCwgYW5pbWF0aW9uKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMgaXMgdGhlIHBsYWNlIGZvciB0aGUgS0hSX2FuaW1hdGlvbl9wb2ludGVyLlxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIG1vcnBoQW5pbWF0aW9uTWVzaGVzLmZvckVhY2goKG1lc2gpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBtb3JwaFRhcmdldE1hbmFnZXIgPSBtZXNoLm1vcnBoVGFyZ2V0TWFuYWdlciE7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNvbWJpbmVkQW5pbWF0aW9uR3JvdXA6IE51bGxhYmxlPEFuaW1hdGlvbj4gPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFuaW1hdGlvbktleXM6IElBbmltYXRpb25LZXlbXSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNhbXBsZUFuaW1hdGlvbiA9IHNhbXBsZUFuaW1hdGlvbnMuZ2V0KG1lc2gpITtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzYW1wbGVBbmltYXRpb25LZXlzID0gc2FtcGxlQW5pbWF0aW9uLmdldEtleXMoKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBudW1BbmltYXRpb25LZXlzID0gc2FtcGxlQW5pbWF0aW9uS2V5cy5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAgICAgICAgRHVlIHRvIGhvdyBnbFRGIGV4cGVjdHMgbW9ycGggdGFyZ2V0IGFuaW1hdGlvbiBkYXRhIHRvIGJlIGZvcm1hdHRlZCwgd2UgbmVlZCB0byByZWFycmFuZ2UgdGhlIGluZGl2aWR1YWwgbW9ycGggdGFyZ2V0IGFuaW1hdGlvbiB0cmFja3MsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2ggdGhhdCB3ZSBoYXZlIGEgc2luZ2xlIGFuaW1hdGlvbiwgd2hlcmUgYSBnaXZlbiBrZXlmcmFtZSBpbnB1dCB2YWx1ZSBoYXMgc3VjY2Vzc2l2ZSBvdXRwdXQgdmFsdWVzIGZvciBlYWNoIG1vcnBoIHRhcmdldCBiZWxvbmdpbmcgdG8gdGhlIG1hbmFnZXIuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL0tocm9ub3NHcm91cC9nbFRGL3RyZWUvbWFzdGVyL3NwZWNpZmljYXRpb24vMi4wI2FuaW1hdGlvbnNcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFdlIGRvIHRoaXMgdmlhIGNvbnN0cnVjdGluZyBhIG5ldyBBbmltYXRpb24gdHJhY2ssIGFuZCBpbnRlcmxlYXZpbmcgdGhlIGZyYW1lcyBvZiBlYWNoIG1vcnBoIHRhcmdldCBhbmltYXRpb24gdHJhY2sgaW4gdGhlIGN1cnJlbnQgQW5pbWF0aW9uIEdyb3VwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFdlIHJldXNlIHRoZSBCYWJ5bG9uIEFuaW1hdGlvbiBkYXRhIHN0cnVjdHVyZSBmb3IgZWFzZSBvZiBoYW5kbGluZyBleHBvcnQgb2YgY3ViaWMgc3BsaW5lIGFuaW1hdGlvbiBrZXlzLCBhbmQgdG8gcmV1c2UgdGhlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4aXN0aW5nIF9HTFRGQW5pbWF0aW9uLkFkZEFuaW1hdGlvbiBjb2RlcGF0aCB3aXRoIG1pbmltYWwgbW9kaWZpY2F0aW9uLCBob3dldmVyIHRoZSBjb25zdHJ1Y3RlZCBCYWJ5bG9uIEFuaW1hdGlvbiBpcyBOT1QgaW50ZW5kZWQgZm9yIHVzZSBpbi1lbmdpbmUuXHJcbiAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bUFuaW1hdGlvbktleXM7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IG1vcnBoVGFyZ2V0TWFuYWdlci5udW1UYXJnZXRzOyArK2opIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG1vcnBoVGFyZ2V0ID0gbW9ycGhUYXJnZXRNYW5hZ2VyLmdldFRhcmdldChqKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGFuaW1hdGlvbnNCeU1vcnBoVGFyZ2V0ID0gbW9ycGhBbmltYXRpb25zLmdldChtZXNoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbmltYXRpb25zQnlNb3JwaFRhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG1vcnBoVGFyZ2V0QW5pbWF0aW9uID0gYW5pbWF0aW9uc0J5TW9ycGhUYXJnZXQuZ2V0KG1vcnBoVGFyZ2V0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobW9ycGhUYXJnZXRBbmltYXRpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFjb21iaW5lZEFuaW1hdGlvbkdyb3VwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21iaW5lZEFuaW1hdGlvbkdyb3VwID0gbmV3IEFuaW1hdGlvbihcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgJHthbmltYXRpb25Hcm91cC5uYW1lfV8ke21lc2gubmFtZX1fTW9ycGhXZWlnaHRBbmltYXRpb25gLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiaW5mbHVlbmNlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9ycGhUYXJnZXRBbmltYXRpb24uZnJhbWVQZXJTZWNvbmQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQW5pbWF0aW9uLkFOSU1BVElPTlRZUEVfRkxPQVQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9ycGhUYXJnZXRBbmltYXRpb24ubG9vcE1vZGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9ycGhUYXJnZXRBbmltYXRpb24uZW5hYmxlQmxlbmRpbmdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uS2V5cy5wdXNoKG1vcnBoVGFyZ2V0QW5pbWF0aW9uLmdldEtleXMoKVtpXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uS2V5cy5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyYW1lOiBhbmltYXRpb25Hcm91cC5mcm9tICsgKGFuaW1hdGlvbkdyb3VwRnJhbWVEaWZmIC8gbnVtQW5pbWF0aW9uS2V5cykgKiBpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IG1vcnBoVGFyZ2V0LmluZmx1ZW5jZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluVGFuZ2VudDogc2FtcGxlQW5pbWF0aW9uS2V5c1swXS5pblRhbmdlbnQgPyAwIDogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0VGFuZ2VudDogc2FtcGxlQW5pbWF0aW9uS2V5c1swXS5vdXRUYW5nZW50ID8gMCA6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbWJpbmVkQW5pbWF0aW9uR3JvdXAhLnNldEtleXMoYW5pbWF0aW9uS2V5cyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYW5pbWF0aW9uSW5mbyA9IF9HTFRGQW5pbWF0aW9uLl9EZWR1Y2VBbmltYXRpb25JbmZvKGNvbWJpbmVkQW5pbWF0aW9uR3JvdXAhKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYW5pbWF0aW9uSW5mbykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfR0xURkFuaW1hdGlvbi5fQWRkQW5pbWF0aW9uKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYCR7YW5pbWF0aW9uR3JvdXAubmFtZX1fJHttZXNoLm5hbWV9X01vcnBoV2VpZ2h0QW5pbWF0aW9uYCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsVEZBbmltYXRpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tYmluZWRBbmltYXRpb25Hcm91cCEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRpb25JbmZvLmRhdGFBY2Nlc3NvclR5cGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRpb25JbmZvLmFuaW1hdGlvbkNoYW5uZWxUYXJnZXRQYXRoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZU1hcCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJpbmFyeVdyaXRlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlclZpZXdzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWNjZXNzb3JzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uSW5mby51c2VRdWF0ZXJuaW9uLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uU2FtcGxlUmF0ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vcnBoVGFyZ2V0TWFuYWdlcj8ubnVtVGFyZ2V0c1xyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKGdsVEZBbmltYXRpb24uY2hhbm5lbHMubGVuZ3RoICYmIGdsVEZBbmltYXRpb24uc2FtcGxlcnMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2xURkFuaW1hdGlvbnMucHVzaChnbFRGQW5pbWF0aW9uKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBfQWRkQW5pbWF0aW9uKFxyXG4gICAgICAgIG5hbWU6IHN0cmluZyxcclxuICAgICAgICBnbFRGQW5pbWF0aW9uOiBJQW5pbWF0aW9uLFxyXG4gICAgICAgIGJhYnlsb25UcmFuc2Zvcm1Ob2RlOiBOb2RlLFxyXG4gICAgICAgIGFuaW1hdGlvbjogQW5pbWF0aW9uLFxyXG4gICAgICAgIGRhdGFBY2Nlc3NvclR5cGU6IEFjY2Vzc29yVHlwZSxcclxuICAgICAgICBhbmltYXRpb25DaGFubmVsVGFyZ2V0UGF0aDogQW5pbWF0aW9uQ2hhbm5lbFRhcmdldFBhdGgsXHJcbiAgICAgICAgbm9kZU1hcDogeyBba2V5OiBudW1iZXJdOiBudW1iZXIgfSxcclxuICAgICAgICBiaW5hcnlXcml0ZXI6IF9CaW5hcnlXcml0ZXIsXHJcbiAgICAgICAgYnVmZmVyVmlld3M6IElCdWZmZXJWaWV3W10sXHJcbiAgICAgICAgYWNjZXNzb3JzOiBJQWNjZXNzb3JbXSxcclxuICAgICAgICB1c2VRdWF0ZXJuaW9uOiBib29sZWFuLFxyXG4gICAgICAgIGFuaW1hdGlvblNhbXBsZVJhdGU6IG51bWJlcixcclxuICAgICAgICBtb3JwaEFuaW1hdGlvbkNoYW5uZWxzPzogbnVtYmVyXHJcbiAgICApIHtcclxuICAgICAgICBjb25zdCBhbmltYXRpb25EYXRhID0gX0dMVEZBbmltYXRpb24uX0NyZWF0ZU5vZGVBbmltYXRpb24oYmFieWxvblRyYW5zZm9ybU5vZGUsIGFuaW1hdGlvbiwgYW5pbWF0aW9uQ2hhbm5lbFRhcmdldFBhdGgsIHVzZVF1YXRlcm5pb24sIGFuaW1hdGlvblNhbXBsZVJhdGUpO1xyXG4gICAgICAgIGxldCBidWZmZXJWaWV3OiBJQnVmZmVyVmlldztcclxuICAgICAgICBsZXQgYWNjZXNzb3I6IElBY2Nlc3NvcjtcclxuICAgICAgICBsZXQga2V5ZnJhbWVBY2Nlc3NvckluZGV4OiBudW1iZXI7XHJcbiAgICAgICAgbGV0IGRhdGFBY2Nlc3NvckluZGV4OiBudW1iZXI7XHJcbiAgICAgICAgbGV0IG91dHB1dExlbmd0aDogbnVtYmVyO1xyXG4gICAgICAgIGxldCBhbmltYXRpb25TYW1wbGVyOiBJQW5pbWF0aW9uU2FtcGxlcjtcclxuICAgICAgICBsZXQgYW5pbWF0aW9uQ2hhbm5lbDogSUFuaW1hdGlvbkNoYW5uZWw7XHJcblxyXG4gICAgICAgIGlmIChhbmltYXRpb25EYXRhKSB7XHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIE5vdyB0aGF0IHdlIGhhdmUgdGhlIGdsVEYgY29udmVydGVkIG1vcnBoIHRhcmdldCBhbmltYXRpb24gZGF0YSxcclxuICAgICAgICAgICAgICogd2UgY2FuIHJlbW92ZSByZWR1bmRhbnQgaW5wdXQgZGF0YSBzbyB0aGF0IHdlIGhhdmUgbiBpbnB1dCBmcmFtZXMsXHJcbiAgICAgICAgICAgICAqIGFuZCBtb3JwaEFuaW1hdGlvbkNoYW5uZWxzICogbiBvdXRwdXQgZnJhbWVzXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpZiAobW9ycGhBbmltYXRpb25DaGFubmVscykge1xyXG4gICAgICAgICAgICAgICAgbGV0IGluZGV4ID0gMDtcclxuICAgICAgICAgICAgICAgIGxldCBjdXJyZW50SW5wdXQ6IG51bWJlciA9IDA7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdJbnB1dHM6IG51bWJlcltdID0gW107XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoYW5pbWF0aW9uRGF0YS5pbnB1dHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRJbnB1dCA9IGFuaW1hdGlvbkRhdGEuaW5wdXRzLnNoaWZ0KCkhO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCAlIG1vcnBoQW5pbWF0aW9uQ2hhbm5lbHMgPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdJbnB1dHMucHVzaChjdXJyZW50SW5wdXQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpbmRleCsrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uRGF0YS5pbnB1dHMgPSBuZXdJbnB1dHM7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG5vZGVJbmRleCA9IG5vZGVNYXBbYmFieWxvblRyYW5zZm9ybU5vZGUudW5pcXVlSWRdO1xyXG5cclxuICAgICAgICAgICAgLy8gQ3JlYXRlcyBidWZmZXIgdmlldyBhbmQgYWNjZXNzb3IgZm9yIGtleSBmcmFtZXMuXHJcbiAgICAgICAgICAgIGxldCBieXRlTGVuZ3RoID0gYW5pbWF0aW9uRGF0YS5pbnB1dHMubGVuZ3RoICogNDtcclxuICAgICAgICAgICAgYnVmZmVyVmlldyA9IF9HTFRGVXRpbGl0aWVzLl9DcmVhdGVCdWZmZXJWaWV3KDAsIGJpbmFyeVdyaXRlci5nZXRCeXRlT2Zmc2V0KCksIGJ5dGVMZW5ndGgsIHVuZGVmaW5lZCwgYCR7bmFtZX0gIGtleWZyYW1lIGRhdGEgdmlld2ApO1xyXG4gICAgICAgICAgICBidWZmZXJWaWV3cy5wdXNoKGJ1ZmZlclZpZXcpO1xyXG4gICAgICAgICAgICBhbmltYXRpb25EYXRhLmlucHV0cy5mb3JFYWNoKGZ1bmN0aW9uIChpbnB1dCkge1xyXG4gICAgICAgICAgICAgICAgYmluYXJ5V3JpdGVyLnNldEZsb2F0MzIoaW5wdXQpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGFjY2Vzc29yID0gX0dMVEZVdGlsaXRpZXMuX0NyZWF0ZUFjY2Vzc29yKFxyXG4gICAgICAgICAgICAgICAgYnVmZmVyVmlld3MubGVuZ3RoIC0gMSxcclxuICAgICAgICAgICAgICAgIGAke25hbWV9ICBrZXlmcmFtZXNgLFxyXG4gICAgICAgICAgICAgICAgQWNjZXNzb3JUeXBlLlNDQUxBUixcclxuICAgICAgICAgICAgICAgIEFjY2Vzc29yQ29tcG9uZW50VHlwZS5GTE9BVCxcclxuICAgICAgICAgICAgICAgIGFuaW1hdGlvbkRhdGEuaW5wdXRzLmxlbmd0aCxcclxuICAgICAgICAgICAgICAgIG51bGwsXHJcbiAgICAgICAgICAgICAgICBbYW5pbWF0aW9uRGF0YS5pbnB1dHNNaW5dLFxyXG4gICAgICAgICAgICAgICAgW2FuaW1hdGlvbkRhdGEuaW5wdXRzTWF4XVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBhY2Nlc3NvcnMucHVzaChhY2Nlc3Nvcik7XHJcbiAgICAgICAgICAgIGtleWZyYW1lQWNjZXNzb3JJbmRleCA9IGFjY2Vzc29ycy5sZW5ndGggLSAxO1xyXG5cclxuICAgICAgICAgICAgLy8gY3JlYXRlIGJ1ZmZlcnZpZXcgYW5kIGFjY2Vzc29yIGZvciBrZXllZCB2YWx1ZXMuXHJcbiAgICAgICAgICAgIG91dHB1dExlbmd0aCA9IGFuaW1hdGlvbkRhdGEub3V0cHV0cy5sZW5ndGg7XHJcbiAgICAgICAgICAgIGJ5dGVMZW5ndGggPSBfR0xURlV0aWxpdGllcy5fR2V0RGF0YUFjY2Vzc29yRWxlbWVudENvdW50KGRhdGFBY2Nlc3NvclR5cGUpICogNCAqIGFuaW1hdGlvbkRhdGEub3V0cHV0cy5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgICAvLyBjaGVjayBmb3IgaW4gYW5kIG91dCB0YW5nZW50c1xyXG4gICAgICAgICAgICBidWZmZXJWaWV3ID0gX0dMVEZVdGlsaXRpZXMuX0NyZWF0ZUJ1ZmZlclZpZXcoMCwgYmluYXJ5V3JpdGVyLmdldEJ5dGVPZmZzZXQoKSwgYnl0ZUxlbmd0aCwgdW5kZWZpbmVkLCBgJHtuYW1lfSAgZGF0YSB2aWV3YCk7XHJcbiAgICAgICAgICAgIGJ1ZmZlclZpZXdzLnB1c2goYnVmZmVyVmlldyk7XHJcblxyXG4gICAgICAgICAgICBhbmltYXRpb25EYXRhLm91dHB1dHMuZm9yRWFjaChmdW5jdGlvbiAob3V0cHV0KSB7XHJcbiAgICAgICAgICAgICAgICBvdXRwdXQuZm9yRWFjaChmdW5jdGlvbiAoZW50cnkpIHtcclxuICAgICAgICAgICAgICAgICAgICBiaW5hcnlXcml0ZXIuc2V0RmxvYXQzMihlbnRyeSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBhY2Nlc3NvciA9IF9HTFRGVXRpbGl0aWVzLl9DcmVhdGVBY2Nlc3NvcihidWZmZXJWaWV3cy5sZW5ndGggLSAxLCBgJHtuYW1lfSAgZGF0YWAsIGRhdGFBY2Nlc3NvclR5cGUsIEFjY2Vzc29yQ29tcG9uZW50VHlwZS5GTE9BVCwgb3V0cHV0TGVuZ3RoLCBudWxsLCBudWxsLCBudWxsKTtcclxuICAgICAgICAgICAgYWNjZXNzb3JzLnB1c2goYWNjZXNzb3IpO1xyXG4gICAgICAgICAgICBkYXRhQWNjZXNzb3JJbmRleCA9IGFjY2Vzc29ycy5sZW5ndGggLSAxO1xyXG5cclxuICAgICAgICAgICAgLy8gY3JlYXRlIHNhbXBsZXJcclxuICAgICAgICAgICAgYW5pbWF0aW9uU2FtcGxlciA9IHtcclxuICAgICAgICAgICAgICAgIGludGVycG9sYXRpb246IGFuaW1hdGlvbkRhdGEuc2FtcGxlckludGVycG9sYXRpb24sXHJcbiAgICAgICAgICAgICAgICBpbnB1dDoga2V5ZnJhbWVBY2Nlc3NvckluZGV4LFxyXG4gICAgICAgICAgICAgICAgb3V0cHV0OiBkYXRhQWNjZXNzb3JJbmRleCxcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgZ2xURkFuaW1hdGlvbi5zYW1wbGVycy5wdXNoKGFuaW1hdGlvblNhbXBsZXIpO1xyXG5cclxuICAgICAgICAgICAgLy8gY3JlYXRlIGNoYW5uZWxcclxuICAgICAgICAgICAgYW5pbWF0aW9uQ2hhbm5lbCA9IHtcclxuICAgICAgICAgICAgICAgIHNhbXBsZXI6IGdsVEZBbmltYXRpb24uc2FtcGxlcnMubGVuZ3RoIC0gMSxcclxuICAgICAgICAgICAgICAgIHRhcmdldDoge1xyXG4gICAgICAgICAgICAgICAgICAgIG5vZGU6IG5vZGVJbmRleCxcclxuICAgICAgICAgICAgICAgICAgICBwYXRoOiBhbmltYXRpb25DaGFubmVsVGFyZ2V0UGF0aCxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGdsVEZBbmltYXRpb24uY2hhbm5lbHMucHVzaChhbmltYXRpb25DaGFubmVsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgYSBiYWtlZCBhbmltYXRpb25cclxuICAgICAqIEBwYXJhbSBiYWJ5bG9uVHJhbnNmb3JtTm9kZSBCYWJ5bG9uSlMgbWVzaFxyXG4gICAgICogQHBhcmFtIGFuaW1hdGlvbiBCYWJ5bG9uSlMgYW5pbWF0aW9uIGNvcnJlc3BvbmRpbmcgdG8gdGhlIEJhYnlsb25KUyBtZXNoXHJcbiAgICAgKiBAcGFyYW0gYW5pbWF0aW9uQ2hhbm5lbFRhcmdldFBhdGggYW5pbWF0aW9uIHRhcmdldCBjaGFubmVsXHJcbiAgICAgKiBAcGFyYW0gbWluRnJhbWUgbWluaW11bSBhbmltYXRpb24gZnJhbWVcclxuICAgICAqIEBwYXJhbSBtYXhGcmFtZSBtYXhpbXVtIGFuaW1hdGlvbiBmcmFtZVxyXG4gICAgICogQHBhcmFtIGZwcyBmcmFtZXMgcGVyIHNlY29uZCBvZiB0aGUgYW5pbWF0aW9uXHJcbiAgICAgKiBAcGFyYW0gc2FtcGxlUmF0ZVxyXG4gICAgICogQHBhcmFtIGlucHV0cyBpbnB1dCBrZXkgZnJhbWVzIG9mIHRoZSBhbmltYXRpb25cclxuICAgICAqIEBwYXJhbSBvdXRwdXRzIG91dHB1dCBrZXkgZnJhbWUgZGF0YSBvZiB0aGUgYW5pbWF0aW9uXHJcbiAgICAgKiBAcGFyYW0gbWluTWF4RnJhbWVzXHJcbiAgICAgKiBAcGFyYW0gbWluTWF4RnJhbWVzLm1pblxyXG4gICAgICogQHBhcmFtIG1pbk1heEZyYW1lcy5tYXhcclxuICAgICAqIEBwYXJhbSB1c2VRdWF0ZXJuaW9uIHNwZWNpZmllcyBpZiBxdWF0ZXJuaW9ucyBzaG91bGQgYmUgdXNlZFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyBfQ3JlYXRlQmFrZWRBbmltYXRpb24oXHJcbiAgICAgICAgYmFieWxvblRyYW5zZm9ybU5vZGU6IE5vZGUsXHJcbiAgICAgICAgYW5pbWF0aW9uOiBBbmltYXRpb24sXHJcbiAgICAgICAgYW5pbWF0aW9uQ2hhbm5lbFRhcmdldFBhdGg6IEFuaW1hdGlvbkNoYW5uZWxUYXJnZXRQYXRoLFxyXG4gICAgICAgIG1pbkZyYW1lOiBudW1iZXIsXHJcbiAgICAgICAgbWF4RnJhbWU6IG51bWJlcixcclxuICAgICAgICBmcHM6IG51bWJlcixcclxuICAgICAgICBzYW1wbGVSYXRlOiBudW1iZXIsXHJcbiAgICAgICAgaW5wdXRzOiBudW1iZXJbXSxcclxuICAgICAgICBvdXRwdXRzOiBudW1iZXJbXVtdLFxyXG4gICAgICAgIG1pbk1heEZyYW1lczogeyBtaW46IG51bWJlcjsgbWF4OiBudW1iZXIgfSxcclxuICAgICAgICB1c2VRdWF0ZXJuaW9uOiBib29sZWFuXHJcbiAgICApIHtcclxuICAgICAgICBsZXQgdmFsdWU6IG51bWJlciB8IFZlY3RvcjMgfCBRdWF0ZXJuaW9uO1xyXG4gICAgICAgIGNvbnN0IHF1YXRlcm5pb25DYWNoZTogUXVhdGVybmlvbiA9IFF1YXRlcm5pb24uSWRlbnRpdHkoKTtcclxuICAgICAgICBsZXQgcHJldmlvdXNUaW1lOiBOdWxsYWJsZTxudW1iZXI+ID0gbnVsbDtcclxuICAgICAgICBsZXQgdGltZTogbnVtYmVyO1xyXG4gICAgICAgIGxldCBtYXhVc2VkRnJhbWU6IE51bGxhYmxlPG51bWJlcj4gPSBudWxsO1xyXG4gICAgICAgIGxldCBjdXJyS2V5RnJhbWU6IE51bGxhYmxlPElBbmltYXRpb25LZXk+ID0gbnVsbDtcclxuICAgICAgICBsZXQgbmV4dEtleUZyYW1lOiBOdWxsYWJsZTxJQW5pbWF0aW9uS2V5PiA9IG51bGw7XHJcbiAgICAgICAgbGV0IHByZXZLZXlGcmFtZTogTnVsbGFibGU8SUFuaW1hdGlvbktleT4gPSBudWxsO1xyXG4gICAgICAgIGxldCBlbmRGcmFtZTogTnVsbGFibGU8bnVtYmVyPiA9IG51bGw7XHJcbiAgICAgICAgbWluTWF4RnJhbWVzLm1pbiA9IFRvb2xzLkZsb2F0Um91bmQobWluRnJhbWUgLyBmcHMpO1xyXG5cclxuICAgICAgICBjb25zdCBrZXlGcmFtZXMgPSBhbmltYXRpb24uZ2V0S2V5cygpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuZ3RoID0ga2V5RnJhbWVzLmxlbmd0aDsgaSA8IGxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgIGVuZEZyYW1lID0gbnVsbDtcclxuICAgICAgICAgICAgY3VycktleUZyYW1lID0ga2V5RnJhbWVzW2ldO1xyXG5cclxuICAgICAgICAgICAgaWYgKGkgKyAxIDwgbGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBuZXh0S2V5RnJhbWUgPSBrZXlGcmFtZXNbaSArIDFdO1xyXG4gICAgICAgICAgICAgICAgaWYgKChjdXJyS2V5RnJhbWUudmFsdWUuZXF1YWxzICYmIGN1cnJLZXlGcmFtZS52YWx1ZS5lcXVhbHMobmV4dEtleUZyYW1lLnZhbHVlKSkgfHwgY3VycktleUZyYW1lLnZhbHVlID09PSBuZXh0S2V5RnJhbWUudmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaSA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzZXQgdGhlIGZpcnN0IGZyYW1lIHRvIGl0c2VsZlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmRGcmFtZSA9IGN1cnJLZXlGcmFtZS5mcmFtZTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGVuZEZyYW1lID0gbmV4dEtleUZyYW1lLmZyYW1lO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gYXQgdGhlIGxhc3Qga2V5IGZyYW1lXHJcbiAgICAgICAgICAgICAgICBwcmV2S2V5RnJhbWUgPSBrZXlGcmFtZXNbaSAtIDFdO1xyXG4gICAgICAgICAgICAgICAgaWYgKChjdXJyS2V5RnJhbWUudmFsdWUuZXF1YWxzICYmIGN1cnJLZXlGcmFtZS52YWx1ZS5lcXVhbHMocHJldktleUZyYW1lLnZhbHVlKSkgfHwgY3VycktleUZyYW1lLnZhbHVlID09PSBwcmV2S2V5RnJhbWUudmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZW5kRnJhbWUgPSBtYXhGcmFtZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZW5kRnJhbWUpIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGYgPSBjdXJyS2V5RnJhbWUuZnJhbWU7IGYgPD0gZW5kRnJhbWU7IGYgKz0gc2FtcGxlUmF0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRpbWUgPSBUb29scy5GbG9hdFJvdW5kKGYgLyBmcHMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aW1lID09PSBwcmV2aW91c1RpbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHByZXZpb3VzVGltZSA9IHRpbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgbWF4VXNlZEZyYW1lID0gdGltZTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzdGF0ZSA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAga2V5OiAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXBlYXRDb3VudDogMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbG9vcE1vZGU6IGFuaW1hdGlvbi5sb29wTW9kZSxcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gYW5pbWF0aW9uLl9pbnRlcnBvbGF0ZShmLCBzdGF0ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIF9HTFRGQW5pbWF0aW9uLl9TZXRJbnRlcnBvbGF0ZWRWYWx1ZShiYWJ5bG9uVHJhbnNmb3JtTm9kZSwgdmFsdWUsIHRpbWUsIGFuaW1hdGlvbiwgYW5pbWF0aW9uQ2hhbm5lbFRhcmdldFBhdGgsIHF1YXRlcm5pb25DYWNoZSwgaW5wdXRzLCBvdXRwdXRzLCB1c2VRdWF0ZXJuaW9uKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobWF4VXNlZEZyYW1lKSB7XHJcbiAgICAgICAgICAgIG1pbk1heEZyYW1lcy5tYXggPSBtYXhVc2VkRnJhbWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIF9Db252ZXJ0RmFjdG9yVG9WZWN0b3IzT3JRdWF0ZXJuaW9uKFxyXG4gICAgICAgIGZhY3RvcjogbnVtYmVyLFxyXG4gICAgICAgIGJhYnlsb25UcmFuc2Zvcm1Ob2RlOiBOb2RlLFxyXG4gICAgICAgIGFuaW1hdGlvbjogQW5pbWF0aW9uLFxyXG4gICAgICAgIGFuaW1hdGlvbkNoYW5uZWxUYXJnZXRQYXRoOiBBbmltYXRpb25DaGFubmVsVGFyZ2V0UGF0aCxcclxuICAgICAgICB1c2VRdWF0ZXJuaW9uOiBib29sZWFuXHJcbiAgICApOiBWZWN0b3IzIHwgUXVhdGVybmlvbiB7XHJcbiAgICAgICAgY29uc3QgYmFzZVBvc2l0aW9uUm90YXRpb25PclNjYWxlID0gX0dMVEZBbmltYXRpb24uX0dldEJhc2VQb3NpdGlvblJvdGF0aW9uT3JTY2FsZShiYWJ5bG9uVHJhbnNmb3JtTm9kZSwgYW5pbWF0aW9uQ2hhbm5lbFRhcmdldFBhdGgsIHVzZVF1YXRlcm5pb24pO1xyXG4gICAgICAgIC8vIGhhbmRsZXMgc2luZ2xlIGNvbXBvbmVudCB4LCB5LCB6IG9yIHcgY29tcG9uZW50IGFuaW1hdGlvbiBieSB1c2luZyBhIGJhc2UgcHJvcGVydHkgYW5kIGFuaW1hdGluZyBvdmVyIGEgY29tcG9uZW50LlxyXG4gICAgICAgIGNvbnN0IHByb3BlcnR5ID0gYW5pbWF0aW9uLnRhcmdldFByb3BlcnR5LnNwbGl0KFwiLlwiKTtcclxuICAgICAgICBjb25zdCBjb21wb25lbnROYW1lID0gcHJvcGVydHkgPyBwcm9wZXJ0eVsxXSA6IFwiXCI7IC8vIHgsIHksIHosIG9yIHcgY29tcG9uZW50XHJcbiAgICAgICAgY29uc3QgdmFsdWUgPSB1c2VRdWF0ZXJuaW9uID8gUXVhdGVybmlvbi5Gcm9tQXJyYXkoYmFzZVBvc2l0aW9uUm90YXRpb25PclNjYWxlKS5ub3JtYWxpemUoKSA6IFZlY3RvcjMuRnJvbUFycmF5KGJhc2VQb3NpdGlvblJvdGF0aW9uT3JTY2FsZSk7XHJcblxyXG4gICAgICAgIHN3aXRjaCAoY29tcG9uZW50TmFtZSkge1xyXG4gICAgICAgICAgICBjYXNlIFwieFwiOlxyXG4gICAgICAgICAgICBjYXNlIFwieVwiOlxyXG4gICAgICAgICAgICBjYXNlIFwielwiOiB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZVtjb21wb25lbnROYW1lXSA9IGZhY3RvcjtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhc2UgXCJ3XCI6IHtcclxuICAgICAgICAgICAgICAgICh2YWx1ZSBhcyBRdWF0ZXJuaW9uKS53ID0gZmFjdG9yO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZGVmYXVsdDoge1xyXG4gICAgICAgICAgICAgICAgVG9vbHMuRXJyb3IoYGdsVEZBbmltYXRpb246IFVuc3VwcG9ydGVkIGNvbXBvbmVudCBuYW1lIFwiJHtjb21wb25lbnROYW1lfVwiIWApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgX1NldEludGVycG9sYXRlZFZhbHVlKFxyXG4gICAgICAgIGJhYnlsb25UcmFuc2Zvcm1Ob2RlOiBOb2RlLFxyXG4gICAgICAgIHZhbHVlOiBudW1iZXIgfCBWZWN0b3IzIHwgUXVhdGVybmlvbixcclxuICAgICAgICB0aW1lOiBudW1iZXIsXHJcbiAgICAgICAgYW5pbWF0aW9uOiBBbmltYXRpb24sXHJcbiAgICAgICAgYW5pbWF0aW9uQ2hhbm5lbFRhcmdldFBhdGg6IEFuaW1hdGlvbkNoYW5uZWxUYXJnZXRQYXRoLFxyXG4gICAgICAgIHF1YXRlcm5pb25DYWNoZTogUXVhdGVybmlvbixcclxuICAgICAgICBpbnB1dHM6IG51bWJlcltdLFxyXG4gICAgICAgIG91dHB1dHM6IG51bWJlcltdW10sXHJcbiAgICAgICAgdXNlUXVhdGVybmlvbjogYm9vbGVhblxyXG4gICAgKSB7XHJcbiAgICAgICAgbGV0IGNhY2hlVmFsdWU6IFZlY3RvcjMgfCBRdWF0ZXJuaW9uIHwgbnVtYmVyO1xyXG4gICAgICAgIGlucHV0cy5wdXNoKHRpbWUpO1xyXG5cclxuICAgICAgICBpZiAoYW5pbWF0aW9uQ2hhbm5lbFRhcmdldFBhdGggPT09IEFuaW1hdGlvbkNoYW5uZWxUYXJnZXRQYXRoLldFSUdIVFMpIHtcclxuICAgICAgICAgICAgb3V0cHV0cy5wdXNoKFt2YWx1ZSBhcyBudW1iZXJdKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGFuaW1hdGlvbi5kYXRhVHlwZSA9PT0gQW5pbWF0aW9uLkFOSU1BVElPTlRZUEVfRkxPQVQpIHtcclxuICAgICAgICAgICAgdmFsdWUgPSB0aGlzLl9Db252ZXJ0RmFjdG9yVG9WZWN0b3IzT3JRdWF0ZXJuaW9uKHZhbHVlIGFzIG51bWJlciwgYmFieWxvblRyYW5zZm9ybU5vZGUsIGFuaW1hdGlvbiwgYW5pbWF0aW9uQ2hhbm5lbFRhcmdldFBhdGgsIHVzZVF1YXRlcm5pb24pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGFuaW1hdGlvbkNoYW5uZWxUYXJnZXRQYXRoID09PSBBbmltYXRpb25DaGFubmVsVGFyZ2V0UGF0aC5ST1RBVElPTikge1xyXG4gICAgICAgICAgICBpZiAodXNlUXVhdGVybmlvbikge1xyXG4gICAgICAgICAgICAgICAgcXVhdGVybmlvbkNhY2hlID0gdmFsdWUgYXMgUXVhdGVybmlvbjtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNhY2hlVmFsdWUgPSB2YWx1ZSBhcyBWZWN0b3IzO1xyXG4gICAgICAgICAgICAgICAgUXVhdGVybmlvbi5Sb3RhdGlvbllhd1BpdGNoUm9sbFRvUmVmKGNhY2hlVmFsdWUueSwgY2FjaGVWYWx1ZS54LCBjYWNoZVZhbHVlLnosIHF1YXRlcm5pb25DYWNoZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3V0cHV0cy5wdXNoKHF1YXRlcm5pb25DYWNoZS5hc0FycmF5KCkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIHNjYWxpbmcgYW5kIHBvc2l0aW9uIGFuaW1hdGlvblxyXG4gICAgICAgICAgICBjYWNoZVZhbHVlID0gdmFsdWUgYXMgVmVjdG9yMztcclxuICAgICAgICAgICAgb3V0cHV0cy5wdXNoKGNhY2hlVmFsdWUuYXNBcnJheSgpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIGxpbmVhciBhbmltYXRpb24gZnJvbSB0aGUgYW5pbWF0aW9uIGtleSBmcmFtZXNcclxuICAgICAqIEBwYXJhbSBiYWJ5bG9uVHJhbnNmb3JtTm9kZSBCYWJ5bG9uSlMgbWVzaFxyXG4gICAgICogQHBhcmFtIGFuaW1hdGlvbiBCYWJ5bG9uSlMgYW5pbWF0aW9uXHJcbiAgICAgKiBAcGFyYW0gYW5pbWF0aW9uQ2hhbm5lbFRhcmdldFBhdGggVGhlIHRhcmdldCBhbmltYXRpb24gY2hhbm5lbFxyXG4gICAgICogQHBhcmFtIGlucHV0cyBBcnJheSB0byBzdG9yZSB0aGUga2V5IGZyYW1lIHRpbWVzXHJcbiAgICAgKiBAcGFyYW0gb3V0cHV0cyBBcnJheSB0byBzdG9yZSB0aGUga2V5IGZyYW1lIGRhdGFcclxuICAgICAqIEBwYXJhbSB1c2VRdWF0ZXJuaW9uIFNwZWNpZmllcyBpZiBxdWF0ZXJuaW9ucyBhcmUgdXNlZCBpbiB0aGUgYW5pbWF0aW9uXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgc3RhdGljIF9DcmVhdGVMaW5lYXJPclN0ZXBBbmltYXRpb24oXHJcbiAgICAgICAgYmFieWxvblRyYW5zZm9ybU5vZGU6IE5vZGUsXHJcbiAgICAgICAgYW5pbWF0aW9uOiBBbmltYXRpb24sXHJcbiAgICAgICAgYW5pbWF0aW9uQ2hhbm5lbFRhcmdldFBhdGg6IEFuaW1hdGlvbkNoYW5uZWxUYXJnZXRQYXRoLFxyXG4gICAgICAgIGlucHV0czogbnVtYmVyW10sXHJcbiAgICAgICAgb3V0cHV0czogbnVtYmVyW11bXSxcclxuICAgICAgICB1c2VRdWF0ZXJuaW9uOiBib29sZWFuXHJcbiAgICApIHtcclxuICAgICAgICBmb3IgKGNvbnN0IGtleUZyYW1lIG9mIGFuaW1hdGlvbi5nZXRLZXlzKCkpIHtcclxuICAgICAgICAgICAgaW5wdXRzLnB1c2goa2V5RnJhbWUuZnJhbWUgLyBhbmltYXRpb24uZnJhbWVQZXJTZWNvbmQpOyAvLyBrZXlmcmFtZXMgaW4gc2Vjb25kcy5cclxuICAgICAgICAgICAgX0dMVEZBbmltYXRpb24uX0FkZEtleWZyYW1lVmFsdWUoa2V5RnJhbWUsIGFuaW1hdGlvbiwgb3V0cHV0cywgYW5pbWF0aW9uQ2hhbm5lbFRhcmdldFBhdGgsIGJhYnlsb25UcmFuc2Zvcm1Ob2RlLCB1c2VRdWF0ZXJuaW9uKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIGN1YmljIHNwbGluZSBhbmltYXRpb24gZnJvbSB0aGUgYW5pbWF0aW9uIGtleSBmcmFtZXNcclxuICAgICAqIEBwYXJhbSBiYWJ5bG9uVHJhbnNmb3JtTm9kZSBCYWJ5bG9uSlMgbWVzaFxyXG4gICAgICogQHBhcmFtIGFuaW1hdGlvbiBCYWJ5bG9uSlMgYW5pbWF0aW9uXHJcbiAgICAgKiBAcGFyYW0gYW5pbWF0aW9uQ2hhbm5lbFRhcmdldFBhdGggVGhlIHRhcmdldCBhbmltYXRpb24gY2hhbm5lbFxyXG4gICAgICogQHBhcmFtIGlucHV0cyBBcnJheSB0byBzdG9yZSB0aGUga2V5IGZyYW1lIHRpbWVzXHJcbiAgICAgKiBAcGFyYW0gb3V0cHV0cyBBcnJheSB0byBzdG9yZSB0aGUga2V5IGZyYW1lIGRhdGFcclxuICAgICAqIEBwYXJhbSB1c2VRdWF0ZXJuaW9uIFNwZWNpZmllcyBpZiBxdWF0ZXJuaW9ucyBhcmUgdXNlZCBpbiB0aGUgYW5pbWF0aW9uXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgc3RhdGljIF9DcmVhdGVDdWJpY1NwbGluZUFuaW1hdGlvbihcclxuICAgICAgICBiYWJ5bG9uVHJhbnNmb3JtTm9kZTogTm9kZSxcclxuICAgICAgICBhbmltYXRpb246IEFuaW1hdGlvbixcclxuICAgICAgICBhbmltYXRpb25DaGFubmVsVGFyZ2V0UGF0aDogQW5pbWF0aW9uQ2hhbm5lbFRhcmdldFBhdGgsXHJcbiAgICAgICAgaW5wdXRzOiBudW1iZXJbXSxcclxuICAgICAgICBvdXRwdXRzOiBudW1iZXJbXVtdLFxyXG4gICAgICAgIHVzZVF1YXRlcm5pb246IGJvb2xlYW5cclxuICAgICkge1xyXG4gICAgICAgIGFuaW1hdGlvbi5nZXRLZXlzKCkuZm9yRWFjaChmdW5jdGlvbiAoa2V5RnJhbWUpIHtcclxuICAgICAgICAgICAgaW5wdXRzLnB1c2goa2V5RnJhbWUuZnJhbWUgLyBhbmltYXRpb24uZnJhbWVQZXJTZWNvbmQpOyAvLyBrZXlmcmFtZXMgaW4gc2Vjb25kcy5cclxuICAgICAgICAgICAgX0dMVEZBbmltYXRpb24uX0FkZFNwbGluZVRhbmdlbnQoX1RhbmdlbnRUeXBlLklOVEFOR0VOVCwgb3V0cHV0cywgYW5pbWF0aW9uQ2hhbm5lbFRhcmdldFBhdGgsIEFuaW1hdGlvblNhbXBsZXJJbnRlcnBvbGF0aW9uLkNVQklDU1BMSU5FLCBrZXlGcmFtZSwgdXNlUXVhdGVybmlvbik7XHJcbiAgICAgICAgICAgIF9HTFRGQW5pbWF0aW9uLl9BZGRLZXlmcmFtZVZhbHVlKGtleUZyYW1lLCBhbmltYXRpb24sIG91dHB1dHMsIGFuaW1hdGlvbkNoYW5uZWxUYXJnZXRQYXRoLCBiYWJ5bG9uVHJhbnNmb3JtTm9kZSwgdXNlUXVhdGVybmlvbik7XHJcblxyXG4gICAgICAgICAgICBfR0xURkFuaW1hdGlvbi5fQWRkU3BsaW5lVGFuZ2VudChfVGFuZ2VudFR5cGUuT1VUVEFOR0VOVCwgb3V0cHV0cywgYW5pbWF0aW9uQ2hhbm5lbFRhcmdldFBhdGgsIEFuaW1hdGlvblNhbXBsZXJJbnRlcnBvbGF0aW9uLkNVQklDU1BMSU5FLCBrZXlGcmFtZSwgdXNlUXVhdGVybmlvbik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgX0dldEJhc2VQb3NpdGlvblJvdGF0aW9uT3JTY2FsZShiYWJ5bG9uVHJhbnNmb3JtTm9kZTogTm9kZSwgYW5pbWF0aW9uQ2hhbm5lbFRhcmdldFBhdGg6IEFuaW1hdGlvbkNoYW5uZWxUYXJnZXRQYXRoLCB1c2VRdWF0ZXJuaW9uOiBib29sZWFuKSB7XHJcbiAgICAgICAgbGV0IGJhc2VQb3NpdGlvblJvdGF0aW9uT3JTY2FsZTogbnVtYmVyW107XHJcbiAgICAgICAgaWYgKGFuaW1hdGlvbkNoYW5uZWxUYXJnZXRQYXRoID09PSBBbmltYXRpb25DaGFubmVsVGFyZ2V0UGF0aC5ST1RBVElPTikge1xyXG4gICAgICAgICAgICBpZiAodXNlUXVhdGVybmlvbikge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcSA9IChiYWJ5bG9uVHJhbnNmb3JtTm9kZSBhcyBUcmFuc2Zvcm1Ob2RlKS5yb3RhdGlvblF1YXRlcm5pb247XHJcbiAgICAgICAgICAgICAgICBiYXNlUG9zaXRpb25Sb3RhdGlvbk9yU2NhbGUgPSAocSA/PyBRdWF0ZXJuaW9uLklkZW50aXR5KCkpLmFzQXJyYXkoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHI6IFZlY3RvcjMgPSAoYmFieWxvblRyYW5zZm9ybU5vZGUgYXMgVHJhbnNmb3JtTm9kZSkucm90YXRpb247XHJcbiAgICAgICAgICAgICAgICBiYXNlUG9zaXRpb25Sb3RhdGlvbk9yU2NhbGUgPSAociA/PyBWZWN0b3IzLlplcm8oKSkuYXNBcnJheSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmIChhbmltYXRpb25DaGFubmVsVGFyZ2V0UGF0aCA9PT0gQW5pbWF0aW9uQ2hhbm5lbFRhcmdldFBhdGguVFJBTlNMQVRJT04pIHtcclxuICAgICAgICAgICAgY29uc3QgcDogVmVjdG9yMyA9IChiYWJ5bG9uVHJhbnNmb3JtTm9kZSBhcyBUcmFuc2Zvcm1Ob2RlKS5wb3NpdGlvbjtcclxuICAgICAgICAgICAgYmFzZVBvc2l0aW9uUm90YXRpb25PclNjYWxlID0gKHAgPz8gVmVjdG9yMy5aZXJvKCkpLmFzQXJyYXkoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBzY2FsZVxyXG4gICAgICAgICAgICBjb25zdCBzOiBWZWN0b3IzID0gKGJhYnlsb25UcmFuc2Zvcm1Ob2RlIGFzIFRyYW5zZm9ybU5vZGUpLnNjYWxpbmc7XHJcbiAgICAgICAgICAgIGJhc2VQb3NpdGlvblJvdGF0aW9uT3JTY2FsZSA9IChzID8/IFZlY3RvcjMuT25lKCkpLmFzQXJyYXkoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGJhc2VQb3NpdGlvblJvdGF0aW9uT3JTY2FsZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZHMgYSBrZXkgZnJhbWUgdmFsdWVcclxuICAgICAqIEBwYXJhbSBrZXlGcmFtZVxyXG4gICAgICogQHBhcmFtIGFuaW1hdGlvblxyXG4gICAgICogQHBhcmFtIG91dHB1dHNcclxuICAgICAqIEBwYXJhbSBhbmltYXRpb25DaGFubmVsVGFyZ2V0UGF0aFxyXG4gICAgICogQHBhcmFtIGJhYnlsb25UcmFuc2Zvcm1Ob2RlXHJcbiAgICAgKiBAcGFyYW0gdXNlUXVhdGVybmlvblxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyBfQWRkS2V5ZnJhbWVWYWx1ZShcclxuICAgICAgICBrZXlGcmFtZTogSUFuaW1hdGlvbktleSxcclxuICAgICAgICBhbmltYXRpb246IEFuaW1hdGlvbixcclxuICAgICAgICBvdXRwdXRzOiBudW1iZXJbXVtdLFxyXG4gICAgICAgIGFuaW1hdGlvbkNoYW5uZWxUYXJnZXRQYXRoOiBBbmltYXRpb25DaGFubmVsVGFyZ2V0UGF0aCxcclxuICAgICAgICBiYWJ5bG9uVHJhbnNmb3JtTm9kZTogTm9kZSxcclxuICAgICAgICB1c2VRdWF0ZXJuaW9uOiBib29sZWFuXHJcbiAgICApIHtcclxuICAgICAgICBsZXQgbmV3UG9zaXRpb25Sb3RhdGlvbk9yU2NhbGU6IE51bGxhYmxlPFZlY3RvcjMgfCBRdWF0ZXJuaW9uIHwgbnVtYmVyPjtcclxuICAgICAgICBjb25zdCBhbmltYXRpb25UeXBlID0gYW5pbWF0aW9uLmRhdGFUeXBlO1xyXG4gICAgICAgIGlmIChhbmltYXRpb25UeXBlID09PSBBbmltYXRpb24uQU5JTUFUSU9OVFlQRV9WRUNUT1IzKSB7XHJcbiAgICAgICAgICAgIGxldCB2YWx1ZSA9IGtleUZyYW1lLnZhbHVlLmFzQXJyYXkoKTtcclxuICAgICAgICAgICAgaWYgKGFuaW1hdGlvbkNoYW5uZWxUYXJnZXRQYXRoID09PSBBbmltYXRpb25DaGFubmVsVGFyZ2V0UGF0aC5ST1RBVElPTikge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYXJyYXkgPSBWZWN0b3IzLkZyb21BcnJheSh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByb3RhdGlvblF1YXRlcm5pb24gPSBRdWF0ZXJuaW9uLlJvdGF0aW9uWWF3UGl0Y2hSb2xsKGFycmF5LnksIGFycmF5LngsIGFycmF5LnopO1xyXG4gICAgICAgICAgICAgICAgdmFsdWUgPSByb3RhdGlvblF1YXRlcm5pb24uYXNBcnJheSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG91dHB1dHMucHVzaCh2YWx1ZSk7IC8vIHNjYWxlICB2ZWN0b3IuXHJcbiAgICAgICAgfSBlbHNlIGlmIChhbmltYXRpb25UeXBlID09PSBBbmltYXRpb24uQU5JTUFUSU9OVFlQRV9GTE9BVCkge1xyXG4gICAgICAgICAgICBpZiAoYW5pbWF0aW9uQ2hhbm5lbFRhcmdldFBhdGggPT09IEFuaW1hdGlvbkNoYW5uZWxUYXJnZXRQYXRoLldFSUdIVFMpIHtcclxuICAgICAgICAgICAgICAgIG91dHB1dHMucHVzaChba2V5RnJhbWUudmFsdWVdKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIGhhbmRsZXMgc2luZ2xlIGNvbXBvbmVudCB4LCB5LCB6IG9yIHcgY29tcG9uZW50IGFuaW1hdGlvbiBieSB1c2luZyBhIGJhc2UgcHJvcGVydHkgYW5kIGFuaW1hdGluZyBvdmVyIGEgY29tcG9uZW50LlxyXG4gICAgICAgICAgICAgICAgbmV3UG9zaXRpb25Sb3RhdGlvbk9yU2NhbGUgPSB0aGlzLl9Db252ZXJ0RmFjdG9yVG9WZWN0b3IzT3JRdWF0ZXJuaW9uKFxyXG4gICAgICAgICAgICAgICAgICAgIGtleUZyYW1lLnZhbHVlIGFzIG51bWJlcixcclxuICAgICAgICAgICAgICAgICAgICBiYWJ5bG9uVHJhbnNmb3JtTm9kZSxcclxuICAgICAgICAgICAgICAgICAgICBhbmltYXRpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uQ2hhbm5lbFRhcmdldFBhdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgdXNlUXVhdGVybmlvblxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIGlmIChuZXdQb3NpdGlvblJvdGF0aW9uT3JTY2FsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmltYXRpb25DaGFubmVsVGFyZ2V0UGF0aCA9PT0gQW5pbWF0aW9uQ2hhbm5lbFRhcmdldFBhdGguUk9UQVRJT04pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcG9zUm90U2NhbGUgPSB1c2VRdWF0ZXJuaW9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IChuZXdQb3NpdGlvblJvdGF0aW9uT3JTY2FsZSBhcyBRdWF0ZXJuaW9uKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBRdWF0ZXJuaW9uLlJvdGF0aW9uWWF3UGl0Y2hSb2xsKG5ld1Bvc2l0aW9uUm90YXRpb25PclNjYWxlLnksIG5ld1Bvc2l0aW9uUm90YXRpb25PclNjYWxlLngsIG5ld1Bvc2l0aW9uUm90YXRpb25PclNjYWxlLnopLm5vcm1hbGl6ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXRzLnB1c2gocG9zUm90U2NhbGUuYXNBcnJheSgpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0cy5wdXNoKG5ld1Bvc2l0aW9uUm90YXRpb25PclNjYWxlLmFzQXJyYXkoKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKGFuaW1hdGlvblR5cGUgPT09IEFuaW1hdGlvbi5BTklNQVRJT05UWVBFX1FVQVRFUk5JT04pIHtcclxuICAgICAgICAgICAgb3V0cHV0cy5wdXNoKChrZXlGcmFtZS52YWx1ZSBhcyBRdWF0ZXJuaW9uKS5ub3JtYWxpemUoKS5hc0FycmF5KCkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIFRvb2xzLkVycm9yKFwiZ2xURkFuaW1hdGlvbjogVW5zdXBwb3J0ZWQga2V5IGZyYW1lIHZhbHVlcyBmb3IgYW5pbWF0aW9uIVwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJuYWxcclxuICAgICAqIERldGVybWluZSB0aGUgaW50ZXJwb2xhdGlvbiBiYXNlZCBvbiB0aGUga2V5IGZyYW1lc1xyXG4gICAgICogQHBhcmFtIGtleUZyYW1lc1xyXG4gICAgICogQHBhcmFtIGFuaW1hdGlvbkNoYW5uZWxUYXJnZXRQYXRoXHJcbiAgICAgKiBAcGFyYW0gdXNlUXVhdGVybmlvblxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyBfRGVkdWNlSW50ZXJwb2xhdGlvbihcclxuICAgICAgICBrZXlGcmFtZXM6IElBbmltYXRpb25LZXlbXSxcclxuICAgICAgICBhbmltYXRpb25DaGFubmVsVGFyZ2V0UGF0aDogQW5pbWF0aW9uQ2hhbm5lbFRhcmdldFBhdGgsXHJcbiAgICAgICAgdXNlUXVhdGVybmlvbjogYm9vbGVhblxyXG4gICAgKTogeyBpbnRlcnBvbGF0aW9uVHlwZTogQW5pbWF0aW9uU2FtcGxlckludGVycG9sYXRpb247IHNob3VsZEJha2VBbmltYXRpb246IGJvb2xlYW4gfSB7XHJcbiAgICAgICAgbGV0IGludGVycG9sYXRpb25UeXBlOiBBbmltYXRpb25TYW1wbGVySW50ZXJwb2xhdGlvbiB8IHVuZGVmaW5lZDtcclxuICAgICAgICBsZXQgc2hvdWxkQmFrZUFuaW1hdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgIGxldCBrZXk6IElBbmltYXRpb25LZXk7XHJcblxyXG4gICAgICAgIGlmIChhbmltYXRpb25DaGFubmVsVGFyZ2V0UGF0aCA9PT0gQW5pbWF0aW9uQ2hhbm5lbFRhcmdldFBhdGguUk9UQVRJT04gJiYgIXVzZVF1YXRlcm5pb24pIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgaW50ZXJwb2xhdGlvblR5cGU6IEFuaW1hdGlvblNhbXBsZXJJbnRlcnBvbGF0aW9uLkxJTkVBUiwgc2hvdWxkQmFrZUFuaW1hdGlvbjogdHJ1ZSB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbmd0aCA9IGtleUZyYW1lcy5sZW5ndGg7IGkgPCBsZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICBrZXkgPSBrZXlGcmFtZXNbaV07XHJcbiAgICAgICAgICAgIGlmIChrZXkuaW5UYW5nZW50IHx8IGtleS5vdXRUYW5nZW50KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaW50ZXJwb2xhdGlvblR5cGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaW50ZXJwb2xhdGlvblR5cGUgIT09IEFuaW1hdGlvblNhbXBsZXJJbnRlcnBvbGF0aW9uLkNVQklDU1BMSU5FKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGludGVycG9sYXRpb25UeXBlID0gQW5pbWF0aW9uU2FtcGxlckludGVycG9sYXRpb24uTElORUFSO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaG91bGRCYWtlQW5pbWF0aW9uID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpbnRlcnBvbGF0aW9uVHlwZSA9IEFuaW1hdGlvblNhbXBsZXJJbnRlcnBvbGF0aW9uLkNVQklDU1BMSU5FO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKGludGVycG9sYXRpb25UeXBlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnRlcnBvbGF0aW9uVHlwZSA9PT0gQW5pbWF0aW9uU2FtcGxlckludGVycG9sYXRpb24uQ1VCSUNTUExJTkUgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgKGtleS5pbnRlcnBvbGF0aW9uICYmIGtleS5pbnRlcnBvbGF0aW9uID09PSBBbmltYXRpb25LZXlJbnRlcnBvbGF0aW9uLlNURVAgJiYgaW50ZXJwb2xhdGlvblR5cGUgIT09IEFuaW1hdGlvblNhbXBsZXJJbnRlcnBvbGF0aW9uLlNURVApXHJcbiAgICAgICAgICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGludGVycG9sYXRpb25UeXBlID0gQW5pbWF0aW9uU2FtcGxlckludGVycG9sYXRpb24uTElORUFSO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaG91bGRCYWtlQW5pbWF0aW9uID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoa2V5LmludGVycG9sYXRpb24gJiYga2V5LmludGVycG9sYXRpb24gPT09IEFuaW1hdGlvbktleUludGVycG9sYXRpb24uU1RFUCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnRlcnBvbGF0aW9uVHlwZSA9IEFuaW1hdGlvblNhbXBsZXJJbnRlcnBvbGF0aW9uLlNURVA7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW50ZXJwb2xhdGlvblR5cGUgPSBBbmltYXRpb25TYW1wbGVySW50ZXJwb2xhdGlvbi5MSU5FQVI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghaW50ZXJwb2xhdGlvblR5cGUpIHtcclxuICAgICAgICAgICAgaW50ZXJwb2xhdGlvblR5cGUgPSBBbmltYXRpb25TYW1wbGVySW50ZXJwb2xhdGlvbi5MSU5FQVI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4geyBpbnRlcnBvbGF0aW9uVHlwZTogaW50ZXJwb2xhdGlvblR5cGUsIHNob3VsZEJha2VBbmltYXRpb246IHNob3VsZEJha2VBbmltYXRpb24gfTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZHMgYW4gaW5wdXQgdGFuZ2VudCBvciBvdXRwdXQgdGFuZ2VudCB0byB0aGUgb3V0cHV0IGRhdGFcclxuICAgICAqIElmIGFuIGlucHV0IHRhbmdlbnQgb3Igb3V0cHV0IHRhbmdlbnQgaXMgbWlzc2luZywgaXQgdXNlcyB0aGUgemVybyB2ZWN0b3Igb3IgemVybyBxdWF0ZXJuaW9uXHJcbiAgICAgKiBAcGFyYW0gdGFuZ2VudFR5cGUgU3BlY2lmaWVzIHdoaWNoIHR5cGUgb2YgdGFuZ2VudCB0byBoYW5kbGUgKGluVGFuZ2VudCBvciBvdXRUYW5nZW50KVxyXG4gICAgICogQHBhcmFtIG91dHB1dHMgVGhlIGFuaW1hdGlvbiBkYXRhIGJ5IGtleWZyYW1lXHJcbiAgICAgKiBAcGFyYW0gYW5pbWF0aW9uQ2hhbm5lbFRhcmdldFBhdGggVGhlIHRhcmdldCBhbmltYXRpb24gY2hhbm5lbFxyXG4gICAgICogQHBhcmFtIGludGVycG9sYXRpb24gVGhlIGludGVycG9sYXRpb24gdHlwZVxyXG4gICAgICogQHBhcmFtIGtleUZyYW1lIFRoZSBrZXkgZnJhbWUgd2l0aCB0aGUgYW5pbWF0aW9uIGRhdGFcclxuICAgICAqIEBwYXJhbSB1c2VRdWF0ZXJuaW9uIFNwZWNpZmllcyBpZiBxdWF0ZXJuaW9ucyBhcmUgdXNlZFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyBfQWRkU3BsaW5lVGFuZ2VudChcclxuICAgICAgICB0YW5nZW50VHlwZTogX1RhbmdlbnRUeXBlLFxyXG4gICAgICAgIG91dHB1dHM6IG51bWJlcltdW10sXHJcbiAgICAgICAgYW5pbWF0aW9uQ2hhbm5lbFRhcmdldFBhdGg6IEFuaW1hdGlvbkNoYW5uZWxUYXJnZXRQYXRoLFxyXG4gICAgICAgIGludGVycG9sYXRpb246IEFuaW1hdGlvblNhbXBsZXJJbnRlcnBvbGF0aW9uLFxyXG4gICAgICAgIGtleUZyYW1lOiBJQW5pbWF0aW9uS2V5LFxyXG4gICAgICAgIHVzZVF1YXRlcm5pb246IGJvb2xlYW5cclxuICAgICkge1xyXG4gICAgICAgIGxldCB0YW5nZW50OiBudW1iZXJbXTtcclxuICAgICAgICBjb25zdCB0YW5nZW50VmFsdWU6IFZlY3RvcjMgfCBRdWF0ZXJuaW9uIHwgbnVtYmVyID0gdGFuZ2VudFR5cGUgPT09IF9UYW5nZW50VHlwZS5JTlRBTkdFTlQgPyBrZXlGcmFtZS5pblRhbmdlbnQgOiBrZXlGcmFtZS5vdXRUYW5nZW50O1xyXG4gICAgICAgIGlmIChpbnRlcnBvbGF0aW9uID09PSBBbmltYXRpb25TYW1wbGVySW50ZXJwb2xhdGlvbi5DVUJJQ1NQTElORSkge1xyXG4gICAgICAgICAgICBpZiAoYW5pbWF0aW9uQ2hhbm5lbFRhcmdldFBhdGggPT09IEFuaW1hdGlvbkNoYW5uZWxUYXJnZXRQYXRoLlJPVEFUSU9OKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGFuZ2VudFZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHVzZVF1YXRlcm5pb24pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFuZ2VudCA9ICh0YW5nZW50VmFsdWUgYXMgUXVhdGVybmlvbikuYXNBcnJheSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGFycmF5ID0gdGFuZ2VudFZhbHVlIGFzIFZlY3RvcjM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhbmdlbnQgPSBRdWF0ZXJuaW9uLlJvdGF0aW9uWWF3UGl0Y2hSb2xsKGFycmF5LnksIGFycmF5LngsIGFycmF5LnopLmFzQXJyYXkoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRhbmdlbnQgPSBbMCwgMCwgMCwgMF07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYW5pbWF0aW9uQ2hhbm5lbFRhcmdldFBhdGggPT09IEFuaW1hdGlvbkNoYW5uZWxUYXJnZXRQYXRoLldFSUdIVFMpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0YW5nZW50VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0YW5nZW50ID0gW3RhbmdlbnRWYWx1ZSBhcyBudW1iZXJdO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0YW5nZW50ID0gWzBdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRhbmdlbnRWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRhbmdlbnQgPSAodGFuZ2VudFZhbHVlIGFzIFZlY3RvcjMpLmFzQXJyYXkoKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFuZ2VudCA9IFswLCAwLCAwXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgb3V0cHV0cy5wdXNoKHRhbmdlbnQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCB0aGUgbWluaW11bSBhbmQgbWF4aW11bSBrZXkgZnJhbWVzJyBmcmFtZSB2YWx1ZXNcclxuICAgICAqIEBwYXJhbSBrZXlGcmFtZXMgYW5pbWF0aW9uIGtleSBmcmFtZXNcclxuICAgICAqIEByZXR1cm5zIHRoZSBtaW5pbXVtIGFuZCBtYXhpbXVtIGtleSBmcmFtZSB2YWx1ZVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyBfQ2FsY3VsYXRlTWluTWF4S2V5RnJhbWVzKGtleUZyYW1lczogSUFuaW1hdGlvbktleVtdKTogeyBtaW46IG51bWJlcjsgbWF4OiBudW1iZXIgfSB7XHJcbiAgICAgICAgbGV0IG1pbjogbnVtYmVyID0gSW5maW5pdHk7XHJcbiAgICAgICAgbGV0IG1heDogbnVtYmVyID0gLUluZmluaXR5O1xyXG4gICAgICAgIGtleUZyYW1lcy5mb3JFYWNoKGZ1bmN0aW9uIChrZXlGcmFtZSkge1xyXG4gICAgICAgICAgICBtaW4gPSBNYXRoLm1pbihtaW4sIGtleUZyYW1lLmZyYW1lKTtcclxuICAgICAgICAgICAgbWF4ID0gTWF0aC5tYXgobWF4LCBrZXlGcmFtZS5mcmFtZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiB7IG1pbjogbWluLCBtYXg6IG1heCB9O1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IEltYWdlTWltZVR5cGUgfSBmcm9tIFwiYmFieWxvbmpzLWdsdGYyaW50ZXJmYWNlXCI7XHJcblxyXG4vKipcclxuICogQ2xhc3MgZm9yIGhvbGRpbmcgYW5kIGRvd25sb2FkaW5nIGdsVEYgZmlsZSBkYXRhXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgR0xURkRhdGEge1xyXG4gICAgLyoqXHJcbiAgICAgKiBPYmplY3Qgd2hpY2ggY29udGFpbnMgdGhlIGZpbGUgbmFtZSBhcyB0aGUga2V5IGFuZCBpdHMgZGF0YSBhcyB0aGUgdmFsdWVcclxuICAgICAqL1xyXG4gICAgZ2xURkZpbGVzOiB7IFtmaWxlTmFtZTogc3RyaW5nXTogc3RyaW5nIHwgQmxvYiB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5pdGlhbGl6ZXMgdGhlIGdsVEYgZmlsZSBvYmplY3RcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuZ2xURkZpbGVzID0ge307XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEb3dubG9hZHMgdGhlIGdsVEYgZGF0YSBhcyBmaWxlcyBiYXNlZCBvbiB0aGVpciBuYW1lcyBhbmQgZGF0YVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZG93bmxvYWRGaWxlcygpOiB2b2lkIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDaGVja3MgZm9yIGEgbWF0Y2hpbmcgc3VmZml4IGF0IHRoZSBlbmQgb2YgYSBzdHJpbmcgKGZvciBFUzUgYW5kIGxvd2VyKVxyXG4gICAgICAgICAqIEBwYXJhbSBzdHIgU291cmNlIHN0cmluZ1xyXG4gICAgICAgICAqIEBwYXJhbSBzdWZmaXggU3VmZml4IHRvIHNlYXJjaCBmb3IgaW4gdGhlIHNvdXJjZSBzdHJpbmdcclxuICAgICAgICAgKiBAcmV0dXJucyBCb29sZWFuIGluZGljYXRpbmcgd2hldGhlciB0aGUgc3VmZml4IHdhcyBmb3VuZCAodHJ1ZSkgb3Igbm90IChmYWxzZSlcclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBlbmRzV2l0aChzdHI6IHN0cmluZywgc3VmZml4OiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHN0ci5pbmRleE9mKHN1ZmZpeCwgc3RyLmxlbmd0aCAtIHN1ZmZpeC5sZW5ndGgpICE9PSAtMTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIHRoaXMuZ2xURkZpbGVzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcclxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChsaW5rKTtcclxuICAgICAgICAgICAgbGluay5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwiaGlkZGVuXCIpO1xyXG4gICAgICAgICAgICBsaW5rLmRvd25sb2FkID0ga2V5O1xyXG4gICAgICAgICAgICBjb25zdCBibG9iID0gdGhpcy5nbFRGRmlsZXNba2V5XTtcclxuICAgICAgICAgICAgbGV0IG1pbWVUeXBlO1xyXG5cclxuICAgICAgICAgICAgaWYgKGVuZHNXaXRoKGtleSwgXCIuZ2xiXCIpKSB7XHJcbiAgICAgICAgICAgICAgICBtaW1lVHlwZSA9IHsgdHlwZTogXCJtb2RlbC9nbHRmLWJpbmFyeVwiIH07XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZW5kc1dpdGgoa2V5LCBcIi5iaW5cIikpIHtcclxuICAgICAgICAgICAgICAgIG1pbWVUeXBlID0geyB0eXBlOiBcImFwcGxpY2F0aW9uL29jdGV0LXN0cmVhbVwiIH07XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZW5kc1dpdGgoa2V5LCBcIi5nbHRmXCIpKSB7XHJcbiAgICAgICAgICAgICAgICBtaW1lVHlwZSA9IHsgdHlwZTogXCJtb2RlbC9nbHRmK2pzb25cIiB9O1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGVuZHNXaXRoKGtleSwgXCIuanBlZ1wiKSB8fCBlbmRzV2l0aChrZXksIFwiLmpwZ1wiKSkge1xyXG4gICAgICAgICAgICAgICAgbWltZVR5cGUgPSB7IHR5cGU6IEltYWdlTWltZVR5cGUuSlBFRyB9O1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGVuZHNXaXRoKGtleSwgXCIucG5nXCIpKSB7XHJcbiAgICAgICAgICAgICAgICBtaW1lVHlwZSA9IHsgdHlwZTogSW1hZ2VNaW1lVHlwZS5QTkcgfTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGluay5ocmVmID0gd2luZG93LlVSTC5jcmVhdGVPYmplY3RVUkwobmV3IEJsb2IoW2Jsb2JdLCBtaW1lVHlwZSkpO1xyXG4gICAgICAgICAgICBsaW5rLmNsaWNrKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB0eXBlIHtcclxuICAgIElCdWZmZXJWaWV3LFxyXG4gICAgSUFjY2Vzc29yLFxyXG4gICAgSU5vZGUsXHJcbiAgICBJU2NlbmUsXHJcbiAgICBJTWVzaCxcclxuICAgIElNYXRlcmlhbCxcclxuICAgIElUZXh0dXJlLFxyXG4gICAgSUltYWdlLFxyXG4gICAgSVNhbXBsZXIsXHJcbiAgICBJQW5pbWF0aW9uLFxyXG4gICAgSU1lc2hQcmltaXRpdmUsXHJcbiAgICBJQnVmZmVyLFxyXG4gICAgSUdMVEYsXHJcbiAgICBJVGV4dHVyZUluZm8sXHJcbiAgICBJU2tpbixcclxuICAgIElDYW1lcmEsXHJcbn0gZnJvbSBcImJhYnlsb25qcy1nbHRmMmludGVyZmFjZVwiO1xyXG5pbXBvcnQgeyBBY2Nlc3NvclR5cGUsIEltYWdlTWltZVR5cGUsIE1lc2hQcmltaXRpdmVNb2RlLCBBY2Nlc3NvckNvbXBvbmVudFR5cGUsIENhbWVyYVR5cGUgfSBmcm9tIFwiYmFieWxvbmpzLWdsdGYyaW50ZXJmYWNlXCI7XHJcblxyXG5pbXBvcnQgdHlwZSB7IEZsb2F0QXJyYXksIEluZGljZXNBcnJheSwgTnVsbGFibGUgfSBmcm9tIFwiY29yZS90eXBlc1wiO1xyXG5pbXBvcnQgeyBNYXRyaXgsIFRtcFZlY3RvcnMsIFZlY3RvcjIsIFZlY3RvcjMsIFZlY3RvcjQsIFF1YXRlcm5pb24gfSBmcm9tIFwiY29yZS9NYXRocy9tYXRoLnZlY3RvclwiO1xyXG5pbXBvcnQgeyBDb2xvcjMsIENvbG9yNCB9IGZyb20gXCJjb3JlL01hdGhzL21hdGguY29sb3JcIjtcclxuaW1wb3J0IHsgVG9vbHMgfSBmcm9tIFwiY29yZS9NaXNjL3Rvb2xzXCI7XHJcbmltcG9ydCB7IFZlcnRleEJ1ZmZlciB9IGZyb20gXCJjb3JlL0J1ZmZlcnMvYnVmZmVyXCI7XHJcbmltcG9ydCB0eXBlIHsgTm9kZSB9IGZyb20gXCJjb3JlL25vZGVcIjtcclxuaW1wb3J0IHsgVHJhbnNmb3JtTm9kZSB9IGZyb20gXCJjb3JlL01lc2hlcy90cmFuc2Zvcm1Ob2RlXCI7XHJcbmltcG9ydCB0eXBlIHsgQWJzdHJhY3RNZXNoIH0gZnJvbSBcImNvcmUvTWVzaGVzL2Fic3RyYWN0TWVzaFwiO1xyXG5pbXBvcnQgdHlwZSB7IFN1Yk1lc2ggfSBmcm9tIFwiY29yZS9NZXNoZXMvc3ViTWVzaFwiO1xyXG5pbXBvcnQgeyBNZXNoIH0gZnJvbSBcImNvcmUvTWVzaGVzL21lc2hcIjtcclxuaW1wb3J0IHR5cGUgeyBNb3JwaFRhcmdldCB9IGZyb20gXCJjb3JlL01vcnBoL21vcnBoVGFyZ2V0XCI7XHJcbmltcG9ydCB7IExpbmVzTWVzaCB9IGZyb20gXCJjb3JlL01lc2hlcy9saW5lc01lc2hcIjtcclxuaW1wb3J0IHsgSW5zdGFuY2VkTWVzaCB9IGZyb20gXCJjb3JlL01lc2hlcy9pbnN0YW5jZWRNZXNoXCI7XHJcbmltcG9ydCB0eXBlIHsgQm9uZSB9IGZyb20gXCJjb3JlL0JvbmVzL2JvbmVcIjtcclxuaW1wb3J0IHR5cGUgeyBCYXNlVGV4dHVyZSB9IGZyb20gXCJjb3JlL01hdGVyaWFscy9UZXh0dXJlcy9iYXNlVGV4dHVyZVwiO1xyXG5pbXBvcnQgdHlwZSB7IFRleHR1cmUgfSBmcm9tIFwiY29yZS9NYXRlcmlhbHMvVGV4dHVyZXMvdGV4dHVyZVwiO1xyXG5pbXBvcnQgeyBNYXRlcmlhbCB9IGZyb20gXCJjb3JlL01hdGVyaWFscy9tYXRlcmlhbFwiO1xyXG5pbXBvcnQgeyBFbmdpbmUgfSBmcm9tIFwiY29yZS9FbmdpbmVzL2VuZ2luZVwiO1xyXG5pbXBvcnQgdHlwZSB7IFNjZW5lIH0gZnJvbSBcImNvcmUvc2NlbmVcIjtcclxuXHJcbmltcG9ydCB0eXBlIHsgSUdMVEZFeHBvcnRlckV4dGVuc2lvblYyIH0gZnJvbSBcIi4vZ2xURkV4cG9ydGVyRXh0ZW5zaW9uXCI7XHJcbmltcG9ydCB7IF9HTFRGTWF0ZXJpYWxFeHBvcnRlciB9IGZyb20gXCIuL2dsVEZNYXRlcmlhbEV4cG9ydGVyXCI7XHJcbmltcG9ydCB0eXBlIHsgSUV4cG9ydE9wdGlvbnMgfSBmcm9tIFwiLi9nbFRGU2VyaWFsaXplclwiO1xyXG5pbXBvcnQgeyBfR0xURlV0aWxpdGllcyB9IGZyb20gXCIuL2dsVEZVdGlsaXRpZXNcIjtcclxuaW1wb3J0IHsgR0xURkRhdGEgfSBmcm9tIFwiLi9nbFRGRGF0YVwiO1xyXG5pbXBvcnQgeyBfR0xURkFuaW1hdGlvbiB9IGZyb20gXCIuL2dsVEZBbmltYXRpb25cIjtcclxuaW1wb3J0IHsgQ2FtZXJhIH0gZnJvbSBcImNvcmUvQ2FtZXJhcy9jYW1lcmFcIjtcclxuaW1wb3J0IHsgRW5naW5lU3RvcmUgfSBmcm9tIFwiY29yZS9FbmdpbmVzL2VuZ2luZVN0b3JlXCI7XHJcbmltcG9ydCB7IE11bHRpTWF0ZXJpYWwgfSBmcm9tIFwiY29yZS9NYXRlcmlhbHMvbXVsdGlNYXRlcmlhbFwiO1xyXG5cclxuLy8gTWF0cml4IHRoYXQgY29udmVydHMgaGFuZGVkbmVzcyBvbiB0aGUgWC1heGlzLlxyXG5jb25zdCBjb252ZXJ0SGFuZGVkbmVzc01hdHJpeCA9IE1hdHJpeC5Db21wb3NlKG5ldyBWZWN0b3IzKC0xLCAxLCAxKSwgUXVhdGVybmlvbi5JZGVudGl0eSgpLCBWZWN0b3IzLlplcm8oKSk7XHJcblxyXG4vLyAxODAgZGVncmVlcyByb3RhdGlvbiBpbiBZLlxyXG5jb25zdCByb3RhdGlvbjE4MFkgPSBuZXcgUXVhdGVybmlvbigwLCAxLCAwLCAwKTtcclxuXHJcbmZ1bmN0aW9uIGlzTm9vcE5vZGUobm9kZTogTm9kZSwgdXNlUmlnaHRIYW5kZWRTeXN0ZW06IGJvb2xlYW4pOiBib29sZWFuIHtcclxuICAgIGlmICghKG5vZGUgaW5zdGFuY2VvZiBUcmFuc2Zvcm1Ob2RlKSkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBUcmFuc2Zvcm1cclxuICAgIGlmICh1c2VSaWdodEhhbmRlZFN5c3RlbSkge1xyXG4gICAgICAgIGNvbnN0IG1hdHJpeCA9IG5vZGUuZ2V0V29ybGRNYXRyaXgoKTtcclxuICAgICAgICBpZiAoIW1hdHJpeC5pc0lkZW50aXR5KCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc3QgbWF0cml4ID0gbm9kZS5nZXRXb3JsZE1hdHJpeCgpLm11bHRpcGx5VG9SZWYoY29udmVydEhhbmRlZG5lc3NNYXRyaXgsIFRtcFZlY3RvcnMuTWF0cml4WzBdKTtcclxuICAgICAgICBpZiAoIW1hdHJpeC5pc0lkZW50aXR5KCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBHZW9tZXRyeVxyXG4gICAgaWYgKChub2RlIGluc3RhbmNlb2YgTWVzaCAmJiBub2RlLmdlb21ldHJ5KSB8fCAobm9kZSBpbnN0YW5jZW9mIEluc3RhbmNlZE1lc2ggJiYgbm9kZS5zb3VyY2VNZXNoLmdlb21ldHJ5KSkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdHJ1ZTtcclxufVxyXG5cclxuZnVuY3Rpb24gY29udmVydE5vZGVIYW5kZWRuZXNzKG5vZGU6IElOb2RlKTogdm9pZCB7XHJcbiAgICBjb25zdCB0cmFuc2xhdGlvbiA9IFZlY3RvcjMuRnJvbUFycmF5VG9SZWYobm9kZS50cmFuc2xhdGlvbiB8fCBbMCwgMCwgMF0sIDAsIFRtcFZlY3RvcnMuVmVjdG9yM1swXSk7XHJcbiAgICBjb25zdCByb3RhdGlvbiA9IFF1YXRlcm5pb24uRnJvbUFycmF5VG9SZWYobm9kZS5yb3RhdGlvbiB8fCBbMCwgMCwgMCwgMV0sIDAsIFRtcFZlY3RvcnMuUXVhdGVybmlvblswXSk7XHJcbiAgICBjb25zdCBzY2FsZSA9IFZlY3RvcjMuRnJvbUFycmF5VG9SZWYobm9kZS5zY2FsZSB8fCBbMSwgMSwgMV0sIDAsIFRtcFZlY3RvcnMuVmVjdG9yM1sxXSk7XHJcbiAgICBjb25zdCBtYXRyaXggPSBNYXRyaXguQ29tcG9zZVRvUmVmKHNjYWxlLCByb3RhdGlvbiwgdHJhbnNsYXRpb24sIFRtcFZlY3RvcnMuTWF0cml4WzBdKS5tdWx0aXBseVRvUmVmKGNvbnZlcnRIYW5kZWRuZXNzTWF0cml4LCBUbXBWZWN0b3JzLk1hdHJpeFswXSk7XHJcblxyXG4gICAgbWF0cml4LmRlY29tcG9zZShzY2FsZSwgcm90YXRpb24sIHRyYW5zbGF0aW9uKTtcclxuXHJcbiAgICBpZiAodHJhbnNsYXRpb24uZXF1YWxzVG9GbG9hdHMoMCwgMCwgMCkpIHtcclxuICAgICAgICBkZWxldGUgbm9kZS50cmFuc2xhdGlvbjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbm9kZS50cmFuc2xhdGlvbiA9IHRyYW5zbGF0aW9uLmFzQXJyYXkoKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoUXVhdGVybmlvbi5Jc0lkZW50aXR5KHJvdGF0aW9uKSkge1xyXG4gICAgICAgIGRlbGV0ZSBub2RlLnJvdGF0aW9uO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBub2RlLnJvdGF0aW9uID0gcm90YXRpb24uYXNBcnJheSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChzY2FsZS5lcXVhbHNUb0Zsb2F0cygxLCAxLCAxKSkge1xyXG4gICAgICAgIGRlbGV0ZSBub2RlLnNjYWxlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBub2RlLnNjYWxlID0gc2NhbGUuYXNBcnJheSgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRCaW5hcnlXcml0ZXJGdW5jKGJpbmFyeVdyaXRlcjogX0JpbmFyeVdyaXRlciwgYXR0cmlidXRlQ29tcG9uZW50S2luZDogQWNjZXNzb3JDb21wb25lbnRUeXBlKTogTnVsbGFibGU8KGVudHJ5OiBudW1iZXIsIGJ5dGVPZmZzZXQ/OiBudW1iZXIpID0+IHZvaWQ+IHtcclxuICAgIHN3aXRjaCAoYXR0cmlidXRlQ29tcG9uZW50S2luZCkge1xyXG4gICAgICAgIGNhc2UgQWNjZXNzb3JDb21wb25lbnRUeXBlLlVOU0lHTkVEX0JZVEU6IHtcclxuICAgICAgICAgICAgcmV0dXJuIGJpbmFyeVdyaXRlci5zZXRVSW50OC5iaW5kKGJpbmFyeVdyaXRlcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhc2UgQWNjZXNzb3JDb21wb25lbnRUeXBlLlVOU0lHTkVEX1NIT1JUOiB7XHJcbiAgICAgICAgICAgIHJldHVybiBiaW5hcnlXcml0ZXIuc2V0VUludDE2LmJpbmQoYmluYXJ5V3JpdGVyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2FzZSBBY2Nlc3NvckNvbXBvbmVudFR5cGUuVU5TSUdORURfSU5UOiB7XHJcbiAgICAgICAgICAgIHJldHVybiBiaW5hcnlXcml0ZXIuc2V0VUludDMyLmJpbmQoYmluYXJ5V3JpdGVyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2FzZSBBY2Nlc3NvckNvbXBvbmVudFR5cGUuRkxPQVQ6IHtcclxuICAgICAgICAgICAgcmV0dXJuIGJpbmFyeVdyaXRlci5zZXRGbG9hdDMyLmJpbmQoYmluYXJ5V3JpdGVyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZGVmYXVsdDoge1xyXG4gICAgICAgICAgICBUb29scy5XYXJuKFwiVW5zdXBwb3J0ZWQgQXR0cmlidXRlIENvbXBvbmVudCBraW5kOiBcIiArIGF0dHJpYnV0ZUNvbXBvbmVudEtpbmQpO1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBVdGlsaXR5IGludGVyZmFjZSBmb3Igc3RvcmluZyB2ZXJ0ZXggYXR0cmlidXRlIGRhdGFcclxuICogQGludGVybmFsXHJcbiAqL1xyXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25hbWluZy1jb252ZW50aW9uXHJcbmludGVyZmFjZSBfSVZlcnRleEF0dHJpYnV0ZURhdGEge1xyXG4gICAgLyoqXHJcbiAgICAgKiBTcGVjaWZpZXMgdGhlIEJhYnlsb24gVmVydGV4IEJ1ZmZlciBUeXBlIChQb3NpdGlvbiwgTm9ybWFsLCBDb2xvciwgZXRjLilcclxuICAgICAqL1xyXG4gICAga2luZDogc3RyaW5nO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogU3BlY2lmaWVzIHRoZSBnbFRGIEFjY2Vzc29yIFR5cGUgKFZFQzIsIFZFQzMsIGV0Yy4pXHJcbiAgICAgKi9cclxuICAgIGFjY2Vzc29yVHlwZTogQWNjZXNzb3JUeXBlO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogU3BlY2lmaWVzIHRoZSBnbFRGIEFjY2Vzc29yIENvbXBvbmVudCBUeXBlIChCWVRFLCBVTlNJR05FRF9CWVRFLCBGTE9BVCwgU0hPUlQsIElOVCwgZXRjLi4pXHJcbiAgICAgKi9cclxuICAgIGFjY2Vzc29yQ29tcG9uZW50VHlwZTogQWNjZXNzb3JDb21wb25lbnRUeXBlO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogU3BlY2lmaWVzIHRoZSBCdWZmZXJWaWV3IGluZGV4IGZvciB0aGUgdmVydGV4IGF0dHJpYnV0ZSBkYXRhXHJcbiAgICAgKi9cclxuICAgIGJ1ZmZlclZpZXdJbmRleD86IG51bWJlcjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFNwZWNpZmllcyB0aGUgbnVtYmVyIG9mIGJ5dGVzIHBlciBhdHRyaWJ1dGUgZWxlbWVudCAoZS5nLiBwb3NpdGlvbiB3b3VsZCBiZSAzIGZsb2F0cyAoeC95L3opIHdoZXJlIGVhY2ggZmxvYXQgaXMgNCBieXRlcywgc28gYSAxMiBieXRlIHN0cmlkZSlcclxuICAgICAqL1xyXG4gICAgYnl0ZVN0cmlkZT86IG51bWJlcjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFNwZWNpZmllcyBpbmZvcm1hdGlvbiBhYm91dCBlYWNoIG1vcnBoIHRhcmdldCBhc3NvY2lhdGVkIHdpdGggdGhpcyBhdHRyaWJ1dGVcclxuICAgICAqL1xyXG4gICAgbW9ycGhUYXJnZXRJbmZvPzogUmVhZG9ubHk8eyBidWZmZXJWaWV3SW5kZXg6IG51bWJlcjsgdmVydGV4Q291bnQ6IG51bWJlcjsgYWNjZXNzb3JUeXBlOiBBY2Nlc3NvclR5cGU7IG1pbk1heD86IHsgbWluOiBWZWN0b3IzOyBtYXg6IFZlY3RvcjMgfSB9PltdO1xyXG59XHJcblxyXG4vKipcclxuICogQ29udmVydHMgQmFieWxvbiBTY2VuZSBpbnRvIGdsVEYgMi4wLlxyXG4gKiBAaW50ZXJuYWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBfRXhwb3J0ZXIge1xyXG4gICAgLyoqXHJcbiAgICAgKiBTdG9yZXMgdGhlIGdsVEYgdG8gZXhwb3J0XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBfZ2xURjogSUdMVEY7XHJcbiAgICAvKipcclxuICAgICAqIFN0b3JlcyBhbGwgZ2VuZXJhdGVkIGJ1ZmZlciB2aWV3cywgd2hpY2ggcmVwcmVzZW50cyB2aWV3cyBpbnRvIHRoZSBtYWluIGdsVEYgYnVmZmVyIGRhdGFcclxuICAgICAqL1xyXG4gICAgcHVibGljIF9idWZmZXJWaWV3czogSUJ1ZmZlclZpZXdbXTtcclxuICAgIC8qKlxyXG4gICAgICogU3RvcmVzIGFsbCB0aGUgZ2VuZXJhdGVkIGFjY2Vzc29ycywgd2hpY2ggaXMgdXNlZCBmb3IgYWNjZXNzaW5nIHRoZSBkYXRhIHdpdGhpbiB0aGUgYnVmZmVyIHZpZXdzIGluIGdsVEZcclxuICAgICAqL1xyXG4gICAgcHVibGljIF9hY2Nlc3NvcnM6IElBY2Nlc3NvcltdO1xyXG4gICAgLyoqXHJcbiAgICAgKiBTdG9yZXMgYWxsIHRoZSBnZW5lcmF0ZWQgbm9kZXMsIHdoaWNoIGNvbnRhaW5zIHRyYW5zZm9ybSBhbmQvb3IgbWVzaCBpbmZvcm1hdGlvbiBwZXIgbm9kZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgX25vZGVzOiBJTm9kZVtdO1xyXG4gICAgLyoqXHJcbiAgICAgKiBTdG9yZXMgYWxsIHRoZSBnZW5lcmF0ZWQgZ2xURiBzY2VuZXMsIHdoaWNoIHN0b3JlcyBtdWx0aXBsZSBub2RlIGhpZXJhcmNoaWVzXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgX3NjZW5lczogSVNjZW5lW107XHJcbiAgICAvKipcclxuICAgICAqIFN0b3JlcyBhbGwgdGhlIGdlbmVyYXRlZCBnbFRGIGNhbWVyYXNcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBfY2FtZXJhczogSUNhbWVyYVtdO1xyXG4gICAgLyoqXHJcbiAgICAgKiBTdG9yZXMgYWxsIHRoZSBnZW5lcmF0ZWQgbWVzaCBpbmZvcm1hdGlvbiwgZWFjaCBjb250YWluaW5nIGEgc2V0IG9mIHByaW1pdGl2ZXMgdG8gcmVuZGVyIGluIGdsVEZcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBfbWVzaGVzOiBJTWVzaFtdO1xyXG4gICAgLyoqXHJcbiAgICAgKiBTdG9yZXMgYWxsIHRoZSBnZW5lcmF0ZWQgbWF0ZXJpYWwgaW5mb3JtYXRpb24sIHdoaWNoIHJlcHJlc2VudHMgdGhlIGFwcGVhcmFuY2Ugb2YgZWFjaCBwcmltaXRpdmVcclxuICAgICAqL1xyXG4gICAgcHVibGljIF9tYXRlcmlhbHM6IElNYXRlcmlhbFtdO1xyXG5cclxuICAgIHB1YmxpYyBfbWF0ZXJpYWxNYXA6IHsgW21hdGVyaWFsSUQ6IG51bWJlcl06IG51bWJlciB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBTdG9yZXMgYWxsIHRoZSBnZW5lcmF0ZWQgdGV4dHVyZSBpbmZvcm1hdGlvbiwgd2hpY2ggaXMgcmVmZXJlbmNlZCBieSBnbFRGIG1hdGVyaWFsc1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgX3RleHR1cmVzOiBJVGV4dHVyZVtdO1xyXG4gICAgLyoqXHJcbiAgICAgKiBTdG9yZXMgYWxsIHRoZSBnZW5lcmF0ZWQgaW1hZ2UgaW5mb3JtYXRpb24sIHdoaWNoIGlzIHJlZmVyZW5jZWQgYnkgZ2xURiB0ZXh0dXJlc1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgX2ltYWdlczogSUltYWdlW107XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTdG9yZXMgYWxsIHRoZSB0ZXh0dXJlIHNhbXBsZXJzXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBfc2FtcGxlcnM6IElTYW1wbGVyW107XHJcbiAgICAvKipcclxuICAgICAqIFN0b3JlcyBhbGwgdGhlIGdlbmVyYXRlZCBnbFRGIHNraW5zXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBfc2tpbnM6IElTa2luW107XHJcbiAgICAvKipcclxuICAgICAqIFN0b3JlcyBhbGwgdGhlIGdlbmVyYXRlZCBhbmltYXRpb24gc2FtcGxlcnMsIHdoaWNoIGlzIHJlZmVyZW5jZWQgYnkgZ2xURiBhbmltYXRpb25zXHJcbiAgICAgKi9cclxuICAgIC8qKlxyXG4gICAgICogU3RvcmVzIHRoZSBhbmltYXRpb25zIGZvciBnbFRGIG1vZGVsc1xyXG4gICAgICovXHJcbiAgICBwcml2YXRlIF9hbmltYXRpb25zOiBJQW5pbWF0aW9uW107XHJcbiAgICAvKipcclxuICAgICAqIFN0b3JlcyB0aGUgdG90YWwgYW1vdW50IG9mIGJ5dGVzIHN0b3JlZCBpbiB0aGUgZ2xURiBidWZmZXJcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBfdG90YWxCeXRlTGVuZ3RoOiBudW1iZXI7XHJcbiAgICAvKipcclxuICAgICAqIFN0b3JlcyBhIHJlZmVyZW5jZSB0byB0aGUgQmFieWxvbiBzY2VuZSBjb250YWluaW5nIHRoZSBzb3VyY2UgZ2VvbWV0cnkgYW5kIG1hdGVyaWFsIGluZm9ybWF0aW9uXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBfYmFieWxvblNjZW5lOiBTY2VuZTtcclxuICAgIC8qKlxyXG4gICAgICogU3RvcmVzIGEgbWFwIG9mIHRoZSBpbWFnZSBkYXRhLCB3aGVyZSB0aGUga2V5IGlzIHRoZSBmaWxlIG5hbWUgYW5kIHRoZSB2YWx1ZVxyXG4gICAgICogaXMgdGhlIGltYWdlIGRhdGFcclxuICAgICAqL1xyXG4gICAgcHVibGljIF9pbWFnZURhdGE6IHsgW2ZpbGVOYW1lOiBzdHJpbmddOiB7IGRhdGE6IEFycmF5QnVmZmVyOyBtaW1lVHlwZTogSW1hZ2VNaW1lVHlwZSB9IH07XHJcblxyXG4gICAgcHJpdmF0ZSBfb3JkZXJlZEltYWdlRGF0YTogQXJyYXk8eyBkYXRhOiBBcnJheUJ1ZmZlcjsgbWltZVR5cGU6IEltYWdlTWltZVR5cGUgfT47XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTdG9yZXMgYSBtYXAgb2YgdGhlIHVuaXF1ZSBpZCBvZiBhIG5vZGUgdG8gaXRzIGluZGV4IGluIHRoZSBub2RlIGFycmF5XHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgX25vZGVNYXA6IHsgW2tleTogbnVtYmVyXTogbnVtYmVyIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBCYWtlZCBhbmltYXRpb24gc2FtcGxlIHJhdGVcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBfYW5pbWF0aW9uU2FtcGxlUmF0ZTogbnVtYmVyO1xyXG5cclxuICAgIHByaXZhdGUgX29wdGlvbnM6IElFeHBvcnRPcHRpb25zO1xyXG5cclxuICAgIHByaXZhdGUgX2xvY2FsRW5naW5lOiBFbmdpbmU7XHJcblxyXG4gICAgcHVibGljIF9nbFRGTWF0ZXJpYWxFeHBvcnRlcjogX0dMVEZNYXRlcmlhbEV4cG9ydGVyO1xyXG5cclxuICAgIHByaXZhdGUgX2V4dGVuc2lvbnM6IHsgW25hbWU6IHN0cmluZ106IElHTFRGRXhwb3J0ZXJFeHRlbnNpb25WMiB9ID0ge307XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgX0V4dGVuc2lvbk5hbWVzID0gbmV3IEFycmF5PHN0cmluZz4oKTtcclxuICAgIHByaXZhdGUgc3RhdGljIF9FeHRlbnNpb25GYWN0b3JpZXM6IHsgW25hbWU6IHN0cmluZ106IChleHBvcnRlcjogX0V4cG9ydGVyKSA9PiBJR0xURkV4cG9ydGVyRXh0ZW5zaW9uVjIgfSA9IHt9O1xyXG5cclxuICAgIHByaXZhdGUgX2FwcGx5RXh0ZW5zaW9uPFQ+KFxyXG4gICAgICAgIG5vZGU6IE51bGxhYmxlPFQ+LFxyXG4gICAgICAgIGV4dGVuc2lvbnM6IElHTFRGRXhwb3J0ZXJFeHRlbnNpb25WMltdLFxyXG4gICAgICAgIGluZGV4OiBudW1iZXIsXHJcbiAgICAgICAgYWN0aW9uQXN5bmM6IChleHRlbnNpb246IElHTFRGRXhwb3J0ZXJFeHRlbnNpb25WMiwgbm9kZTogTnVsbGFibGU8VD4pID0+IFByb21pc2U8TnVsbGFibGU8VD4+IHwgdW5kZWZpbmVkXHJcbiAgICApOiBQcm9taXNlPE51bGxhYmxlPFQ+PiB7XHJcbiAgICAgICAgaWYgKGluZGV4ID49IGV4dGVuc2lvbnMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobm9kZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBjdXJyZW50UHJvbWlzZSA9IGFjdGlvbkFzeW5jKGV4dGVuc2lvbnNbaW5kZXhdLCBub2RlKTtcclxuXHJcbiAgICAgICAgaWYgKCFjdXJyZW50UHJvbWlzZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYXBwbHlFeHRlbnNpb24obm9kZSwgZXh0ZW5zaW9ucywgaW5kZXggKyAxLCBhY3Rpb25Bc3luYyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gY3VycmVudFByb21pc2UudGhlbigobmV3Tm9kZSkgPT4gdGhpcy5fYXBwbHlFeHRlbnNpb24obmV3Tm9kZSwgZXh0ZW5zaW9ucywgaW5kZXggKyAxLCBhY3Rpb25Bc3luYykpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2FwcGx5RXh0ZW5zaW9uczxUPihcclxuICAgICAgICBub2RlOiBOdWxsYWJsZTxUPixcclxuICAgICAgICBhY3Rpb25Bc3luYzogKGV4dGVuc2lvbjogSUdMVEZFeHBvcnRlckV4dGVuc2lvblYyLCBub2RlOiBOdWxsYWJsZTxUPikgPT4gUHJvbWlzZTxOdWxsYWJsZTxUPj4gfCB1bmRlZmluZWRcclxuICAgICk6IFByb21pc2U8TnVsbGFibGU8VD4+IHtcclxuICAgICAgICBjb25zdCBleHRlbnNpb25zOiBJR0xURkV4cG9ydGVyRXh0ZW5zaW9uVjJbXSA9IFtdO1xyXG4gICAgICAgIGZvciAoY29uc3QgbmFtZSBvZiBfRXhwb3J0ZXIuX0V4dGVuc2lvbk5hbWVzKSB7XHJcbiAgICAgICAgICAgIGV4dGVuc2lvbnMucHVzaCh0aGlzLl9leHRlbnNpb25zW25hbWVdKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLl9hcHBseUV4dGVuc2lvbihub2RlLCBleHRlbnNpb25zLCAwLCBhY3Rpb25Bc3luYyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIF9leHRlbnNpb25zUHJlRXhwb3J0VGV4dHVyZUFzeW5jKGNvbnRleHQ6IHN0cmluZywgYmFieWxvblRleHR1cmU6IE51bGxhYmxlPFRleHR1cmU+LCBtaW1lVHlwZTogSW1hZ2VNaW1lVHlwZSk6IFByb21pc2U8TnVsbGFibGU8QmFzZVRleHR1cmU+PiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FwcGx5RXh0ZW5zaW9ucyhiYWJ5bG9uVGV4dHVyZSwgKGV4dGVuc2lvbiwgbm9kZSkgPT4gZXh0ZW5zaW9uLnByZUV4cG9ydFRleHR1cmVBc3luYyAmJiBleHRlbnNpb24ucHJlRXhwb3J0VGV4dHVyZUFzeW5jKGNvbnRleHQsIG5vZGUsIG1pbWVUeXBlKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIF9leHRlbnNpb25zUG9zdEV4cG9ydE1lc2hQcmltaXRpdmVBc3luYyhcclxuICAgICAgICBjb250ZXh0OiBzdHJpbmcsXHJcbiAgICAgICAgbWVzaFByaW1pdGl2ZTogSU1lc2hQcmltaXRpdmUsXHJcbiAgICAgICAgYmFieWxvblN1Yk1lc2g6IFN1Yk1lc2gsXHJcbiAgICAgICAgYmluYXJ5V3JpdGVyOiBfQmluYXJ5V3JpdGVyXHJcbiAgICApOiBQcm9taXNlPE51bGxhYmxlPElNZXNoUHJpbWl0aXZlPj4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9hcHBseUV4dGVuc2lvbnMoXHJcbiAgICAgICAgICAgIG1lc2hQcmltaXRpdmUsXHJcbiAgICAgICAgICAgIChleHRlbnNpb24sIG5vZGUpID0+IGV4dGVuc2lvbi5wb3N0RXhwb3J0TWVzaFByaW1pdGl2ZUFzeW5jICYmIGV4dGVuc2lvbi5wb3N0RXhwb3J0TWVzaFByaW1pdGl2ZUFzeW5jKGNvbnRleHQsIG5vZGUsIGJhYnlsb25TdWJNZXNoLCBiaW5hcnlXcml0ZXIpXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgX2V4dGVuc2lvbnNQb3N0RXhwb3J0Tm9kZUFzeW5jKFxyXG4gICAgICAgIGNvbnRleHQ6IHN0cmluZyxcclxuICAgICAgICBub2RlOiBOdWxsYWJsZTxJTm9kZT4sXHJcbiAgICAgICAgYmFieWxvbk5vZGU6IE5vZGUsXHJcbiAgICAgICAgbm9kZU1hcDogeyBba2V5OiBudW1iZXJdOiBudW1iZXIgfSxcclxuICAgICAgICBiaW5hcnlXcml0ZXI6IF9CaW5hcnlXcml0ZXJcclxuICAgICk6IFByb21pc2U8TnVsbGFibGU8SU5vZGU+PiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FwcGx5RXh0ZW5zaW9ucyhub2RlLCAoZXh0ZW5zaW9uLCBub2RlKSA9PiBleHRlbnNpb24ucG9zdEV4cG9ydE5vZGVBc3luYyAmJiBleHRlbnNpb24ucG9zdEV4cG9ydE5vZGVBc3luYyhjb250ZXh0LCBub2RlLCBiYWJ5bG9uTm9kZSwgbm9kZU1hcCwgYmluYXJ5V3JpdGVyKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIF9leHRlbnNpb25zUG9zdEV4cG9ydE1hdGVyaWFsQXN5bmMoY29udGV4dDogc3RyaW5nLCBtYXRlcmlhbDogTnVsbGFibGU8SU1hdGVyaWFsPiwgYmFieWxvbk1hdGVyaWFsOiBNYXRlcmlhbCk6IFByb21pc2U8TnVsbGFibGU8SU1hdGVyaWFsPj4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9hcHBseUV4dGVuc2lvbnMobWF0ZXJpYWwsIChleHRlbnNpb24sIG5vZGUpID0+IGV4dGVuc2lvbi5wb3N0RXhwb3J0TWF0ZXJpYWxBc3luYyAmJiBleHRlbnNpb24ucG9zdEV4cG9ydE1hdGVyaWFsQXN5bmMoY29udGV4dCwgbm9kZSwgYmFieWxvbk1hdGVyaWFsKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIF9leHRlbnNpb25zUG9zdEV4cG9ydE1hdGVyaWFsQWRkaXRpb25hbFRleHR1cmVzKGNvbnRleHQ6IHN0cmluZywgbWF0ZXJpYWw6IElNYXRlcmlhbCwgYmFieWxvbk1hdGVyaWFsOiBNYXRlcmlhbCk6IEJhc2VUZXh0dXJlW10ge1xyXG4gICAgICAgIGNvbnN0IG91dHB1dDogQmFzZVRleHR1cmVbXSA9IFtdO1xyXG5cclxuICAgICAgICBmb3IgKGNvbnN0IG5hbWUgb2YgX0V4cG9ydGVyLl9FeHRlbnNpb25OYW1lcykge1xyXG4gICAgICAgICAgICBjb25zdCBleHRlbnNpb24gPSB0aGlzLl9leHRlbnNpb25zW25hbWVdO1xyXG5cclxuICAgICAgICAgICAgaWYgKGV4dGVuc2lvbi5wb3N0RXhwb3J0TWF0ZXJpYWxBZGRpdGlvbmFsVGV4dHVyZXMpIHtcclxuICAgICAgICAgICAgICAgIG91dHB1dC5wdXNoKC4uLmV4dGVuc2lvbi5wb3N0RXhwb3J0TWF0ZXJpYWxBZGRpdGlvbmFsVGV4dHVyZXMoY29udGV4dCwgbWF0ZXJpYWwsIGJhYnlsb25NYXRlcmlhbCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gb3V0cHV0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBfZXh0ZW5zaW9uc1Bvc3RFeHBvcnRUZXh0dXJlcyhjb250ZXh0OiBzdHJpbmcsIHRleHR1cmVJbmZvOiBJVGV4dHVyZUluZm8sIGJhYnlsb25UZXh0dXJlOiBCYXNlVGV4dHVyZSk6IHZvaWQge1xyXG4gICAgICAgIGZvciAoY29uc3QgbmFtZSBvZiBfRXhwb3J0ZXIuX0V4dGVuc2lvbk5hbWVzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGV4dGVuc2lvbiA9IHRoaXMuX2V4dGVuc2lvbnNbbmFtZV07XHJcblxyXG4gICAgICAgICAgICBpZiAoZXh0ZW5zaW9uLnBvc3RFeHBvcnRUZXh0dXJlKSB7XHJcbiAgICAgICAgICAgICAgICBleHRlbnNpb24ucG9zdEV4cG9ydFRleHR1cmUoY29udGV4dCwgdGV4dHVyZUluZm8sIGJhYnlsb25UZXh0dXJlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9mb3JFYWNoRXh0ZW5zaW9ucyhhY3Rpb246IChleHRlbnNpb246IElHTFRGRXhwb3J0ZXJFeHRlbnNpb25WMikgPT4gdm9pZCk6IHZvaWQge1xyXG4gICAgICAgIGZvciAoY29uc3QgbmFtZSBvZiBfRXhwb3J0ZXIuX0V4dGVuc2lvbk5hbWVzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGV4dGVuc2lvbiA9IHRoaXMuX2V4dGVuc2lvbnNbbmFtZV07XHJcbiAgICAgICAgICAgIGlmIChleHRlbnNpb24uZW5hYmxlZCkge1xyXG4gICAgICAgICAgICAgICAgYWN0aW9uKGV4dGVuc2lvbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZXh0ZW5zaW9uc09uRXhwb3J0aW5nKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX2ZvckVhY2hFeHRlbnNpb25zKChleHRlbnNpb24pID0+IHtcclxuICAgICAgICAgICAgaWYgKGV4dGVuc2lvbi53YXNVc2VkKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fZ2xURi5leHRlbnNpb25zVXNlZCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZ2xURi5leHRlbnNpb25zVXNlZCA9IFtdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9nbFRGLmV4dGVuc2lvbnNVc2VkLmluZGV4T2YoZXh0ZW5zaW9uLm5hbWUpID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2dsVEYuZXh0ZW5zaW9uc1VzZWQucHVzaChleHRlbnNpb24ubmFtZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGV4dGVuc2lvbi5yZXF1aXJlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9nbFRGLmV4dGVuc2lvbnNSZXF1aXJlZCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2dsVEYuZXh0ZW5zaW9uc1JlcXVpcmVkID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9nbFRGLmV4dGVuc2lvbnNSZXF1aXJlZC5pbmRleE9mKGV4dGVuc2lvbi5uYW1lKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZ2xURi5leHRlbnNpb25zUmVxdWlyZWQucHVzaChleHRlbnNpb24ubmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9nbFRGLmV4dGVuc2lvbnMgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2dsVEYuZXh0ZW5zaW9ucyA9IHt9O1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChleHRlbnNpb24ub25FeHBvcnRpbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICBleHRlbnNpb24ub25FeHBvcnRpbmcoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTG9hZCBnbFRGIHNlcmlhbGl6ZXIgZXh0ZW5zaW9uc1xyXG4gICAgICovXHJcbiAgICBwcml2YXRlIF9sb2FkRXh0ZW5zaW9ucygpOiB2b2lkIHtcclxuICAgICAgICBmb3IgKGNvbnN0IG5hbWUgb2YgX0V4cG9ydGVyLl9FeHRlbnNpb25OYW1lcykge1xyXG4gICAgICAgICAgICBjb25zdCBleHRlbnNpb24gPSBfRXhwb3J0ZXIuX0V4dGVuc2lvbkZhY3Rvcmllc1tuYW1lXSh0aGlzKTtcclxuICAgICAgICAgICAgdGhpcy5fZXh0ZW5zaW9uc1tuYW1lXSA9IGV4dGVuc2lvbjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIGEgZ2xURiBFeHBvcnRlciBpbnN0YW5jZSwgd2hpY2ggY2FuIGFjY2VwdCBvcHRpb25hbCBleHBvcnRlciBvcHRpb25zXHJcbiAgICAgKiBAcGFyYW0gYmFieWxvblNjZW5lIEJhYnlsb24gc2NlbmUgb2JqZWN0XHJcbiAgICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIHRvIG1vZGlmeSB0aGUgYmVoYXZpb3Igb2YgdGhlIGV4cG9ydGVyXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihiYWJ5bG9uU2NlbmU/OiBOdWxsYWJsZTxTY2VuZT4sIG9wdGlvbnM/OiBJRXhwb3J0T3B0aW9ucykge1xyXG4gICAgICAgIHRoaXMuX2dsVEYgPSB7XHJcbiAgICAgICAgICAgIGFzc2V0OiB7IGdlbmVyYXRvcjogYEJhYnlsb24uanMgdiR7RW5naW5lLlZlcnNpb259YCwgdmVyc2lvbjogXCIyLjBcIiB9LFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgYmFieWxvblNjZW5lID0gYmFieWxvblNjZW5lIHx8IEVuZ2luZVN0b3JlLkxhc3RDcmVhdGVkU2NlbmU7XHJcbiAgICAgICAgaWYgKCFiYWJ5bG9uU2NlbmUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9iYWJ5bG9uU2NlbmUgPSBiYWJ5bG9uU2NlbmU7XHJcbiAgICAgICAgdGhpcy5fYnVmZmVyVmlld3MgPSBbXTtcclxuICAgICAgICB0aGlzLl9hY2Nlc3NvcnMgPSBbXTtcclxuICAgICAgICB0aGlzLl9tZXNoZXMgPSBbXTtcclxuICAgICAgICB0aGlzLl9zY2VuZXMgPSBbXTtcclxuICAgICAgICB0aGlzLl9jYW1lcmFzID0gW107XHJcbiAgICAgICAgdGhpcy5fbm9kZXMgPSBbXTtcclxuICAgICAgICB0aGlzLl9pbWFnZXMgPSBbXTtcclxuICAgICAgICB0aGlzLl9tYXRlcmlhbHMgPSBbXTtcclxuICAgICAgICB0aGlzLl9tYXRlcmlhbE1hcCA9IFtdO1xyXG4gICAgICAgIHRoaXMuX3RleHR1cmVzID0gW107XHJcbiAgICAgICAgdGhpcy5fc2FtcGxlcnMgPSBbXTtcclxuICAgICAgICB0aGlzLl9za2lucyA9IFtdO1xyXG4gICAgICAgIHRoaXMuX2FuaW1hdGlvbnMgPSBbXTtcclxuICAgICAgICB0aGlzLl9pbWFnZURhdGEgPSB7fTtcclxuICAgICAgICB0aGlzLl9vcmRlcmVkSW1hZ2VEYXRhID0gW107XHJcbiAgICAgICAgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XHJcbiAgICAgICAgdGhpcy5fYW5pbWF0aW9uU2FtcGxlUmF0ZSA9IHRoaXMuX29wdGlvbnMuYW5pbWF0aW9uU2FtcGxlUmF0ZSB8fCAxIC8gNjA7XHJcblxyXG4gICAgICAgIHRoaXMuX2dsVEZNYXRlcmlhbEV4cG9ydGVyID0gbmV3IF9HTFRGTWF0ZXJpYWxFeHBvcnRlcih0aGlzKTtcclxuICAgICAgICB0aGlzLl9sb2FkRXh0ZW5zaW9ucygpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkaXNwb3NlKCkge1xyXG4gICAgICAgIGZvciAoY29uc3QgZXh0ZW5zaW9uS2V5IGluIHRoaXMuX2V4dGVuc2lvbnMpIHtcclxuICAgICAgICAgICAgY29uc3QgZXh0ZW5zaW9uID0gdGhpcy5fZXh0ZW5zaW9uc1tleHRlbnNpb25LZXldO1xyXG5cclxuICAgICAgICAgICAgZXh0ZW5zaW9uLmRpc3Bvc2UoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBvcHRpb25zKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9vcHRpb25zO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVnaXN0ZXJzIGEgZ2xURiBleHBvcnRlciBleHRlbnNpb25cclxuICAgICAqIEBwYXJhbSBuYW1lIE5hbWUgb2YgdGhlIGV4dGVuc2lvbiB0byBleHBvcnRcclxuICAgICAqIEBwYXJhbSBmYWN0b3J5IFRoZSBmYWN0b3J5IGZ1bmN0aW9uIHRoYXQgY3JlYXRlcyB0aGUgZXhwb3J0ZXIgZXh0ZW5zaW9uXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgUmVnaXN0ZXJFeHRlbnNpb24obmFtZTogc3RyaW5nLCBmYWN0b3J5OiAoZXhwb3J0ZXI6IF9FeHBvcnRlcikgPT4gSUdMVEZFeHBvcnRlckV4dGVuc2lvblYyKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKF9FeHBvcnRlci5VbnJlZ2lzdGVyRXh0ZW5zaW9uKG5hbWUpKSB7XHJcbiAgICAgICAgICAgIFRvb2xzLldhcm4oYEV4dGVuc2lvbiB3aXRoIHRoZSBuYW1lICR7bmFtZX0gYWxyZWFkeSBleGlzdHNgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIF9FeHBvcnRlci5fRXh0ZW5zaW9uRmFjdG9yaWVzW25hbWVdID0gZmFjdG9yeTtcclxuICAgICAgICBfRXhwb3J0ZXIuX0V4dGVuc2lvbk5hbWVzLnB1c2gobmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBVbi1yZWdpc3RlcnMgYW4gZXhwb3J0ZXIgZXh0ZW5zaW9uXHJcbiAgICAgKiBAcGFyYW0gbmFtZSBUaGUgbmFtZSBmbyB0aGUgZXhwb3J0ZXIgZXh0ZW5zaW9uXHJcbiAgICAgKiBAcmV0dXJucyBBIGJvb2xlYW4gaW5kaWNhdGluZyB3aGV0aGVyIHRoZSBleHRlbnNpb24gaGFzIGJlZW4gdW4tcmVnaXN0ZXJlZFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIFVucmVnaXN0ZXJFeHRlbnNpb24obmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKCFfRXhwb3J0ZXIuX0V4dGVuc2lvbkZhY3Rvcmllc1tuYW1lXSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRlbGV0ZSBfRXhwb3J0ZXIuX0V4dGVuc2lvbkZhY3Rvcmllc1tuYW1lXTtcclxuXHJcbiAgICAgICAgY29uc3QgaW5kZXggPSBfRXhwb3J0ZXIuX0V4dGVuc2lvbk5hbWVzLmluZGV4T2YobmFtZSk7XHJcbiAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xyXG4gICAgICAgICAgICBfRXhwb3J0ZXIuX0V4dGVuc2lvbk5hbWVzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9yZW9yZGVySW5kaWNlc0Jhc2VkT25QcmltaXRpdmVNb2RlKHN1Ym1lc2g6IFN1Yk1lc2gsIHByaW1pdGl2ZU1vZGU6IG51bWJlciwgYmFieWxvbkluZGljZXM6IEluZGljZXNBcnJheSwgYnl0ZU9mZnNldDogbnVtYmVyLCBiaW5hcnlXcml0ZXI6IF9CaW5hcnlXcml0ZXIpIHtcclxuICAgICAgICBzd2l0Y2ggKHByaW1pdGl2ZU1vZGUpIHtcclxuICAgICAgICAgICAgY2FzZSBNYXRlcmlhbC5UcmlhbmdsZUZpbGxNb2RlOiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWJ5dGVPZmZzZXQpIHtcclxuICAgICAgICAgICAgICAgICAgICBieXRlT2Zmc2V0ID0gMDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSBzdWJtZXNoLmluZGV4U3RhcnQsIGxlbmd0aCA9IHN1Ym1lc2guaW5kZXhTdGFydCArIHN1Ym1lc2guaW5kZXhDb3VudDsgaSA8IGxlbmd0aDsgaSA9IGkgKyAzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSBieXRlT2Zmc2V0ICsgaSAqIDQ7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gc3dhcCB0aGUgc2Vjb25kIGFuZCB0aGlyZCBpbmRpY2VzXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2Vjb25kSW5kZXggPSBiaW5hcnlXcml0ZXIuZ2V0VUludDMyKGluZGV4ICsgNCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGhpcmRJbmRleCA9IGJpbmFyeVdyaXRlci5nZXRVSW50MzIoaW5kZXggKyA4KTtcclxuICAgICAgICAgICAgICAgICAgICBiaW5hcnlXcml0ZXIuc2V0VUludDMyKHRoaXJkSW5kZXgsIGluZGV4ICsgNCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYmluYXJ5V3JpdGVyLnNldFVJbnQzMihzZWNvbmRJbmRleCwgaW5kZXggKyA4KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhc2UgTWF0ZXJpYWwuVHJpYW5nbGVGYW5EcmF3TW9kZToge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IHN1Ym1lc2guaW5kZXhTdGFydCArIHN1Ym1lc2guaW5kZXhDb3VudCAtIDEsIHN0YXJ0ID0gc3VibWVzaC5pbmRleFN0YXJ0OyBpID49IHN0YXJ0OyAtLWkpIHtcclxuICAgICAgICAgICAgICAgICAgICBiaW5hcnlXcml0ZXIuc2V0VUludDMyKGJhYnlsb25JbmRpY2VzW2ldLCBieXRlT2Zmc2V0KTtcclxuICAgICAgICAgICAgICAgICAgICBieXRlT2Zmc2V0ICs9IDQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIE1hdGVyaWFsLlRyaWFuZ2xlU3RyaXBEcmF3TW9kZToge1xyXG4gICAgICAgICAgICAgICAgaWYgKHN1Ym1lc2guaW5kZXhDb3VudCA+PSAzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmluYXJ5V3JpdGVyLnNldFVJbnQzMihiYWJ5bG9uSW5kaWNlc1tzdWJtZXNoLmluZGV4U3RhcnQgKyAyXSwgYnl0ZU9mZnNldCArIDQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJpbmFyeVdyaXRlci5zZXRVSW50MzIoYmFieWxvbkluZGljZXNbc3VibWVzaC5pbmRleFN0YXJ0ICsgMV0sIGJ5dGVPZmZzZXQgKyA4KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVvcmRlcnMgdGhlIHZlcnRleCBhdHRyaWJ1dGUgZGF0YSBiYXNlZCBvbiB0aGUgcHJpbWl0aXZlIG1vZGUuICBUaGlzIGlzIG5lY2Vzc2FyeSB3aGVuIGluZGljZXMgYXJlIG5vdCBhdmFpbGFibGUgYW5kIHRoZSB3aW5kaW5nIG9yZGVyIGlzXHJcbiAgICAgKiBjbG9jay13aXNlIGR1cmluZyBleHBvcnQgdG8gZ2xURlxyXG4gICAgICogQHBhcmFtIHN1Ym1lc2ggQmFieWxvbkpTIHN1Ym1lc2hcclxuICAgICAqIEBwYXJhbSBwcmltaXRpdmVNb2RlIFByaW1pdGl2ZSBtb2RlIG9mIHRoZSBtZXNoXHJcbiAgICAgKiBAcGFyYW0gdmVydGV4QnVmZmVyS2luZCBUaGUgdHlwZSBvZiB2ZXJ0ZXggYXR0cmlidXRlXHJcbiAgICAgKiBAcGFyYW0gbWVzaEF0dHJpYnV0ZUFycmF5IFRoZSB2ZXJ0ZXggYXR0cmlidXRlIGRhdGFcclxuICAgICAqIEBwYXJhbSBieXRlT2Zmc2V0IFRoZSBvZmZzZXQgdG8gdGhlIGJpbmFyeSBkYXRhXHJcbiAgICAgKiBAcGFyYW0gYmluYXJ5V3JpdGVyIFRoZSBiaW5hcnkgZGF0YSBmb3IgdGhlIGdsVEYgZmlsZVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIF9yZW9yZGVyVmVydGV4QXR0cmlidXRlRGF0YUJhc2VkT25QcmltaXRpdmVNb2RlKFxyXG4gICAgICAgIHN1Ym1lc2g6IFN1Yk1lc2gsXHJcbiAgICAgICAgcHJpbWl0aXZlTW9kZTogbnVtYmVyLFxyXG4gICAgICAgIHZlcnRleEJ1ZmZlcktpbmQ6IHN0cmluZyxcclxuICAgICAgICBtZXNoQXR0cmlidXRlQXJyYXk6IEZsb2F0QXJyYXksXHJcbiAgICAgICAgYnl0ZU9mZnNldDogbnVtYmVyLFxyXG4gICAgICAgIGJpbmFyeVdyaXRlcjogX0JpbmFyeVdyaXRlclxyXG4gICAgKTogdm9pZCB7XHJcbiAgICAgICAgc3dpdGNoIChwcmltaXRpdmVNb2RlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgTWF0ZXJpYWwuVHJpYW5nbGVGaWxsTW9kZToge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVvcmRlclRyaWFuZ2xlRmlsbE1vZGUoc3VibWVzaCwgdmVydGV4QnVmZmVyS2luZCwgbWVzaEF0dHJpYnV0ZUFycmF5LCBieXRlT2Zmc2V0LCBiaW5hcnlXcml0ZXIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSBNYXRlcmlhbC5UcmlhbmdsZVN0cmlwRHJhd01vZGU6IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3Jlb3JkZXJUcmlhbmdsZVN0cmlwRHJhd01vZGUoc3VibWVzaCwgdmVydGV4QnVmZmVyS2luZCwgbWVzaEF0dHJpYnV0ZUFycmF5LCBieXRlT2Zmc2V0LCBiaW5hcnlXcml0ZXIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSBNYXRlcmlhbC5UcmlhbmdsZUZhbkRyYXdNb2RlOiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZW9yZGVyVHJpYW5nbGVGYW5Nb2RlKHN1Ym1lc2gsIHZlcnRleEJ1ZmZlcktpbmQsIG1lc2hBdHRyaWJ1dGVBcnJheSwgYnl0ZU9mZnNldCwgYmluYXJ5V3JpdGVyKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVvcmRlcnMgdGhlIHZlcnRleCBhdHRyaWJ1dGVzIGluIHRoZSBjb3JyZWN0IHRyaWFuZ2xlIG1vZGUgb3JkZXIgLiAgVGhpcyBpcyBuZWNlc3Nhcnkgd2hlbiBpbmRpY2VzIGFyZSBub3QgYXZhaWxhYmxlIGFuZCB0aGUgd2luZGluZyBvcmRlciBpc1xyXG4gICAgICogY2xvY2std2lzZSBkdXJpbmcgZXhwb3J0IHRvIGdsVEZcclxuICAgICAqIEBwYXJhbSBzdWJtZXNoIEJhYnlsb25KUyBzdWJtZXNoXHJcbiAgICAgKiBAcGFyYW0gdmVydGV4QnVmZmVyS2luZCBUaGUgdHlwZSBvZiB2ZXJ0ZXggYXR0cmlidXRlXHJcbiAgICAgKiBAcGFyYW0gbWVzaEF0dHJpYnV0ZUFycmF5IFRoZSB2ZXJ0ZXggYXR0cmlidXRlIGRhdGFcclxuICAgICAqIEBwYXJhbSBieXRlT2Zmc2V0IFRoZSBvZmZzZXQgdG8gdGhlIGJpbmFyeSBkYXRhXHJcbiAgICAgKiBAcGFyYW0gYmluYXJ5V3JpdGVyIFRoZSBiaW5hcnkgZGF0YSBmb3IgdGhlIGdsVEYgZmlsZVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIF9yZW9yZGVyVHJpYW5nbGVGaWxsTW9kZShzdWJtZXNoOiBTdWJNZXNoLCB2ZXJ0ZXhCdWZmZXJLaW5kOiBzdHJpbmcsIG1lc2hBdHRyaWJ1dGVBcnJheTogRmxvYXRBcnJheSwgYnl0ZU9mZnNldDogbnVtYmVyLCBiaW5hcnlXcml0ZXI6IF9CaW5hcnlXcml0ZXIpIHtcclxuICAgICAgICBjb25zdCB2ZXJ0ZXhCdWZmZXIgPSB0aGlzLl9nZXRWZXJ0ZXhCdWZmZXJGcm9tTWVzaCh2ZXJ0ZXhCdWZmZXJLaW5kLCBzdWJtZXNoLmdldE1lc2goKSBhcyBNZXNoKTtcclxuICAgICAgICBpZiAodmVydGV4QnVmZmVyKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHN0cmlkZSA9IHZlcnRleEJ1ZmZlci5ieXRlU3RyaWRlIC8gVmVydGV4QnVmZmVyLkdldFR5cGVCeXRlTGVuZ3RoKHZlcnRleEJ1ZmZlci50eXBlKTtcclxuICAgICAgICAgICAgaWYgKHN1Ym1lc2gudmVydGljZXNDb3VudCAlIDMgIT09IDApIHtcclxuICAgICAgICAgICAgICAgIFRvb2xzLkVycm9yKFwiVGhlIHN1Ym1lc2ggdmVydGljZXMgZm9yIHRoZSB0cmlhbmdsZSBmaWxsIG1vZGUgaXMgbm90IGRpdmlzaWJsZSBieSAzIVwiKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHZlcnRleERhdGE6IFZlY3RvcjJbXSB8IFZlY3RvcjNbXSB8IFZlY3RvcjRbXSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgbGV0IGluZGV4ID0gMDtcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAodmVydGV4QnVmZmVyS2luZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgVmVydGV4QnVmZmVyLlBvc2l0aW9uS2luZDpcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFZlcnRleEJ1ZmZlci5Ob3JtYWxLaW5kOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IHggPSBzdWJtZXNoLnZlcnRpY2VzU3RhcnQ7IHggPCBzdWJtZXNoLnZlcnRpY2VzU3RhcnQgKyBzdWJtZXNoLnZlcnRpY2VzQ291bnQ7IHggPSB4ICsgMykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSB4ICogc3RyaWRlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKHZlcnRleERhdGEgYXMgVmVjdG9yM1tdKS5wdXNoKFZlY3RvcjMuRnJvbUFycmF5KG1lc2hBdHRyaWJ1dGVBcnJheSwgaW5kZXgpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2ZXJ0ZXhEYXRhIGFzIFZlY3RvcjNbXSkucHVzaChWZWN0b3IzLkZyb21BcnJheShtZXNoQXR0cmlidXRlQXJyYXksIGluZGV4ICsgMiAqIHN0cmlkZSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKHZlcnRleERhdGEgYXMgVmVjdG9yM1tdKS5wdXNoKFZlY3RvcjMuRnJvbUFycmF5KG1lc2hBdHRyaWJ1dGVBcnJheSwgaW5kZXggKyBzdHJpZGUpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBWZXJ0ZXhCdWZmZXIuVGFuZ2VudEtpbmQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgeCA9IHN1Ym1lc2gudmVydGljZXNTdGFydDsgeCA8IHN1Ym1lc2gudmVydGljZXNTdGFydCArIHN1Ym1lc2gudmVydGljZXNDb3VudDsgeCA9IHggKyAzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleCA9IHggKiBzdHJpZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAodmVydGV4RGF0YSBhcyBWZWN0b3I0W10pLnB1c2goVmVjdG9yNC5Gcm9tQXJyYXkobWVzaEF0dHJpYnV0ZUFycmF5LCBpbmRleCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKHZlcnRleERhdGEgYXMgVmVjdG9yNFtdKS5wdXNoKFZlY3RvcjQuRnJvbUFycmF5KG1lc2hBdHRyaWJ1dGVBcnJheSwgaW5kZXggKyAyICogc3RyaWRlKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAodmVydGV4RGF0YSBhcyBWZWN0b3I0W10pLnB1c2goVmVjdG9yNC5Gcm9tQXJyYXkobWVzaEF0dHJpYnV0ZUFycmF5LCBpbmRleCArIHN0cmlkZSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFZlcnRleEJ1ZmZlci5Db2xvcktpbmQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2l6ZSA9IHZlcnRleEJ1ZmZlci5nZXRTaXplKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IHggPSBzdWJtZXNoLnZlcnRpY2VzU3RhcnQ7IHggPCBzdWJtZXNoLnZlcnRpY2VzU3RhcnQgKyBzdWJtZXNoLnZlcnRpY2VzQ291bnQ7IHggPSB4ICsgc2l6ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSB4ICogc3RyaWRlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNpemUgPT09IDQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodmVydGV4RGF0YSBhcyBWZWN0b3I0W10pLnB1c2goVmVjdG9yNC5Gcm9tQXJyYXkobWVzaEF0dHJpYnV0ZUFycmF5LCBpbmRleCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2ZXJ0ZXhEYXRhIGFzIFZlY3RvcjRbXSkucHVzaChWZWN0b3I0LkZyb21BcnJheShtZXNoQXR0cmlidXRlQXJyYXksIGluZGV4ICsgMiAqIHN0cmlkZSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2ZXJ0ZXhEYXRhIGFzIFZlY3RvcjRbXSkucHVzaChWZWN0b3I0LkZyb21BcnJheShtZXNoQXR0cmlidXRlQXJyYXksIGluZGV4ICsgc3RyaWRlKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2ZXJ0ZXhEYXRhIGFzIFZlY3RvcjNbXSkucHVzaChWZWN0b3IzLkZyb21BcnJheShtZXNoQXR0cmlidXRlQXJyYXksIGluZGV4KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHZlcnRleERhdGEgYXMgVmVjdG9yM1tdKS5wdXNoKFZlY3RvcjMuRnJvbUFycmF5KG1lc2hBdHRyaWJ1dGVBcnJheSwgaW5kZXggKyAyICogc3RyaWRlKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHZlcnRleERhdGEgYXMgVmVjdG9yM1tdKS5wdXNoKFZlY3RvcjMuRnJvbUFycmF5KG1lc2hBdHRyaWJ1dGVBcnJheSwgaW5kZXggKyBzdHJpZGUpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBWZXJ0ZXhCdWZmZXIuVVZLaW5kOlxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgVmVydGV4QnVmZmVyLlVWMktpbmQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgeCA9IHN1Ym1lc2gudmVydGljZXNTdGFydDsgeCA8IHN1Ym1lc2gudmVydGljZXNTdGFydCArIHN1Ym1lc2gudmVydGljZXNDb3VudDsgeCA9IHggKyAzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleCA9IHggKiBzdHJpZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAodmVydGV4RGF0YSBhcyBWZWN0b3IyW10pLnB1c2goVmVjdG9yMi5Gcm9tQXJyYXkobWVzaEF0dHJpYnV0ZUFycmF5LCBpbmRleCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKHZlcnRleERhdGEgYXMgVmVjdG9yMltdKS5wdXNoKFZlY3RvcjIuRnJvbUFycmF5KG1lc2hBdHRyaWJ1dGVBcnJheSwgaW5kZXggKyAyICogc3RyaWRlKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAodmVydGV4RGF0YSBhcyBWZWN0b3IyW10pLnB1c2goVmVjdG9yMi5Gcm9tQXJyYXkobWVzaEF0dHJpYnV0ZUFycmF5LCBpbmRleCArIHN0cmlkZSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFRvb2xzLkVycm9yKGBVbnN1cHBvcnRlZCBWZXJ0ZXggQnVmZmVyIHR5cGU6ICR7dmVydGV4QnVmZmVyS2luZH1gKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLl93cml0ZVZlcnRleEF0dHJpYnV0ZURhdGEodmVydGV4RGF0YSwgYnl0ZU9mZnNldCwgdmVydGV4QnVmZmVyS2luZCwgYmluYXJ5V3JpdGVyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIFRvb2xzLldhcm4oYHJlb3JkZXJUcmlhbmdsZUZpbGxNb2RlOiBWZXJ0ZXggQnVmZmVyIEtpbmQgJHt2ZXJ0ZXhCdWZmZXJLaW5kfSBub3QgcHJlc2VudCFgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW9yZGVycyB0aGUgdmVydGV4IGF0dHJpYnV0ZXMgaW4gdGhlIGNvcnJlY3QgdHJpYW5nbGUgc3RyaXAgb3JkZXIuICBUaGlzIGlzIG5lY2Vzc2FyeSB3aGVuIGluZGljZXMgYXJlIG5vdCBhdmFpbGFibGUgYW5kIHRoZSB3aW5kaW5nIG9yZGVyIGlzXHJcbiAgICAgKiBjbG9jay13aXNlIGR1cmluZyBleHBvcnQgdG8gZ2xURlxyXG4gICAgICogQHBhcmFtIHN1Ym1lc2ggQmFieWxvbkpTIHN1Ym1lc2hcclxuICAgICAqIEBwYXJhbSB2ZXJ0ZXhCdWZmZXJLaW5kIFRoZSB0eXBlIG9mIHZlcnRleCBhdHRyaWJ1dGVcclxuICAgICAqIEBwYXJhbSBtZXNoQXR0cmlidXRlQXJyYXkgVGhlIHZlcnRleCBhdHRyaWJ1dGUgZGF0YVxyXG4gICAgICogQHBhcmFtIGJ5dGVPZmZzZXQgVGhlIG9mZnNldCB0byB0aGUgYmluYXJ5IGRhdGFcclxuICAgICAqIEBwYXJhbSBiaW5hcnlXcml0ZXIgVGhlIGJpbmFyeSBkYXRhIGZvciB0aGUgZ2xURiBmaWxlXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgX3Jlb3JkZXJUcmlhbmdsZVN0cmlwRHJhd01vZGUoc3VibWVzaDogU3ViTWVzaCwgdmVydGV4QnVmZmVyS2luZDogc3RyaW5nLCBtZXNoQXR0cmlidXRlQXJyYXk6IEZsb2F0QXJyYXksIGJ5dGVPZmZzZXQ6IG51bWJlciwgYmluYXJ5V3JpdGVyOiBfQmluYXJ5V3JpdGVyKSB7XHJcbiAgICAgICAgY29uc3QgdmVydGV4QnVmZmVyID0gdGhpcy5fZ2V0VmVydGV4QnVmZmVyRnJvbU1lc2godmVydGV4QnVmZmVyS2luZCwgc3VibWVzaC5nZXRNZXNoKCkgYXMgTWVzaCk7XHJcbiAgICAgICAgaWYgKHZlcnRleEJ1ZmZlcikge1xyXG4gICAgICAgICAgICBjb25zdCBzdHJpZGUgPSB2ZXJ0ZXhCdWZmZXIuYnl0ZVN0cmlkZSAvIFZlcnRleEJ1ZmZlci5HZXRUeXBlQnl0ZUxlbmd0aCh2ZXJ0ZXhCdWZmZXIudHlwZSk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCB2ZXJ0ZXhEYXRhOiBWZWN0b3IyW10gfCBWZWN0b3IzW10gfCBWZWN0b3I0W10gPSBbXTtcclxuICAgICAgICAgICAgbGV0IGluZGV4ID0gMDtcclxuICAgICAgICAgICAgc3dpdGNoICh2ZXJ0ZXhCdWZmZXJLaW5kKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFZlcnRleEJ1ZmZlci5Qb3NpdGlvbktpbmQ6XHJcbiAgICAgICAgICAgICAgICBjYXNlIFZlcnRleEJ1ZmZlci5Ob3JtYWxLaW5kOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5kZXggPSBzdWJtZXNoLnZlcnRpY2VzU3RhcnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgKHZlcnRleERhdGEgYXMgVmVjdG9yM1tdKS5wdXNoKFZlY3RvcjMuRnJvbUFycmF5KG1lc2hBdHRyaWJ1dGVBcnJheSwgaW5kZXggKyAyICogc3RyaWRlKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgKHZlcnRleERhdGEgYXMgVmVjdG9yM1tdKS5wdXNoKFZlY3RvcjMuRnJvbUFycmF5KG1lc2hBdHRyaWJ1dGVBcnJheSwgaW5kZXggKyBzdHJpZGUpKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNhc2UgVmVydGV4QnVmZmVyLlRhbmdlbnRLaW5kOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgeCA9IHN1Ym1lc2gudmVydGljZXNTdGFydCArIHN1Ym1lc2gudmVydGljZXNDb3VudCAtIDE7IHggPj0gc3VibWVzaC52ZXJ0aWNlc1N0YXJ0OyAtLXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSB4ICogc3RyaWRlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAodmVydGV4RGF0YSBhcyBWZWN0b3I0W10pLnB1c2goVmVjdG9yNC5Gcm9tQXJyYXkobWVzaEF0dHJpYnV0ZUFycmF5LCBpbmRleCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNhc2UgVmVydGV4QnVmZmVyLkNvbG9yS2luZDoge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IHggPSBzdWJtZXNoLnZlcnRpY2VzU3RhcnQgKyBzdWJtZXNoLnZlcnRpY2VzQ291bnQgLSAxOyB4ID49IHN1Ym1lc2gudmVydGljZXNTdGFydDsgLS14KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0geCAqIHN0cmlkZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmVydGV4QnVmZmVyLmdldFNpemUoKSA9PT0gNFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAodmVydGV4RGF0YSBhcyBWZWN0b3I0W10pLnB1c2goVmVjdG9yNC5Gcm9tQXJyYXkobWVzaEF0dHJpYnV0ZUFycmF5LCBpbmRleCkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICh2ZXJ0ZXhEYXRhIGFzIFZlY3RvcjNbXSkucHVzaChWZWN0b3IzLkZyb21BcnJheShtZXNoQXR0cmlidXRlQXJyYXksIGluZGV4KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2FzZSBWZXJ0ZXhCdWZmZXIuVVZLaW5kOlxyXG4gICAgICAgICAgICAgICAgY2FzZSBWZXJ0ZXhCdWZmZXIuVVYyS2luZDoge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IHggPSBzdWJtZXNoLnZlcnRpY2VzU3RhcnQgKyBzdWJtZXNoLnZlcnRpY2VzQ291bnQgLSAxOyB4ID49IHN1Ym1lc2gudmVydGljZXNTdGFydDsgLS14KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0geCAqIHN0cmlkZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgKHZlcnRleERhdGEgYXMgVmVjdG9yMltdKS5wdXNoKFZlY3RvcjIuRnJvbUFycmF5KG1lc2hBdHRyaWJ1dGVBcnJheSwgaW5kZXgpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgVG9vbHMuRXJyb3IoYFVuc3VwcG9ydGVkIFZlcnRleCBCdWZmZXIgdHlwZTogJHt2ZXJ0ZXhCdWZmZXJLaW5kfWApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX3dyaXRlVmVydGV4QXR0cmlidXRlRGF0YSh2ZXJ0ZXhEYXRhLCBieXRlT2Zmc2V0ICsgMTIsIHZlcnRleEJ1ZmZlcktpbmQsIGJpbmFyeVdyaXRlcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgVG9vbHMuV2FybihgcmVvcmRlclRyaWFuZ2xlU3RyaXBEcmF3TW9kZTogVmVydGV4IGJ1ZmZlciBraW5kICR7dmVydGV4QnVmZmVyS2luZH0gbm90IHByZXNlbnQhYCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVvcmRlcnMgdGhlIHZlcnRleCBhdHRyaWJ1dGVzIGluIHRoZSBjb3JyZWN0IHRyaWFuZ2xlIGZhbiBvcmRlci4gIFRoaXMgaXMgbmVjZXNzYXJ5IHdoZW4gaW5kaWNlcyBhcmUgbm90IGF2YWlsYWJsZSBhbmQgdGhlIHdpbmRpbmcgb3JkZXIgaXNcclxuICAgICAqIGNsb2NrLXdpc2UgZHVyaW5nIGV4cG9ydCB0byBnbFRGXHJcbiAgICAgKiBAcGFyYW0gc3VibWVzaCBCYWJ5bG9uSlMgc3VibWVzaFxyXG4gICAgICogQHBhcmFtIHZlcnRleEJ1ZmZlcktpbmQgVGhlIHR5cGUgb2YgdmVydGV4IGF0dHJpYnV0ZVxyXG4gICAgICogQHBhcmFtIG1lc2hBdHRyaWJ1dGVBcnJheSBUaGUgdmVydGV4IGF0dHJpYnV0ZSBkYXRhXHJcbiAgICAgKiBAcGFyYW0gYnl0ZU9mZnNldCBUaGUgb2Zmc2V0IHRvIHRoZSBiaW5hcnkgZGF0YVxyXG4gICAgICogQHBhcmFtIGJpbmFyeVdyaXRlciBUaGUgYmluYXJ5IGRhdGEgZm9yIHRoZSBnbFRGIGZpbGVcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBfcmVvcmRlclRyaWFuZ2xlRmFuTW9kZShzdWJtZXNoOiBTdWJNZXNoLCB2ZXJ0ZXhCdWZmZXJLaW5kOiBzdHJpbmcsIG1lc2hBdHRyaWJ1dGVBcnJheTogRmxvYXRBcnJheSwgYnl0ZU9mZnNldDogbnVtYmVyLCBiaW5hcnlXcml0ZXI6IF9CaW5hcnlXcml0ZXIpIHtcclxuICAgICAgICBjb25zdCB2ZXJ0ZXhCdWZmZXIgPSB0aGlzLl9nZXRWZXJ0ZXhCdWZmZXJGcm9tTWVzaCh2ZXJ0ZXhCdWZmZXJLaW5kLCBzdWJtZXNoLmdldE1lc2goKSBhcyBNZXNoKTtcclxuICAgICAgICBpZiAodmVydGV4QnVmZmVyKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHN0cmlkZSA9IHZlcnRleEJ1ZmZlci5ieXRlU3RyaWRlIC8gVmVydGV4QnVmZmVyLkdldFR5cGVCeXRlTGVuZ3RoKHZlcnRleEJ1ZmZlci50eXBlKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHZlcnRleERhdGE6IFZlY3RvcjJbXSB8IFZlY3RvcjNbXSB8IFZlY3RvcjRbXSA9IFtdO1xyXG4gICAgICAgICAgICBsZXQgaW5kZXggPSAwO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKHZlcnRleEJ1ZmZlcktpbmQpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgVmVydGV4QnVmZmVyLlBvc2l0aW9uS2luZDpcclxuICAgICAgICAgICAgICAgIGNhc2UgVmVydGV4QnVmZmVyLk5vcm1hbEtpbmQ6IHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCB4ID0gc3VibWVzaC52ZXJ0aWNlc1N0YXJ0ICsgc3VibWVzaC52ZXJ0aWNlc0NvdW50IC0gMTsgeCA+PSBzdWJtZXNoLnZlcnRpY2VzU3RhcnQ7IC0teCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleCA9IHggKiBzdHJpZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICh2ZXJ0ZXhEYXRhIGFzIFZlY3RvcjNbXSkucHVzaChWZWN0b3IzLkZyb21BcnJheShtZXNoQXR0cmlidXRlQXJyYXksIGluZGV4KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2FzZSBWZXJ0ZXhCdWZmZXIuVGFuZ2VudEtpbmQ6IHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCB4ID0gc3VibWVzaC52ZXJ0aWNlc1N0YXJ0ICsgc3VibWVzaC52ZXJ0aWNlc0NvdW50IC0gMTsgeCA+PSBzdWJtZXNoLnZlcnRpY2VzU3RhcnQ7IC0teCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleCA9IHggKiBzdHJpZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICh2ZXJ0ZXhEYXRhIGFzIFZlY3RvcjRbXSkucHVzaChWZWN0b3I0LkZyb21BcnJheShtZXNoQXR0cmlidXRlQXJyYXksIGluZGV4KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2FzZSBWZXJ0ZXhCdWZmZXIuQ29sb3JLaW5kOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgeCA9IHN1Ym1lc2gudmVydGljZXNTdGFydCArIHN1Ym1lc2gudmVydGljZXNDb3VudCAtIDE7IHggPj0gc3VibWVzaC52ZXJ0aWNlc1N0YXJ0OyAtLXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSB4ICogc3RyaWRlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAodmVydGV4RGF0YSBhcyBWZWN0b3I0W10pLnB1c2goVmVjdG9yNC5Gcm9tQXJyYXkobWVzaEF0dHJpYnV0ZUFycmF5LCBpbmRleCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2ZXJ0ZXhCdWZmZXIuZ2V0U2l6ZSgpID09PSA0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICh2ZXJ0ZXhEYXRhIGFzIFZlY3RvcjRbXSkucHVzaChWZWN0b3I0LkZyb21BcnJheShtZXNoQXR0cmlidXRlQXJyYXksIGluZGV4KSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogKHZlcnRleERhdGEgYXMgVmVjdG9yM1tdKS5wdXNoKFZlY3RvcjMuRnJvbUFycmF5KG1lc2hBdHRyaWJ1dGVBcnJheSwgaW5kZXgpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjYXNlIFZlcnRleEJ1ZmZlci5VVktpbmQ6XHJcbiAgICAgICAgICAgICAgICBjYXNlIFZlcnRleEJ1ZmZlci5VVjJLaW5kOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgeCA9IHN1Ym1lc2gudmVydGljZXNTdGFydCArIHN1Ym1lc2gudmVydGljZXNDb3VudCAtIDE7IHggPj0gc3VibWVzaC52ZXJ0aWNlc1N0YXJ0OyAtLXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSB4ICogc3RyaWRlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAodmVydGV4RGF0YSBhcyBWZWN0b3IyW10pLnB1c2goVmVjdG9yMi5Gcm9tQXJyYXkobWVzaEF0dHJpYnV0ZUFycmF5LCBpbmRleCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHtcclxuICAgICAgICAgICAgICAgICAgICBUb29scy5FcnJvcihgVW5zdXBwb3J0ZWQgVmVydGV4IEJ1ZmZlciB0eXBlOiAke3ZlcnRleEJ1ZmZlcktpbmR9YCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fd3JpdGVWZXJ0ZXhBdHRyaWJ1dGVEYXRhKHZlcnRleERhdGEsIGJ5dGVPZmZzZXQsIHZlcnRleEJ1ZmZlcktpbmQsIGJpbmFyeVdyaXRlcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgVG9vbHMuV2FybihgcmVvcmRlclRyaWFuZ2xlRmFuTW9kZTogVmVydGV4IGJ1ZmZlciBraW5kICR7dmVydGV4QnVmZmVyS2luZH0gbm90IHByZXNlbnQhYCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogV3JpdGVzIHRoZSB2ZXJ0ZXggYXR0cmlidXRlIGRhdGEgdG8gYmluYXJ5XHJcbiAgICAgKiBAcGFyYW0gdmVydGljZXMgVGhlIHZlcnRpY2VzIHRvIHdyaXRlIHRvIHRoZSBiaW5hcnkgd3JpdGVyXHJcbiAgICAgKiBAcGFyYW0gYnl0ZU9mZnNldCBUaGUgb2Zmc2V0IGludG8gdGhlIGJpbmFyeSB3cml0ZXIgdG8gb3ZlcndyaXRlIGJpbmFyeSBkYXRhXHJcbiAgICAgKiBAcGFyYW0gdmVydGV4QXR0cmlidXRlS2luZCBUaGUgdmVydGV4IGF0dHJpYnV0ZSB0eXBlXHJcbiAgICAgKiBAcGFyYW0gYmluYXJ5V3JpdGVyIFRoZSB3cml0ZXIgY29udGFpbmluZyB0aGUgYmluYXJ5IGRhdGFcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBfd3JpdGVWZXJ0ZXhBdHRyaWJ1dGVEYXRhKHZlcnRpY2VzOiBWZWN0b3IyW10gfCBWZWN0b3IzW10gfCBWZWN0b3I0W10sIGJ5dGVPZmZzZXQ6IG51bWJlciwgdmVydGV4QXR0cmlidXRlS2luZDogc3RyaW5nLCBiaW5hcnlXcml0ZXI6IF9CaW5hcnlXcml0ZXIpIHtcclxuICAgICAgICBmb3IgKGNvbnN0IHZlcnRleCBvZiB2ZXJ0aWNlcykge1xyXG4gICAgICAgICAgICBpZiAodmVydGV4QXR0cmlidXRlS2luZCA9PT0gVmVydGV4QnVmZmVyLk5vcm1hbEtpbmQpIHtcclxuICAgICAgICAgICAgICAgIHZlcnRleC5ub3JtYWxpemUoKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh2ZXJ0ZXhBdHRyaWJ1dGVLaW5kID09PSBWZXJ0ZXhCdWZmZXIuVGFuZ2VudEtpbmQgJiYgdmVydGV4IGluc3RhbmNlb2YgVmVjdG9yNCkge1xyXG4gICAgICAgICAgICAgICAgX0dMVEZVdGlsaXRpZXMuX05vcm1hbGl6ZVRhbmdlbnRGcm9tUmVmKHZlcnRleCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgY29tcG9uZW50IG9mIHZlcnRleC5hc0FycmF5KCkpIHtcclxuICAgICAgICAgICAgICAgIGJpbmFyeVdyaXRlci5zZXRGbG9hdDMyKGNvbXBvbmVudCwgYnl0ZU9mZnNldCk7XHJcbiAgICAgICAgICAgICAgICBieXRlT2Zmc2V0ICs9IDQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBXcml0ZXMgbWVzaCBhdHRyaWJ1dGUgZGF0YSB0byBhIGRhdGEgYnVmZmVyXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBieXRlbGVuZ3RoIG9mIHRoZSBkYXRhXHJcbiAgICAgKiBAcGFyYW0gdmVydGV4QnVmZmVyS2luZCBJbmRpY2F0ZXMgd2hhdCBraW5kIG9mIHZlcnRleCBkYXRhIGlzIGJlaW5nIHBhc3NlZCBpblxyXG4gICAgICogQHBhcmFtIGF0dHJpYnV0ZUNvbXBvbmVudEtpbmRcclxuICAgICAqIEBwYXJhbSBtZXNoQXR0cmlidXRlQXJyYXkgQXJyYXkgY29udGFpbmluZyB0aGUgYXR0cmlidXRlIGRhdGFcclxuICAgICAqIEBwYXJhbSBzdHJpZGUgU3BlY2lmaWVzIHRoZSBzcGFjZSBiZXR3ZWVuIGRhdGFcclxuICAgICAqIEBwYXJhbSBiaW5hcnlXcml0ZXIgVGhlIGJ1ZmZlciB0byB3cml0ZSB0aGUgYmluYXJ5IGRhdGEgdG9cclxuICAgICAqIEBwYXJhbSBiYWJ5bG9uVHJhbnNmb3JtTm9kZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgX3dyaXRlQXR0cmlidXRlRGF0YShcclxuICAgICAgICB2ZXJ0ZXhCdWZmZXJLaW5kOiBzdHJpbmcsXHJcbiAgICAgICAgYXR0cmlidXRlQ29tcG9uZW50S2luZDogQWNjZXNzb3JDb21wb25lbnRUeXBlLFxyXG4gICAgICAgIG1lc2hBdHRyaWJ1dGVBcnJheTogRmxvYXRBcnJheSxcclxuICAgICAgICBzdHJpZGU6IG51bWJlcixcclxuICAgICAgICBiaW5hcnlXcml0ZXI6IF9CaW5hcnlXcml0ZXIsXHJcbiAgICAgICAgYmFieWxvblRyYW5zZm9ybU5vZGU6IFRyYW5zZm9ybU5vZGVcclxuICAgICkge1xyXG4gICAgICAgIGxldCB2ZXJ0ZXhBdHRyaWJ1dGVzOiBudW1iZXJbXVtdID0gW107XHJcbiAgICAgICAgbGV0IGluZGV4OiBudW1iZXI7XHJcblxyXG4gICAgICAgIHN3aXRjaCAodmVydGV4QnVmZmVyS2luZCkge1xyXG4gICAgICAgICAgICBjYXNlIFZlcnRleEJ1ZmZlci5Qb3NpdGlvbktpbmQ6IHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSAwLCBsZW5ndGggPSBtZXNoQXR0cmlidXRlQXJyYXkubGVuZ3RoIC8gc3RyaWRlOyBrIDwgbGVuZ3RoOyArK2spIHtcclxuICAgICAgICAgICAgICAgICAgICBpbmRleCA9IGsgKiBzdHJpZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdmVydGV4RGF0YSA9IFZlY3RvcjMuRnJvbUFycmF5KG1lc2hBdHRyaWJ1dGVBcnJheSwgaW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZlcnRleEF0dHJpYnV0ZXMucHVzaCh2ZXJ0ZXhEYXRhLmFzQXJyYXkoKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIFZlcnRleEJ1ZmZlci5Ob3JtYWxLaW5kOiB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBrID0gMCwgbGVuZ3RoID0gbWVzaEF0dHJpYnV0ZUFycmF5Lmxlbmd0aCAvIHN0cmlkZTsgayA8IGxlbmd0aDsgKytrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5kZXggPSBrICogc3RyaWRlO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHZlcnRleERhdGEgPSBWZWN0b3IzLkZyb21BcnJheShtZXNoQXR0cmlidXRlQXJyYXksIGluZGV4KTtcclxuICAgICAgICAgICAgICAgICAgICB2ZXJ0ZXhBdHRyaWJ1dGVzLnB1c2godmVydGV4RGF0YS5ub3JtYWxpemUoKS5hc0FycmF5KCkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSBWZXJ0ZXhCdWZmZXIuVGFuZ2VudEtpbmQ6IHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSAwLCBsZW5ndGggPSBtZXNoQXR0cmlidXRlQXJyYXkubGVuZ3RoIC8gc3RyaWRlOyBrIDwgbGVuZ3RoOyArK2spIHtcclxuICAgICAgICAgICAgICAgICAgICBpbmRleCA9IGsgKiBzdHJpZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdmVydGV4RGF0YSA9IFZlY3RvcjQuRnJvbUFycmF5KG1lc2hBdHRyaWJ1dGVBcnJheSwgaW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgICAgIF9HTFRGVXRpbGl0aWVzLl9Ob3JtYWxpemVUYW5nZW50RnJvbVJlZih2ZXJ0ZXhEYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB2ZXJ0ZXhBdHRyaWJ1dGVzLnB1c2godmVydGV4RGF0YS5hc0FycmF5KCkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSBWZXJ0ZXhCdWZmZXIuQ29sb3JLaW5kOiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBtZXNoTWF0ZXJpYWwgPSAoYmFieWxvblRyYW5zZm9ybU5vZGUgYXMgTWVzaCkubWF0ZXJpYWw7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb252ZXJ0VG9MaW5lYXIgPSBtZXNoTWF0ZXJpYWwgPyBtZXNoTWF0ZXJpYWwuZ2V0Q2xhc3NOYW1lKCkgPT09IFwiU3RhbmRhcmRNYXRlcmlhbFwiIDogdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHZlcnRleERhdGE6IENvbG9yMyB8IENvbG9yNCA9IHN0cmlkZSA9PT0gMyA/IG5ldyBDb2xvcjMoKSA6IG5ldyBDb2xvcjQoKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHVzZUV4YWN0U3JnYkNvbnZlcnNpb25zID0gdGhpcy5fYmFieWxvblNjZW5lLmdldEVuZ2luZSgpLnVzZUV4YWN0U3JnYkNvbnZlcnNpb25zO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgayA9IDAsIGxlbmd0aCA9IG1lc2hBdHRyaWJ1dGVBcnJheS5sZW5ndGggLyBzdHJpZGU7IGsgPCBsZW5ndGg7ICsraykge1xyXG4gICAgICAgICAgICAgICAgICAgIGluZGV4ID0gayAqIHN0cmlkZTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc3RyaWRlID09PSAzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIENvbG9yMy5Gcm9tQXJyYXlUb1JlZihtZXNoQXR0cmlidXRlQXJyYXksIGluZGV4LCB2ZXJ0ZXhEYXRhIGFzIENvbG9yMyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb252ZXJ0VG9MaW5lYXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2ZXJ0ZXhEYXRhIGFzIENvbG9yMykudG9MaW5lYXJTcGFjZVRvUmVmKHZlcnRleERhdGEgYXMgQ29sb3IzLCB1c2VFeGFjdFNyZ2JDb252ZXJzaW9ucyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBDb2xvcjQuRnJvbUFycmF5VG9SZWYobWVzaEF0dHJpYnV0ZUFycmF5LCBpbmRleCwgdmVydGV4RGF0YSBhcyBDb2xvcjQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29udmVydFRvTGluZWFyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAodmVydGV4RGF0YSBhcyBDb2xvcjQpLnRvTGluZWFyU3BhY2VUb1JlZih2ZXJ0ZXhEYXRhIGFzIENvbG9yNCwgdXNlRXhhY3RTcmdiQ29udmVyc2lvbnMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHZlcnRleEF0dHJpYnV0ZXMucHVzaCh2ZXJ0ZXhEYXRhLmFzQXJyYXkoKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIFZlcnRleEJ1ZmZlci5VVktpbmQ6XHJcbiAgICAgICAgICAgIGNhc2UgVmVydGV4QnVmZmVyLlVWMktpbmQ6IHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSAwLCBsZW5ndGggPSBtZXNoQXR0cmlidXRlQXJyYXkubGVuZ3RoIC8gc3RyaWRlOyBrIDwgbGVuZ3RoOyArK2spIHtcclxuICAgICAgICAgICAgICAgICAgICBpbmRleCA9IGsgKiBzdHJpZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdmVydGV4RGF0YSA9IFZlY3RvcjIuRnJvbUFycmF5KG1lc2hBdHRyaWJ1dGVBcnJheSwgaW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZlcnRleEF0dHJpYnV0ZXMucHVzaCh2ZXJ0ZXhEYXRhLmFzQXJyYXkoKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIFZlcnRleEJ1ZmZlci5NYXRyaWNlc0luZGljZXNLaW5kOlxyXG4gICAgICAgICAgICBjYXNlIFZlcnRleEJ1ZmZlci5NYXRyaWNlc0luZGljZXNFeHRyYUtpbmQ6IHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSAwLCBsZW5ndGggPSBtZXNoQXR0cmlidXRlQXJyYXkubGVuZ3RoIC8gc3RyaWRlOyBrIDwgbGVuZ3RoOyArK2spIHtcclxuICAgICAgICAgICAgICAgICAgICBpbmRleCA9IGsgKiBzdHJpZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdmVydGV4RGF0YSA9IFZlY3RvcjQuRnJvbUFycmF5KG1lc2hBdHRyaWJ1dGVBcnJheSwgaW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZlcnRleEF0dHJpYnV0ZXMucHVzaCh2ZXJ0ZXhEYXRhLmFzQXJyYXkoKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIFZlcnRleEJ1ZmZlci5NYXRyaWNlc1dlaWdodHNLaW5kOlxyXG4gICAgICAgICAgICBjYXNlIFZlcnRleEJ1ZmZlci5NYXRyaWNlc1dlaWdodHNFeHRyYUtpbmQ6IHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSAwLCBsZW5ndGggPSBtZXNoQXR0cmlidXRlQXJyYXkubGVuZ3RoIC8gc3RyaWRlOyBrIDwgbGVuZ3RoOyArK2spIHtcclxuICAgICAgICAgICAgICAgICAgICBpbmRleCA9IGsgKiBzdHJpZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdmVydGV4RGF0YSA9IFZlY3RvcjQuRnJvbUFycmF5KG1lc2hBdHRyaWJ1dGVBcnJheSwgaW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZlcnRleEF0dHJpYnV0ZXMucHVzaCh2ZXJ0ZXhEYXRhLmFzQXJyYXkoKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBkZWZhdWx0OiB7XHJcbiAgICAgICAgICAgICAgICBUb29scy5XYXJuKFwiVW5zdXBwb3J0ZWQgVmVydGV4IEJ1ZmZlciBUeXBlOiBcIiArIHZlcnRleEJ1ZmZlcktpbmQpO1xyXG4gICAgICAgICAgICAgICAgdmVydGV4QXR0cmlidXRlcyA9IFtdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCB3cml0ZUJpbmFyeUZ1bmMgPSBnZXRCaW5hcnlXcml0ZXJGdW5jKGJpbmFyeVdyaXRlciwgYXR0cmlidXRlQ29tcG9uZW50S2luZCk7XHJcblxyXG4gICAgICAgIGlmICh3cml0ZUJpbmFyeUZ1bmMpIHtcclxuICAgICAgICAgICAgZm9yIChjb25zdCB2ZXJ0ZXhBdHRyaWJ1dGUgb2YgdmVydGV4QXR0cmlidXRlcykge1xyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBjb21wb25lbnQgb2YgdmVydGV4QXR0cmlidXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd3JpdGVCaW5hcnlGdW5jKGNvbXBvbmVudCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfY3JlYXRlTW9ycGhUYXJnZXRCdWZmZXJWaWV3S2luZChcclxuICAgICAgICB2ZXJ0ZXhCdWZmZXJLaW5kOiBzdHJpbmcsXHJcbiAgICAgICAgYWNjZXNzb3JUeXBlOiBBY2Nlc3NvclR5cGUsXHJcbiAgICAgICAgYXR0cmlidXRlQ29tcG9uZW50S2luZDogQWNjZXNzb3JDb21wb25lbnRUeXBlLFxyXG4gICAgICAgIG1lc2g6IE1lc2gsXHJcbiAgICAgICAgbW9ycGhUYXJnZXQ6IE1vcnBoVGFyZ2V0LFxyXG4gICAgICAgIGJpbmFyeVdyaXRlcjogX0JpbmFyeVdyaXRlcixcclxuICAgICAgICBieXRlU3RyaWRlOiBudW1iZXJcclxuICAgICk6IE51bGxhYmxlPHsgYnVmZmVyVmlld0luZGV4OiBudW1iZXI7IHZlcnRleENvdW50OiBudW1iZXI7IGFjY2Vzc29yVHlwZTogQWNjZXNzb3JUeXBlOyBtaW5NYXg/OiB7IG1pbjogVmVjdG9yMzsgbWF4OiBWZWN0b3IzIH0gfT4ge1xyXG4gICAgICAgIGxldCB2ZXJ0ZXhDb3VudDogbnVtYmVyO1xyXG4gICAgICAgIGxldCBtaW5NYXg6IHsgbWluOiBWZWN0b3IzOyBtYXg6IFZlY3RvcjMgfSB8IHVuZGVmaW5lZDtcclxuICAgICAgICBjb25zdCBtb3JwaERhdGE6IG51bWJlcltdID0gW107XHJcbiAgICAgICAgY29uc3QgZGlmZmVyZW5jZTogVmVjdG9yMyA9IFRtcFZlY3RvcnMuVmVjdG9yM1swXTtcclxuXHJcbiAgICAgICAgc3dpdGNoICh2ZXJ0ZXhCdWZmZXJLaW5kKSB7XHJcbiAgICAgICAgICAgIGNhc2UgVmVydGV4QnVmZmVyLlBvc2l0aW9uS2luZDoge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbW9ycGhQb3NpdGlvbnMgPSBtb3JwaFRhcmdldC5nZXRQb3NpdGlvbnMoKTtcclxuICAgICAgICAgICAgICAgIGlmICghbW9ycGhQb3NpdGlvbnMpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBvcmlnaW5hbFBvc2l0aW9ucyA9IG1lc2guZ2V0VmVydGljZXNEYXRhKFZlcnRleEJ1ZmZlci5Qb3NpdGlvbktpbmQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB0cnVlKSE7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB2ZXJ0ZXhTdGFydCA9IDA7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBtaW4gPSBuZXcgVmVjdG9yMyhJbmZpbml0eSwgSW5maW5pdHksIEluZmluaXR5KTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG1heCA9IG5ldyBWZWN0b3IzKC1JbmZpbml0eSwgLUluZmluaXR5LCAtSW5maW5pdHkpO1xyXG4gICAgICAgICAgICAgICAgdmVydGV4Q291bnQgPSBvcmlnaW5hbFBvc2l0aW9ucy5sZW5ndGggLyAzO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IHZlcnRleFN0YXJ0OyBpIDwgdmVydGV4Q291bnQ7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG9yaWdpbmFsUG9zaXRpb24gPSBWZWN0b3IzLkZyb21BcnJheShvcmlnaW5hbFBvc2l0aW9ucywgaSAqIDMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG1vcnBoUG9zaXRpb24gPSBWZWN0b3IzLkZyb21BcnJheShtb3JwaFBvc2l0aW9ucywgaSAqIDMpO1xyXG4gICAgICAgICAgICAgICAgICAgIG1vcnBoUG9zaXRpb24uc3VidHJhY3RUb1JlZihvcmlnaW5hbFBvc2l0aW9uLCBkaWZmZXJlbmNlKTtcclxuICAgICAgICAgICAgICAgICAgICBtaW4uY29weUZyb21GbG9hdHMoTWF0aC5taW4oZGlmZmVyZW5jZS54LCBtaW4ueCksIE1hdGgubWluKGRpZmZlcmVuY2UueSwgbWluLnkpLCBNYXRoLm1pbihkaWZmZXJlbmNlLnosIG1pbi56KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgbWF4LmNvcHlGcm9tRmxvYXRzKE1hdGgubWF4KGRpZmZlcmVuY2UueCwgbWF4LngpLCBNYXRoLm1heChkaWZmZXJlbmNlLnksIG1heC55KSwgTWF0aC5tYXgoZGlmZmVyZW5jZS56LCBtYXgueikpO1xyXG4gICAgICAgICAgICAgICAgICAgIG1vcnBoRGF0YS5wdXNoKGRpZmZlcmVuY2UueCwgZGlmZmVyZW5jZS55LCBkaWZmZXJlbmNlLnopO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIG1pbk1heCA9IHsgbWluLCBtYXggfTtcclxuXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIFZlcnRleEJ1ZmZlci5Ob3JtYWxLaW5kOiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBtb3JwaE5vcm1hbHMgPSBtb3JwaFRhcmdldC5nZXROb3JtYWxzKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIW1vcnBoTm9ybWFscykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IG9yaWdpbmFsTm9ybWFscyA9IG1lc2guZ2V0VmVydGljZXNEYXRhKFZlcnRleEJ1ZmZlci5Ob3JtYWxLaW5kLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdHJ1ZSkhO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdmVydGV4U3RhcnQgPSAwO1xyXG4gICAgICAgICAgICAgICAgdmVydGV4Q291bnQgPSBvcmlnaW5hbE5vcm1hbHMubGVuZ3RoIC8gMztcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSB2ZXJ0ZXhTdGFydDsgaSA8IHZlcnRleENvdW50OyArK2kpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBvcmlnaW5hbE5vcm1hbCA9IFZlY3RvcjMuRnJvbUFycmF5KG9yaWdpbmFsTm9ybWFscywgaSAqIDMpLm5vcm1hbGl6ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG1vcnBoTm9ybWFsID0gVmVjdG9yMy5Gcm9tQXJyYXkobW9ycGhOb3JtYWxzLCBpICogMykubm9ybWFsaXplKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbW9ycGhOb3JtYWwuc3VidHJhY3RUb1JlZihvcmlnaW5hbE5vcm1hbCwgZGlmZmVyZW5jZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgbW9ycGhEYXRhLnB1c2goZGlmZmVyZW5jZS54LCBkaWZmZXJlbmNlLnksIGRpZmZlcmVuY2Uueik7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSBWZXJ0ZXhCdWZmZXIuVGFuZ2VudEtpbmQ6IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG1vcnBoVGFuZ2VudHMgPSBtb3JwaFRhcmdldC5nZXRUYW5nZW50cygpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFtb3JwaFRhbmdlbnRzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gSGFuZGVkbmVzcyBjYW5ub3QgYmUgZGlzcGxhY2VkLCBzbyBtb3JwaCB0YXJnZXQgdGFuZ2VudHMgb21pdCB0aGUgdyBjb21wb25lbnRcclxuICAgICAgICAgICAgICAgIGFjY2Vzc29yVHlwZSA9IEFjY2Vzc29yVHlwZS5WRUMzO1xyXG4gICAgICAgICAgICAgICAgYnl0ZVN0cmlkZSA9IDEyOyAvLyAzIGNvbXBvbmVudHMgKHgveS96KSAqIDQgYnl0ZXMgKGZsb2F0MzIpXHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3Qgb3JpZ2luYWxUYW5nZW50cyA9IG1lc2guZ2V0VmVydGljZXNEYXRhKFZlcnRleEJ1ZmZlci5UYW5nZW50S2luZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHRydWUpITtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHZlcnRleFN0YXJ0ID0gMDtcclxuICAgICAgICAgICAgICAgIHZlcnRleENvdW50ID0gb3JpZ2luYWxUYW5nZW50cy5sZW5ndGggLyA0O1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IHZlcnRleFN0YXJ0OyBpIDwgdmVydGV4Q291bnQ7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIE9ubHkgcmVhZCB0aGUgeCwgeSwgeiBjb21wb25lbnRzIGFuZCBpZ25vcmUgd1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG9yaWdpbmFsVGFuZ2VudCA9IFZlY3RvcjMuRnJvbUFycmF5KG9yaWdpbmFsVGFuZ2VudHMsIGkgKiA0KTtcclxuICAgICAgICAgICAgICAgICAgICBfR0xURlV0aWxpdGllcy5fTm9ybWFsaXplVGFuZ2VudEZyb21SZWYob3JpZ2luYWxUYW5nZW50KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gTW9ycGggdGFyZ2V0IHRhbmdlbnRzIG9taXQgdGhlIHcgY29tcG9uZW50IHNvIGl0IHdvbid0IGJlIHByZXNlbnQgaW4gdGhlIGRhdGFcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBtb3JwaFRhbmdlbnQgPSBWZWN0b3IzLkZyb21BcnJheShtb3JwaFRhbmdlbnRzLCBpICogMyk7XHJcbiAgICAgICAgICAgICAgICAgICAgX0dMVEZVdGlsaXRpZXMuX05vcm1hbGl6ZVRhbmdlbnRGcm9tUmVmKG1vcnBoVGFuZ2VudCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG1vcnBoVGFuZ2VudC5zdWJ0cmFjdFRvUmVmKG9yaWdpbmFsVGFuZ2VudCwgZGlmZmVyZW5jZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgbW9ycGhEYXRhLnB1c2goZGlmZmVyZW5jZS54LCBkaWZmZXJlbmNlLnksIGRpZmZlcmVuY2Uueik7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZGVmYXVsdDoge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGJpbmFyeVdyaXRlckZ1bmMgPSBnZXRCaW5hcnlXcml0ZXJGdW5jKGJpbmFyeVdyaXRlciwgYXR0cmlidXRlQ29tcG9uZW50S2luZCk7XHJcbiAgICAgICAgaWYgKCFiaW5hcnlXcml0ZXJGdW5jKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgdHlwZUJ5dGVMZW5ndGggPSBWZXJ0ZXhCdWZmZXIuR2V0VHlwZUJ5dGVMZW5ndGgoYXR0cmlidXRlQ29tcG9uZW50S2luZCk7XHJcbiAgICAgICAgY29uc3QgYnl0ZUxlbmd0aCA9IG1vcnBoRGF0YS5sZW5ndGggKiB0eXBlQnl0ZUxlbmd0aDtcclxuICAgICAgICBjb25zdCBidWZmZXJWaWV3ID0gX0dMVEZVdGlsaXRpZXMuX0NyZWF0ZUJ1ZmZlclZpZXcoMCwgYmluYXJ5V3JpdGVyLmdldEJ5dGVPZmZzZXQoKSwgYnl0ZUxlbmd0aCwgYnl0ZVN0cmlkZSwgYCR7dmVydGV4QnVmZmVyS2luZH0gLSAke21vcnBoVGFyZ2V0Lm5hbWV9IChNb3JwaCBUYXJnZXQpYCk7XHJcbiAgICAgICAgdGhpcy5fYnVmZmVyVmlld3MucHVzaChidWZmZXJWaWV3KTtcclxuICAgICAgICBjb25zdCBidWZmZXJWaWV3SW5kZXggPSB0aGlzLl9idWZmZXJWaWV3cy5sZW5ndGggLSAxO1xyXG5cclxuICAgICAgICBmb3IgKGNvbnN0IHZhbHVlIG9mIG1vcnBoRGF0YSkge1xyXG4gICAgICAgICAgICBiaW5hcnlXcml0ZXJGdW5jKHZhbHVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB7IGJ1ZmZlclZpZXdJbmRleCwgdmVydGV4Q291bnQsIGFjY2Vzc29yVHlwZSwgbWluTWF4IH07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZW5lcmF0ZXMgZ2xURiBqc29uIGRhdGFcclxuICAgICAqIEBwYXJhbSBzaG91bGRVc2VHbGIgSW5kaWNhdGVzIHdoZXRoZXIgdGhlIGpzb24gc2hvdWxkIGJlIHdyaXR0ZW4gZm9yIGEgZ2xiIGZpbGVcclxuICAgICAqIEBwYXJhbSBnbFRGUHJlZml4IFRleHQgdG8gdXNlIHdoZW4gcHJlZml4aW5nIGEgZ2xURiBmaWxlXHJcbiAgICAgKiBAcGFyYW0gcHJldHR5UHJpbnQgSW5kaWNhdGVzIHdoZXRoZXIgdGhlIGpzb24gZmlsZSBzaG91bGQgYmUgcHJldHR5IHByaW50ZWQgKHRydWUpIG9yIG5vdCAoZmFsc2UpXHJcbiAgICAgKiBAcmV0dXJucyBqc29uIGRhdGEgYXMgc3RyaW5nXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgX2dlbmVyYXRlSlNPTihzaG91bGRVc2VHbGI6IGJvb2xlYW4sIGdsVEZQcmVmaXg/OiBzdHJpbmcsIHByZXR0eVByaW50PzogYm9vbGVhbik6IHN0cmluZyB7XHJcbiAgICAgICAgY29uc3QgYnVmZmVyOiBJQnVmZmVyID0geyBieXRlTGVuZ3RoOiB0aGlzLl90b3RhbEJ5dGVMZW5ndGggfTtcclxuICAgICAgICBsZXQgaW1hZ2VOYW1lOiBzdHJpbmc7XHJcbiAgICAgICAgbGV0IGltYWdlRGF0YTogeyBkYXRhOiBBcnJheUJ1ZmZlcjsgbWltZVR5cGU6IEltYWdlTWltZVR5cGUgfTtcclxuICAgICAgICBsZXQgYnVmZmVyVmlldzogSUJ1ZmZlclZpZXc7XHJcbiAgICAgICAgbGV0IGJ5dGVPZmZzZXQ6IG51bWJlciA9IHRoaXMuX3RvdGFsQnl0ZUxlbmd0aDtcclxuXHJcbiAgICAgICAgaWYgKGJ1ZmZlci5ieXRlTGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2dsVEYuYnVmZmVycyA9IFtidWZmZXJdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5fbm9kZXMgJiYgdGhpcy5fbm9kZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2dsVEYubm9kZXMgPSB0aGlzLl9ub2RlcztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuX21lc2hlcyAmJiB0aGlzLl9tZXNoZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2dsVEYubWVzaGVzID0gdGhpcy5fbWVzaGVzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5fc2NlbmVzICYmIHRoaXMuX3NjZW5lcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgdGhpcy5fZ2xURi5zY2VuZXMgPSB0aGlzLl9zY2VuZXM7XHJcbiAgICAgICAgICAgIHRoaXMuX2dsVEYuc2NlbmUgPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5fY2FtZXJhcyAmJiB0aGlzLl9jYW1lcmFzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICB0aGlzLl9nbFRGLmNhbWVyYXMgPSB0aGlzLl9jYW1lcmFzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5fYnVmZmVyVmlld3MgJiYgdGhpcy5fYnVmZmVyVmlld3MubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2dsVEYuYnVmZmVyVmlld3MgPSB0aGlzLl9idWZmZXJWaWV3cztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuX2FjY2Vzc29ycyAmJiB0aGlzLl9hY2Nlc3NvcnMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2dsVEYuYWNjZXNzb3JzID0gdGhpcy5fYWNjZXNzb3JzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5fYW5pbWF0aW9ucyAmJiB0aGlzLl9hbmltYXRpb25zLmxlbmd0aCkge1xyXG4gICAgICAgICAgICB0aGlzLl9nbFRGLmFuaW1hdGlvbnMgPSB0aGlzLl9hbmltYXRpb25zO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5fbWF0ZXJpYWxzICYmIHRoaXMuX21hdGVyaWFscy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgdGhpcy5fZ2xURi5tYXRlcmlhbHMgPSB0aGlzLl9tYXRlcmlhbHM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLl90ZXh0dXJlcyAmJiB0aGlzLl90ZXh0dXJlcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgdGhpcy5fZ2xURi50ZXh0dXJlcyA9IHRoaXMuX3RleHR1cmVzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5fc2FtcGxlcnMgJiYgdGhpcy5fc2FtcGxlcnMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2dsVEYuc2FtcGxlcnMgPSB0aGlzLl9zYW1wbGVycztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuX3NraW5zICYmIHRoaXMuX3NraW5zLmxlbmd0aCkge1xyXG4gICAgICAgICAgICB0aGlzLl9nbFRGLnNraW5zID0gdGhpcy5fc2tpbnM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLl9pbWFnZXMgJiYgdGhpcy5faW1hZ2VzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBpZiAoIXNob3VsZFVzZUdsYikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZ2xURi5pbWFnZXMgPSB0aGlzLl9pbWFnZXM7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9nbFRGLmltYWdlcyA9IFtdO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuX2ltYWdlcy5mb3JFYWNoKChpbWFnZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpbWFnZS51cmkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW1hZ2VEYXRhID0gdGhpcy5faW1hZ2VEYXRhW2ltYWdlLnVyaV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX29yZGVyZWRJbWFnZURhdGEucHVzaChpbWFnZURhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbWFnZU5hbWUgPSBpbWFnZS51cmkuc3BsaXQoXCIuXCIpWzBdICsgXCIgaW1hZ2VcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnVmZmVyVmlldyA9IF9HTFRGVXRpbGl0aWVzLl9DcmVhdGVCdWZmZXJWaWV3KDAsIGJ5dGVPZmZzZXQsIGltYWdlRGF0YS5kYXRhLmJ5dGVMZW5ndGgsIHVuZGVmaW5lZCwgaW1hZ2VOYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnl0ZU9mZnNldCArPSBpbWFnZURhdGEuZGF0YS5ieXRlTGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9idWZmZXJWaWV3cy5wdXNoKGJ1ZmZlclZpZXcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbWFnZS5idWZmZXJWaWV3ID0gdGhpcy5fYnVmZmVyVmlld3MubGVuZ3RoIC0gMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW1hZ2UubmFtZSA9IGltYWdlTmFtZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW1hZ2UubWltZVR5cGUgPSBpbWFnZURhdGEubWltZVR5cGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlLnVyaSA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLl9nbFRGLmltYWdlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZ2xURi5pbWFnZXMgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9nbFRGLmltYWdlcy5wdXNoKGltYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIC8vIFJlcGxhY2UgdXJpIHdpdGggYnVmZmVydmlldyBhbmQgbWltZSB0eXBlIGZvciBnbGJcclxuICAgICAgICAgICAgICAgIGJ1ZmZlci5ieXRlTGVuZ3RoID0gYnl0ZU9mZnNldDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFzaG91bGRVc2VHbGIpIHtcclxuICAgICAgICAgICAgYnVmZmVyLnVyaSA9IGdsVEZQcmVmaXggKyBcIi5iaW5cIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGpzb25UZXh0ID0gcHJldHR5UHJpbnQgPyBKU09OLnN0cmluZ2lmeSh0aGlzLl9nbFRGLCBudWxsLCAyKSA6IEpTT04uc3RyaW5naWZ5KHRoaXMuX2dsVEYpO1xyXG5cclxuICAgICAgICByZXR1cm4ganNvblRleHQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZW5lcmF0ZXMgZGF0YSBmb3IgLmdsdGYgYW5kIC5iaW4gZmlsZXMgYmFzZWQgb24gdGhlIGdsVEYgcHJlZml4IHN0cmluZ1xyXG4gICAgICogQHBhcmFtIGdsVEZQcmVmaXggVGV4dCB0byB1c2Ugd2hlbiBwcmVmaXhpbmcgYSBnbFRGIGZpbGVcclxuICAgICAqIEBwYXJhbSBkaXNwb3NlIERpc3Bvc2UgdGhlIGV4cG9ydGVyXHJcbiAgICAgKiBAcmV0dXJucyBHTFRGRGF0YSB3aXRoIGdsVEYgZmlsZSBkYXRhXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBfZ2VuZXJhdGVHTFRGQXN5bmMoZ2xURlByZWZpeDogc3RyaW5nLCBkaXNwb3NlID0gdHJ1ZSk6IFByb21pc2U8R0xURkRhdGE+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZ2VuZXJhdGVCaW5hcnlBc3luYygpLnRoZW4oKGJpbmFyeUJ1ZmZlcikgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9leHRlbnNpb25zT25FeHBvcnRpbmcoKTtcclxuICAgICAgICAgICAgY29uc3QganNvblRleHQgPSB0aGlzLl9nZW5lcmF0ZUpTT04oZmFsc2UsIGdsVEZQcmVmaXgsIHRydWUpO1xyXG4gICAgICAgICAgICBjb25zdCBiaW4gPSBuZXcgQmxvYihbYmluYXJ5QnVmZmVyXSwgeyB0eXBlOiBcImFwcGxpY2F0aW9uL29jdGV0LXN0cmVhbVwiIH0pO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgZ2xURkZpbGVOYW1lID0gZ2xURlByZWZpeCArIFwiLmdsdGZcIjtcclxuICAgICAgICAgICAgY29uc3QgZ2xURkJpbkZpbGUgPSBnbFRGUHJlZml4ICsgXCIuYmluXCI7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBjb250YWluZXIgPSBuZXcgR0xURkRhdGEoKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnRhaW5lci5nbFRGRmlsZXNbZ2xURkZpbGVOYW1lXSA9IGpzb25UZXh0O1xyXG4gICAgICAgICAgICBjb250YWluZXIuZ2xURkZpbGVzW2dsVEZCaW5GaWxlXSA9IGJpbjtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9pbWFnZURhdGEpIHtcclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgaW1hZ2UgaW4gdGhpcy5faW1hZ2VEYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyLmdsVEZGaWxlc1tpbWFnZV0gPSBuZXcgQmxvYihbdGhpcy5faW1hZ2VEYXRhW2ltYWdlXS5kYXRhXSwgeyB0eXBlOiB0aGlzLl9pbWFnZURhdGFbaW1hZ2VdLm1pbWVUeXBlIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZGlzcG9zZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kaXNwb3NlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBjb250YWluZXI7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIGEgYmluYXJ5IGJ1ZmZlciBmb3IgZ2xURlxyXG4gICAgICogQHJldHVybnMgYXJyYXkgYnVmZmVyIGZvciBiaW5hcnkgZGF0YVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIF9nZW5lcmF0ZUJpbmFyeUFzeW5jKCk6IFByb21pc2U8QXJyYXlCdWZmZXI+IHtcclxuICAgICAgICBjb25zdCBiaW5hcnlXcml0ZXIgPSBuZXcgX0JpbmFyeVdyaXRlcig0KTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY3JlYXRlU2NlbmVBc3luYyhiaW5hcnlXcml0ZXIpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fbG9jYWxFbmdpbmUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2xvY2FsRW5naW5lLmRpc3Bvc2UoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gYmluYXJ5V3JpdGVyLmdldEFycmF5QnVmZmVyKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQYWRzIHRoZSBudW1iZXIgdG8gYSBtdWx0aXBsZSBvZiA0XHJcbiAgICAgKiBAcGFyYW0gbnVtIG51bWJlciB0byBwYWRcclxuICAgICAqIEByZXR1cm5zIHBhZGRlZCBudW1iZXJcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBfZ2V0UGFkZGluZyhudW06IG51bWJlcik6IG51bWJlciB7XHJcbiAgICAgICAgY29uc3QgcmVtYWluZGVyID0gbnVtICUgNDtcclxuICAgICAgICBjb25zdCBwYWRkaW5nID0gcmVtYWluZGVyID09PSAwID8gcmVtYWluZGVyIDogNCAtIHJlbWFpbmRlcjtcclxuXHJcbiAgICAgICAgcmV0dXJuIHBhZGRpbmc7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJuYWxcclxuICAgICAqL1xyXG4gICAgcHVibGljIF9nZW5lcmF0ZUdMQkFzeW5jKGdsVEZQcmVmaXg6IHN0cmluZywgZGlzcG9zZSA9IHRydWUpOiBQcm9taXNlPEdMVEZEYXRhPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dlbmVyYXRlQmluYXJ5QXN5bmMoKS50aGVuKChiaW5hcnlCdWZmZXIpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fZXh0ZW5zaW9uc09uRXhwb3J0aW5nKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGpzb25UZXh0ID0gdGhpcy5fZ2VuZXJhdGVKU09OKHRydWUpO1xyXG4gICAgICAgICAgICBjb25zdCBnbGJGaWxlTmFtZSA9IGdsVEZQcmVmaXggKyBcIi5nbGJcIjtcclxuICAgICAgICAgICAgY29uc3QgaGVhZGVyTGVuZ3RoID0gMTI7XHJcbiAgICAgICAgICAgIGNvbnN0IGNodW5rTGVuZ3RoUHJlZml4ID0gODtcclxuICAgICAgICAgICAgbGV0IGpzb25MZW5ndGggPSBqc29uVGV4dC5sZW5ndGg7XHJcbiAgICAgICAgICAgIGxldCBlbmNvZGVkSnNvblRleHQ7XHJcbiAgICAgICAgICAgIGxldCBpbWFnZUJ5dGVMZW5ndGggPSAwO1xyXG4gICAgICAgICAgICAvLyBtYWtlIHVzZSBvZiBUZXh0RW5jb2RlciB3aGVuIGF2YWlsYWJsZVxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIFRleHRFbmNvZGVyICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBlbmNvZGVyID0gbmV3IFRleHRFbmNvZGVyKCk7XHJcbiAgICAgICAgICAgICAgICBlbmNvZGVkSnNvblRleHQgPSBlbmNvZGVyLmVuY29kZShqc29uVGV4dCk7XHJcbiAgICAgICAgICAgICAgICBqc29uTGVuZ3RoID0gZW5jb2RlZEpzb25UZXh0Lmxlbmd0aDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX29yZGVyZWRJbWFnZURhdGEubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgICAgIGltYWdlQnl0ZUxlbmd0aCArPSB0aGlzLl9vcmRlcmVkSW1hZ2VEYXRhW2ldLmRhdGEuYnl0ZUxlbmd0aDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBqc29uUGFkZGluZyA9IHRoaXMuX2dldFBhZGRpbmcoanNvbkxlbmd0aCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGJpblBhZGRpbmcgPSB0aGlzLl9nZXRQYWRkaW5nKGJpbmFyeUJ1ZmZlci5ieXRlTGVuZ3RoKTtcclxuICAgICAgICAgICAgY29uc3QgaW1hZ2VQYWRkaW5nID0gdGhpcy5fZ2V0UGFkZGluZyhpbWFnZUJ5dGVMZW5ndGgpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgYnl0ZUxlbmd0aCA9IGhlYWRlckxlbmd0aCArIDIgKiBjaHVua0xlbmd0aFByZWZpeCArIGpzb25MZW5ndGggKyBqc29uUGFkZGluZyArIGJpbmFyeUJ1ZmZlci5ieXRlTGVuZ3RoICsgYmluUGFkZGluZyArIGltYWdlQnl0ZUxlbmd0aCArIGltYWdlUGFkZGluZztcclxuXHJcbiAgICAgICAgICAgIC8vaGVhZGVyXHJcbiAgICAgICAgICAgIGNvbnN0IGhlYWRlckJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcihoZWFkZXJMZW5ndGgpO1xyXG4gICAgICAgICAgICBjb25zdCBoZWFkZXJCdWZmZXJWaWV3ID0gbmV3IERhdGFWaWV3KGhlYWRlckJ1ZmZlcik7XHJcbiAgICAgICAgICAgIGhlYWRlckJ1ZmZlclZpZXcuc2V0VWludDMyKDAsIDB4NDY1NDZjNjcsIHRydWUpOyAvL2dsVEZcclxuICAgICAgICAgICAgaGVhZGVyQnVmZmVyVmlldy5zZXRVaW50MzIoNCwgMiwgdHJ1ZSk7IC8vIHZlcnNpb25cclxuICAgICAgICAgICAgaGVhZGVyQnVmZmVyVmlldy5zZXRVaW50MzIoOCwgYnl0ZUxlbmd0aCwgdHJ1ZSk7IC8vIHRvdGFsIGJ5dGVzIGluIGZpbGVcclxuXHJcbiAgICAgICAgICAgIC8vanNvbiBjaHVua1xyXG4gICAgICAgICAgICBjb25zdCBqc29uQ2h1bmtCdWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoY2h1bmtMZW5ndGhQcmVmaXggKyBqc29uTGVuZ3RoICsganNvblBhZGRpbmcpO1xyXG4gICAgICAgICAgICBjb25zdCBqc29uQ2h1bmtCdWZmZXJWaWV3ID0gbmV3IERhdGFWaWV3KGpzb25DaHVua0J1ZmZlcik7XHJcbiAgICAgICAgICAgIGpzb25DaHVua0J1ZmZlclZpZXcuc2V0VWludDMyKDAsIGpzb25MZW5ndGggKyBqc29uUGFkZGluZywgdHJ1ZSk7XHJcbiAgICAgICAgICAgIGpzb25DaHVua0J1ZmZlclZpZXcuc2V0VWludDMyKDQsIDB4NGU0ZjUzNGEsIHRydWUpO1xyXG5cclxuICAgICAgICAgICAgLy9qc29uIGNodW5rIGJ5dGVzXHJcbiAgICAgICAgICAgIGNvbnN0IGpzb25EYXRhID0gbmV3IFVpbnQ4QXJyYXkoanNvbkNodW5rQnVmZmVyLCBjaHVua0xlbmd0aFByZWZpeCk7XHJcbiAgICAgICAgICAgIC8vIGlmIFRleHRFbmNvZGVyIHdhcyBhdmFpbGFibGUsIHdlIGNhbiBzaW1wbHkgY29weSB0aGUgZW5jb2RlZCBhcnJheVxyXG4gICAgICAgICAgICBpZiAoZW5jb2RlZEpzb25UZXh0KSB7XHJcbiAgICAgICAgICAgICAgICBqc29uRGF0YS5zZXQoZW5jb2RlZEpzb25UZXh0KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGJsYW5rQ2hhckNvZGUgPSBcIl9cIi5jaGFyQ29kZUF0KDApO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBqc29uTGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjaGFyQ29kZSA9IGpzb25UZXh0LmNoYXJDb2RlQXQoaSk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhlIGNoYXJhY3RlciBkb2Vzbid0IGZpdCBpbnRvIGEgc2luZ2xlIFVURi0xNiBjb2RlIHVuaXQsIGp1c3QgcHV0IGEgYmxhbmsgY2hhcmFjdGVyXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoYXJDb2RlICE9IGpzb25UZXh0LmNvZGVQb2ludEF0KGkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGpzb25EYXRhW2ldID0gYmxhbmtDaGFyQ29kZTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBqc29uRGF0YVtpXSA9IGNoYXJDb2RlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy9qc29uIHBhZGRpbmdcclxuICAgICAgICAgICAgY29uc3QganNvblBhZGRpbmdWaWV3ID0gbmV3IFVpbnQ4QXJyYXkoanNvbkNodW5rQnVmZmVyLCBjaHVua0xlbmd0aFByZWZpeCArIGpzb25MZW5ndGgpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGpzb25QYWRkaW5nOyArK2kpIHtcclxuICAgICAgICAgICAgICAgIGpzb25QYWRkaW5nVmlld1tpXSA9IDB4MjA7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vYmluYXJ5IGNodW5rXHJcbiAgICAgICAgICAgIGNvbnN0IGJpbmFyeUNodW5rQnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKGNodW5rTGVuZ3RoUHJlZml4KTtcclxuICAgICAgICAgICAgY29uc3QgYmluYXJ5Q2h1bmtCdWZmZXJWaWV3ID0gbmV3IERhdGFWaWV3KGJpbmFyeUNodW5rQnVmZmVyKTtcclxuICAgICAgICAgICAgYmluYXJ5Q2h1bmtCdWZmZXJWaWV3LnNldFVpbnQzMigwLCBiaW5hcnlCdWZmZXIuYnl0ZUxlbmd0aCArIGltYWdlQnl0ZUxlbmd0aCArIGltYWdlUGFkZGluZywgdHJ1ZSk7XHJcbiAgICAgICAgICAgIGJpbmFyeUNodW5rQnVmZmVyVmlldy5zZXRVaW50MzIoNCwgMHgwMDRlNDk0MiwgdHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICAvLyBiaW5hcnkgcGFkZGluZ1xyXG4gICAgICAgICAgICBjb25zdCBiaW5QYWRkaW5nQnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKGJpblBhZGRpbmcpO1xyXG4gICAgICAgICAgICBjb25zdCBiaW5QYWRkaW5nVmlldyA9IG5ldyBVaW50OEFycmF5KGJpblBhZGRpbmdCdWZmZXIpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJpblBhZGRpbmc7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgYmluUGFkZGluZ1ZpZXdbaV0gPSAwO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBpbWFnZVBhZGRpbmdCdWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoaW1hZ2VQYWRkaW5nKTtcclxuICAgICAgICAgICAgY29uc3QgaW1hZ2VQYWRkaW5nVmlldyA9IG5ldyBVaW50OEFycmF5KGltYWdlUGFkZGluZ0J1ZmZlcik7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW1hZ2VQYWRkaW5nOyArK2kpIHtcclxuICAgICAgICAgICAgICAgIGltYWdlUGFkZGluZ1ZpZXdbaV0gPSAwO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBnbGJEYXRhID0gW2hlYWRlckJ1ZmZlciwganNvbkNodW5rQnVmZmVyLCBiaW5hcnlDaHVua0J1ZmZlciwgYmluYXJ5QnVmZmVyXTtcclxuXHJcbiAgICAgICAgICAgIC8vIGJpbmFyeSBkYXRhXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fb3JkZXJlZEltYWdlRGF0YS5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgZ2xiRGF0YS5wdXNoKHRoaXMuX29yZGVyZWRJbWFnZURhdGFbaV0uZGF0YSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGdsYkRhdGEucHVzaChiaW5QYWRkaW5nQnVmZmVyKTtcclxuXHJcbiAgICAgICAgICAgIGdsYkRhdGEucHVzaChpbWFnZVBhZGRpbmdCdWZmZXIpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgZ2xiRmlsZSA9IG5ldyBCbG9iKGdsYkRhdGEsIHsgdHlwZTogXCJhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW1cIiB9KTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IG5ldyBHTFRGRGF0YSgpO1xyXG4gICAgICAgICAgICBjb250YWluZXIuZ2xURkZpbGVzW2dsYkZpbGVOYW1lXSA9IGdsYkZpbGU7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5fbG9jYWxFbmdpbmUgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbG9jYWxFbmdpbmUuZGlzcG9zZSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZGlzcG9zZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kaXNwb3NlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBjb250YWluZXI7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIHRoZSBUUlMgZm9yIGVhY2ggbm9kZVxyXG4gICAgICogQHBhcmFtIG5vZGUgZ2xURiBOb2RlIGZvciBzdG9yaW5nIHRoZSB0cmFuc2Zvcm1hdGlvbiBkYXRhXHJcbiAgICAgKiBAcGFyYW0gYmFieWxvblRyYW5zZm9ybU5vZGUgQmFieWxvbiBtZXNoIHVzZWQgYXMgdGhlIHNvdXJjZSBmb3IgdGhlIHRyYW5zZm9ybWF0aW9uIGRhdGFcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBfc2V0Tm9kZVRyYW5zZm9ybWF0aW9uKG5vZGU6IElOb2RlLCBiYWJ5bG9uVHJhbnNmb3JtTm9kZTogVHJhbnNmb3JtTm9kZSk6IHZvaWQge1xyXG4gICAgICAgIGlmICghYmFieWxvblRyYW5zZm9ybU5vZGUuZ2V0UGl2b3RQb2ludCgpLmVxdWFsc1RvRmxvYXRzKDAsIDAsIDApKSB7XHJcbiAgICAgICAgICAgIFRvb2xzLldhcm4oXCJQaXZvdCBwb2ludHMgYXJlIG5vdCBzdXBwb3J0ZWQgaW4gdGhlIGdsVEYgc2VyaWFsaXplclwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFiYWJ5bG9uVHJhbnNmb3JtTm9kZS5wb3NpdGlvbi5lcXVhbHNUb0Zsb2F0cygwLCAwLCAwKSkge1xyXG4gICAgICAgICAgICBub2RlLnRyYW5zbGF0aW9uID0gYmFieWxvblRyYW5zZm9ybU5vZGUucG9zaXRpb24uYXNBcnJheSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFiYWJ5bG9uVHJhbnNmb3JtTm9kZS5zY2FsaW5nLmVxdWFsc1RvRmxvYXRzKDEsIDEsIDEpKSB7XHJcbiAgICAgICAgICAgIG5vZGUuc2NhbGUgPSBiYWJ5bG9uVHJhbnNmb3JtTm9kZS5zY2FsaW5nLmFzQXJyYXkoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHJvdGF0aW9uUXVhdGVybmlvbiA9IFF1YXRlcm5pb24uRnJvbUV1bGVyQW5nbGVzKGJhYnlsb25UcmFuc2Zvcm1Ob2RlLnJvdGF0aW9uLngsIGJhYnlsb25UcmFuc2Zvcm1Ob2RlLnJvdGF0aW9uLnksIGJhYnlsb25UcmFuc2Zvcm1Ob2RlLnJvdGF0aW9uLnopO1xyXG4gICAgICAgIGlmIChiYWJ5bG9uVHJhbnNmb3JtTm9kZS5yb3RhdGlvblF1YXRlcm5pb24pIHtcclxuICAgICAgICAgICAgcm90YXRpb25RdWF0ZXJuaW9uLm11bHRpcGx5SW5QbGFjZShiYWJ5bG9uVHJhbnNmb3JtTm9kZS5yb3RhdGlvblF1YXRlcm5pb24pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIVF1YXRlcm5pb24uSXNJZGVudGl0eShyb3RhdGlvblF1YXRlcm5pb24pKSB7XHJcbiAgICAgICAgICAgIG5vZGUucm90YXRpb24gPSByb3RhdGlvblF1YXRlcm5pb24ubm9ybWFsaXplKCkuYXNBcnJheSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9zZXRDYW1lcmFUcmFuc2Zvcm1hdGlvbihub2RlOiBJTm9kZSwgYmFieWxvbkNhbWVyYTogQ2FtZXJhKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgdHJhbnNsYXRpb24gPSBUbXBWZWN0b3JzLlZlY3RvcjNbMF07XHJcbiAgICAgICAgY29uc3Qgcm90YXRpb24gPSBUbXBWZWN0b3JzLlF1YXRlcm5pb25bMF07XHJcbiAgICAgICAgYmFieWxvbkNhbWVyYS5nZXRXb3JsZE1hdHJpeCgpLmRlY29tcG9zZSh1bmRlZmluZWQsIHJvdGF0aW9uLCB0cmFuc2xhdGlvbik7XHJcblxyXG4gICAgICAgIGlmICghdHJhbnNsYXRpb24uZXF1YWxzVG9GbG9hdHMoMCwgMCwgMCkpIHtcclxuICAgICAgICAgICAgbm9kZS50cmFuc2xhdGlvbiA9IHRyYW5zbGF0aW9uLmFzQXJyYXkoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIC8vIFJvdGF0aW9uIGJ5IDE4MCBhcyBnbFRGIGhhcyBhIGRpZmZlcmVudCBjb252ZW50aW9uIHRoYW4gQmFieWxvbi5cclxuICAgICAgICByb3RhdGlvbi5tdWx0aXBseUluUGxhY2Uocm90YXRpb24xODBZKTtcclxuXHJcbiAgICAgICAgaWYgKCFRdWF0ZXJuaW9uLklzSWRlbnRpdHkocm90YXRpb24pKSB7XHJcbiAgICAgICAgICAgIG5vZGUucm90YXRpb24gPSByb3RhdGlvbi5hc0FycmF5KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2dldFZlcnRleEJ1ZmZlckZyb21NZXNoKGF0dHJpYnV0ZUtpbmQ6IHN0cmluZywgYnVmZmVyTWVzaDogTWVzaCk6IE51bGxhYmxlPFZlcnRleEJ1ZmZlcj4ge1xyXG4gICAgICAgIGlmIChidWZmZXJNZXNoLmlzVmVydGljZXNEYXRhUHJlc2VudChhdHRyaWJ1dGVLaW5kLCB0cnVlKSkge1xyXG4gICAgICAgICAgICBjb25zdCB2ZXJ0ZXhCdWZmZXIgPSBidWZmZXJNZXNoLmdldFZlcnRleEJ1ZmZlcihhdHRyaWJ1dGVLaW5kLCB0cnVlKTtcclxuICAgICAgICAgICAgaWYgKHZlcnRleEJ1ZmZlcikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHZlcnRleEJ1ZmZlcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgYSBidWZmZXJ2aWV3IGJhc2VkIG9uIHRoZSB2ZXJ0aWNlcyB0eXBlIGZvciB0aGUgQmFieWxvbiBtZXNoXHJcbiAgICAgKiBAcGFyYW0ga2luZCBJbmRpY2F0ZXMgdGhlIHR5cGUgb2YgdmVydGljZXMgZGF0YVxyXG4gICAgICogQHBhcmFtIGF0dHJpYnV0ZUNvbXBvbmVudEtpbmQgSW5kaWNhdGVzIHRoZSBudW1lcmljYWwgdHlwZSB1c2VkIHRvIHN0b3JlIHRoZSBkYXRhXHJcbiAgICAgKiBAcGFyYW0gYmFieWxvblRyYW5zZm9ybU5vZGUgVGhlIEJhYnlsb24gbWVzaCB0byBnZXQgdGhlIHZlcnRpY2VzIGRhdGEgZnJvbVxyXG4gICAgICogQHBhcmFtIGJpbmFyeVdyaXRlciBUaGUgYnVmZmVyIHRvIHdyaXRlIHRoZSBidWZmZXJ2aWV3IGRhdGEgdG9cclxuICAgICAqIEBwYXJhbSBieXRlU3RyaWRlXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgX2NyZWF0ZUJ1ZmZlclZpZXdLaW5kKFxyXG4gICAgICAgIGtpbmQ6IHN0cmluZyxcclxuICAgICAgICBhdHRyaWJ1dGVDb21wb25lbnRLaW5kOiBBY2Nlc3NvckNvbXBvbmVudFR5cGUsXHJcbiAgICAgICAgYmFieWxvblRyYW5zZm9ybU5vZGU6IFRyYW5zZm9ybU5vZGUsXHJcbiAgICAgICAgYmluYXJ5V3JpdGVyOiBfQmluYXJ5V3JpdGVyLFxyXG4gICAgICAgIGJ5dGVTdHJpZGU6IG51bWJlclxyXG4gICAgKSB7XHJcbiAgICAgICAgY29uc3QgYnVmZmVyTWVzaCA9XHJcbiAgICAgICAgICAgIGJhYnlsb25UcmFuc2Zvcm1Ob2RlIGluc3RhbmNlb2YgTWVzaFxyXG4gICAgICAgICAgICAgICAgPyAoYmFieWxvblRyYW5zZm9ybU5vZGUgYXMgTWVzaClcclxuICAgICAgICAgICAgICAgIDogYmFieWxvblRyYW5zZm9ybU5vZGUgaW5zdGFuY2VvZiBJbnN0YW5jZWRNZXNoXHJcbiAgICAgICAgICAgICAgICAgID8gKGJhYnlsb25UcmFuc2Zvcm1Ob2RlIGFzIEluc3RhbmNlZE1lc2gpLnNvdXJjZU1lc2hcclxuICAgICAgICAgICAgICAgICAgOiBudWxsO1xyXG5cclxuICAgICAgICBpZiAoYnVmZmVyTWVzaCkge1xyXG4gICAgICAgICAgICBjb25zdCB2ZXJ0ZXhCdWZmZXIgPSBidWZmZXJNZXNoLmdldFZlcnRleEJ1ZmZlcihraW5kLCB0cnVlKTtcclxuICAgICAgICAgICAgY29uc3QgdmVydGV4RGF0YSA9IGJ1ZmZlck1lc2guZ2V0VmVydGljZXNEYXRhKGtpbmQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB0cnVlKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh2ZXJ0ZXhCdWZmZXIgJiYgdmVydGV4RGF0YSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdHlwZUJ5dGVMZW5ndGggPSBWZXJ0ZXhCdWZmZXIuR2V0VHlwZUJ5dGVMZW5ndGgoYXR0cmlidXRlQ29tcG9uZW50S2luZCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBieXRlTGVuZ3RoID0gdmVydGV4RGF0YS5sZW5ndGggKiB0eXBlQnl0ZUxlbmd0aDtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGJ1ZmZlclZpZXcgPSBfR0xURlV0aWxpdGllcy5fQ3JlYXRlQnVmZmVyVmlldygwLCBiaW5hcnlXcml0ZXIuZ2V0Qnl0ZU9mZnNldCgpLCBieXRlTGVuZ3RoLCBieXRlU3RyaWRlLCBraW5kICsgXCIgLSBcIiArIGJ1ZmZlck1lc2gubmFtZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9idWZmZXJWaWV3cy5wdXNoKGJ1ZmZlclZpZXcpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuX3dyaXRlQXR0cmlidXRlRGF0YShraW5kLCBhdHRyaWJ1dGVDb21wb25lbnRLaW5kLCB2ZXJ0ZXhEYXRhLCBieXRlU3RyaWRlIC8gdHlwZUJ5dGVMZW5ndGgsIGJpbmFyeVdyaXRlciwgYmFieWxvblRyYW5zZm9ybU5vZGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGhlIHByaW1pdGl2ZSBtb2RlIG9mIHRoZSBCYWJ5bG9uIG1lc2hcclxuICAgICAqIEBwYXJhbSBiYWJ5bG9uTWVzaCBUaGUgQmFieWxvbkpTIG1lc2hcclxuICAgICAqIEByZXR1cm5zIFVuc2lnbmVkIGludGVnZXIgb2YgdGhlIHByaW1pdGl2ZSBtb2RlIG9yIG51bGxcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBfZ2V0TWVzaFByaW1pdGl2ZU1vZGUoYmFieWxvbk1lc2g6IEFic3RyYWN0TWVzaCk6IG51bWJlciB7XHJcbiAgICAgICAgaWYgKGJhYnlsb25NZXNoIGluc3RhbmNlb2YgTGluZXNNZXNoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBNYXRlcmlhbC5MaW5lTGlzdERyYXdNb2RlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoYmFieWxvbk1lc2ggaW5zdGFuY2VvZiBJbnN0YW5jZWRNZXNoIHx8IGJhYnlsb25NZXNoIGluc3RhbmNlb2YgTWVzaCkge1xyXG4gICAgICAgICAgICBjb25zdCBiYXNlTWVzaCA9IGJhYnlsb25NZXNoIGluc3RhbmNlb2YgTWVzaCA/IGJhYnlsb25NZXNoIDogYmFieWxvbk1lc2guc291cmNlTWVzaDtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBiYXNlTWVzaC5vdmVycmlkZVJlbmRlcmluZ0ZpbGxNb2RlID09PSBcIm51bWJlclwiKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYmFzZU1lc2gub3ZlcnJpZGVSZW5kZXJpbmdGaWxsTW9kZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYmFieWxvbk1lc2gubWF0ZXJpYWwgPyBiYWJ5bG9uTWVzaC5tYXRlcmlhbC5maWxsTW9kZSA6IE1hdGVyaWFsLlRyaWFuZ2xlRmlsbE1vZGU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIHRoZSBwcmltaXRpdmUgbW9kZSBvZiB0aGUgZ2xURiBtZXNoIHByaW1pdGl2ZVxyXG4gICAgICogQHBhcmFtIG1lc2hQcmltaXRpdmUgZ2xURiBtZXNoIHByaW1pdGl2ZVxyXG4gICAgICogQHBhcmFtIHByaW1pdGl2ZU1vZGUgVGhlIHByaW1pdGl2ZSBtb2RlXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgX3NldFByaW1pdGl2ZU1vZGUobWVzaFByaW1pdGl2ZTogSU1lc2hQcmltaXRpdmUsIHByaW1pdGl2ZU1vZGU6IG51bWJlcikge1xyXG4gICAgICAgIHN3aXRjaCAocHJpbWl0aXZlTW9kZSkge1xyXG4gICAgICAgICAgICBjYXNlIE1hdGVyaWFsLlRyaWFuZ2xlRmlsbE1vZGU6IHtcclxuICAgICAgICAgICAgICAgIC8vIGdsVEYgZGVmYXVsdHMgdG8gdXNpbmcgVHJpYW5nbGUgTW9kZVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSBNYXRlcmlhbC5UcmlhbmdsZVN0cmlwRHJhd01vZGU6IHtcclxuICAgICAgICAgICAgICAgIG1lc2hQcmltaXRpdmUubW9kZSA9IE1lc2hQcmltaXRpdmVNb2RlLlRSSUFOR0xFX1NUUklQO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSBNYXRlcmlhbC5UcmlhbmdsZUZhbkRyYXdNb2RlOiB7XHJcbiAgICAgICAgICAgICAgICBtZXNoUHJpbWl0aXZlLm1vZGUgPSBNZXNoUHJpbWl0aXZlTW9kZS5UUklBTkdMRV9GQU47XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIE1hdGVyaWFsLlBvaW50TGlzdERyYXdNb2RlOiB7XHJcbiAgICAgICAgICAgICAgICBtZXNoUHJpbWl0aXZlLm1vZGUgPSBNZXNoUHJpbWl0aXZlTW9kZS5QT0lOVFM7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIE1hdGVyaWFsLlBvaW50RmlsbE1vZGU6IHtcclxuICAgICAgICAgICAgICAgIG1lc2hQcmltaXRpdmUubW9kZSA9IE1lc2hQcmltaXRpdmVNb2RlLlBPSU5UUztcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhc2UgTWF0ZXJpYWwuTGluZUxvb3BEcmF3TW9kZToge1xyXG4gICAgICAgICAgICAgICAgbWVzaFByaW1pdGl2ZS5tb2RlID0gTWVzaFByaW1pdGl2ZU1vZGUuTElORV9MT09QO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSBNYXRlcmlhbC5MaW5lTGlzdERyYXdNb2RlOiB7XHJcbiAgICAgICAgICAgICAgICBtZXNoUHJpbWl0aXZlLm1vZGUgPSBNZXNoUHJpbWl0aXZlTW9kZS5MSU5FUztcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhc2UgTWF0ZXJpYWwuTGluZVN0cmlwRHJhd01vZGU6IHtcclxuICAgICAgICAgICAgICAgIG1lc2hQcmltaXRpdmUubW9kZSA9IE1lc2hQcmltaXRpdmVNb2RlLkxJTkVfU1RSSVA7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldHMgdGhlIHZlcnRleCBhdHRyaWJ1dGUgYWNjZXNzb3IgYmFzZWQgb2YgdGhlIGdsVEYgbWVzaCBwcmltaXRpdmVcclxuICAgICAqIEBwYXJhbSBtZXNoUHJpbWl0aXZlIGdsVEYgbWVzaCBwcmltaXRpdmVcclxuICAgICAqIEBwYXJhbSBhdHRyaWJ1dGVLaW5kIHZlcnRleCBhdHRyaWJ1dGVcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBfc2V0QXR0cmlidXRlS2luZChhdHRyaWJ1dGVzOiB7IFtuYW1lOiBzdHJpbmddOiBudW1iZXIgfSwgYXR0cmlidXRlS2luZDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgc3dpdGNoIChhdHRyaWJ1dGVLaW5kKSB7XHJcbiAgICAgICAgICAgIGNhc2UgVmVydGV4QnVmZmVyLlBvc2l0aW9uS2luZDoge1xyXG4gICAgICAgICAgICAgICAgYXR0cmlidXRlcy5QT1NJVElPTiA9IHRoaXMuX2FjY2Vzc29ycy5sZW5ndGggLSAxO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSBWZXJ0ZXhCdWZmZXIuTm9ybWFsS2luZDoge1xyXG4gICAgICAgICAgICAgICAgYXR0cmlidXRlcy5OT1JNQUwgPSB0aGlzLl9hY2Nlc3NvcnMubGVuZ3RoIC0gMTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhc2UgVmVydGV4QnVmZmVyLkNvbG9yS2luZDoge1xyXG4gICAgICAgICAgICAgICAgYXR0cmlidXRlcy5DT0xPUl8wID0gdGhpcy5fYWNjZXNzb3JzLmxlbmd0aCAtIDE7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIFZlcnRleEJ1ZmZlci5UYW5nZW50S2luZDoge1xyXG4gICAgICAgICAgICAgICAgYXR0cmlidXRlcy5UQU5HRU5UID0gdGhpcy5fYWNjZXNzb3JzLmxlbmd0aCAtIDE7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIFZlcnRleEJ1ZmZlci5VVktpbmQ6IHtcclxuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXMuVEVYQ09PUkRfMCA9IHRoaXMuX2FjY2Vzc29ycy5sZW5ndGggLSAxO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSBWZXJ0ZXhCdWZmZXIuVVYyS2luZDoge1xyXG4gICAgICAgICAgICAgICAgYXR0cmlidXRlcy5URVhDT09SRF8xID0gdGhpcy5fYWNjZXNzb3JzLmxlbmd0aCAtIDE7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIFZlcnRleEJ1ZmZlci5NYXRyaWNlc0luZGljZXNLaW5kOiB7XHJcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzLkpPSU5UU18wID0gdGhpcy5fYWNjZXNzb3JzLmxlbmd0aCAtIDE7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIFZlcnRleEJ1ZmZlci5NYXRyaWNlc0luZGljZXNFeHRyYUtpbmQ6IHtcclxuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXMuSk9JTlRTXzEgPSB0aGlzLl9hY2Nlc3NvcnMubGVuZ3RoIC0gMTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhc2UgVmVydGV4QnVmZmVyLk1hdHJpY2VzV2VpZ2h0c0tpbmQ6IHtcclxuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXMuV0VJR0hUU18wID0gdGhpcy5fYWNjZXNzb3JzLmxlbmd0aCAtIDE7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIFZlcnRleEJ1ZmZlci5NYXRyaWNlc1dlaWdodHNFeHRyYUtpbmQ6IHtcclxuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXMuV0VJR0hUU18xID0gdGhpcy5fYWNjZXNzb3JzLmxlbmd0aCAtIDE7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBkZWZhdWx0OiB7XHJcbiAgICAgICAgICAgICAgICBUb29scy5XYXJuKFwiVW5zdXBwb3J0ZWQgVmVydGV4IEJ1ZmZlciBUeXBlOiBcIiArIGF0dHJpYnV0ZUtpbmQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0cyBkYXRhIGZvciB0aGUgcHJpbWl0aXZlIGF0dHJpYnV0ZXMgb2YgZWFjaCBzdWJtZXNoXHJcbiAgICAgKiBAcGFyYW0gbWVzaCBnbFRGIE1lc2ggb2JqZWN0IHRvIHN0b3JlIHRoZSBwcmltaXRpdmUgYXR0cmlidXRlIGluZm9ybWF0aW9uXHJcbiAgICAgKiBAcGFyYW0gYmFieWxvblRyYW5zZm9ybU5vZGUgQmFieWxvbiBtZXNoIHRvIGdldCB0aGUgcHJpbWl0aXZlIGF0dHJpYnV0ZSBkYXRhIGZyb21cclxuICAgICAqIEBwYXJhbSBiaW5hcnlXcml0ZXIgQnVmZmVyIHRvIHdyaXRlIHRoZSBhdHRyaWJ1dGUgZGF0YSB0b1xyXG4gICAgICogQHJldHVybnMgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHdoZW4gZG9uZSBzZXR0aW5nIHRoZSBwcmltaXRpdmUgYXR0cmlidXRlc1xyXG4gICAgICovXHJcbiAgICBwcml2YXRlIF9zZXRQcmltaXRpdmVBdHRyaWJ1dGVzQXN5bmMobWVzaDogSU1lc2gsIGJhYnlsb25UcmFuc2Zvcm1Ob2RlOiBUcmFuc2Zvcm1Ob2RlLCBiaW5hcnlXcml0ZXI6IF9CaW5hcnlXcml0ZXIpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICBjb25zdCBwcm9taXNlczogUHJvbWlzZTxJTWVzaFByaW1pdGl2ZT5bXSA9IFtdO1xyXG4gICAgICAgIGxldCBidWZmZXJNZXNoOiBOdWxsYWJsZTxNZXNoPiA9IG51bGw7XHJcbiAgICAgICAgbGV0IGJ1ZmZlclZpZXc6IElCdWZmZXJWaWV3O1xyXG4gICAgICAgIGxldCBtaW5NYXg6IHsgbWluOiBOdWxsYWJsZTxudW1iZXJbXT47IG1heDogTnVsbGFibGU8bnVtYmVyW10+IH07XHJcblxyXG4gICAgICAgIGlmIChiYWJ5bG9uVHJhbnNmb3JtTm9kZSBpbnN0YW5jZW9mIE1lc2gpIHtcclxuICAgICAgICAgICAgYnVmZmVyTWVzaCA9IGJhYnlsb25UcmFuc2Zvcm1Ob2RlIGFzIE1lc2g7XHJcbiAgICAgICAgfSBlbHNlIGlmIChiYWJ5bG9uVHJhbnNmb3JtTm9kZSBpbnN0YW5jZW9mIEluc3RhbmNlZE1lc2gpIHtcclxuICAgICAgICAgICAgYnVmZmVyTWVzaCA9IChiYWJ5bG9uVHJhbnNmb3JtTm9kZSBhcyBJbnN0YW5jZWRNZXNoKS5zb3VyY2VNZXNoO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBhdHRyaWJ1dGVEYXRhOiBfSVZlcnRleEF0dHJpYnV0ZURhdGFbXSA9IFtcclxuICAgICAgICAgICAgeyBraW5kOiBWZXJ0ZXhCdWZmZXIuUG9zaXRpb25LaW5kLCBhY2Nlc3NvclR5cGU6IEFjY2Vzc29yVHlwZS5WRUMzLCBhY2Nlc3NvckNvbXBvbmVudFR5cGU6IEFjY2Vzc29yQ29tcG9uZW50VHlwZS5GTE9BVCwgYnl0ZVN0cmlkZTogMTIgfSxcclxuICAgICAgICAgICAgeyBraW5kOiBWZXJ0ZXhCdWZmZXIuTm9ybWFsS2luZCwgYWNjZXNzb3JUeXBlOiBBY2Nlc3NvclR5cGUuVkVDMywgYWNjZXNzb3JDb21wb25lbnRUeXBlOiBBY2Nlc3NvckNvbXBvbmVudFR5cGUuRkxPQVQsIGJ5dGVTdHJpZGU6IDEyIH0sXHJcbiAgICAgICAgICAgIHsga2luZDogVmVydGV4QnVmZmVyLkNvbG9yS2luZCwgYWNjZXNzb3JUeXBlOiBBY2Nlc3NvclR5cGUuVkVDNCwgYWNjZXNzb3JDb21wb25lbnRUeXBlOiBBY2Nlc3NvckNvbXBvbmVudFR5cGUuRkxPQVQsIGJ5dGVTdHJpZGU6IDE2IH0sXHJcbiAgICAgICAgICAgIHsga2luZDogVmVydGV4QnVmZmVyLlRhbmdlbnRLaW5kLCBhY2Nlc3NvclR5cGU6IEFjY2Vzc29yVHlwZS5WRUM0LCBhY2Nlc3NvckNvbXBvbmVudFR5cGU6IEFjY2Vzc29yQ29tcG9uZW50VHlwZS5GTE9BVCwgYnl0ZVN0cmlkZTogMTYgfSxcclxuICAgICAgICAgICAgeyBraW5kOiBWZXJ0ZXhCdWZmZXIuVVZLaW5kLCBhY2Nlc3NvclR5cGU6IEFjY2Vzc29yVHlwZS5WRUMyLCBhY2Nlc3NvckNvbXBvbmVudFR5cGU6IEFjY2Vzc29yQ29tcG9uZW50VHlwZS5GTE9BVCwgYnl0ZVN0cmlkZTogOCB9LFxyXG4gICAgICAgICAgICB7IGtpbmQ6IFZlcnRleEJ1ZmZlci5VVjJLaW5kLCBhY2Nlc3NvclR5cGU6IEFjY2Vzc29yVHlwZS5WRUMyLCBhY2Nlc3NvckNvbXBvbmVudFR5cGU6IEFjY2Vzc29yQ29tcG9uZW50VHlwZS5GTE9BVCwgYnl0ZVN0cmlkZTogOCB9LFxyXG4gICAgICAgICAgICB7IGtpbmQ6IFZlcnRleEJ1ZmZlci5NYXRyaWNlc0luZGljZXNLaW5kLCBhY2Nlc3NvclR5cGU6IEFjY2Vzc29yVHlwZS5WRUM0LCBhY2Nlc3NvckNvbXBvbmVudFR5cGU6IEFjY2Vzc29yQ29tcG9uZW50VHlwZS5VTlNJR05FRF9TSE9SVCwgYnl0ZVN0cmlkZTogOCB9LFxyXG4gICAgICAgICAgICB7IGtpbmQ6IFZlcnRleEJ1ZmZlci5NYXRyaWNlc0luZGljZXNFeHRyYUtpbmQsIGFjY2Vzc29yVHlwZTogQWNjZXNzb3JUeXBlLlZFQzQsIGFjY2Vzc29yQ29tcG9uZW50VHlwZTogQWNjZXNzb3JDb21wb25lbnRUeXBlLlVOU0lHTkVEX1NIT1JULCBieXRlU3RyaWRlOiA4IH0sXHJcbiAgICAgICAgICAgIHsga2luZDogVmVydGV4QnVmZmVyLk1hdHJpY2VzV2VpZ2h0c0tpbmQsIGFjY2Vzc29yVHlwZTogQWNjZXNzb3JUeXBlLlZFQzQsIGFjY2Vzc29yQ29tcG9uZW50VHlwZTogQWNjZXNzb3JDb21wb25lbnRUeXBlLkZMT0FULCBieXRlU3RyaWRlOiAxNiB9LFxyXG4gICAgICAgICAgICB7IGtpbmQ6IFZlcnRleEJ1ZmZlci5NYXRyaWNlc1dlaWdodHNFeHRyYUtpbmQsIGFjY2Vzc29yVHlwZTogQWNjZXNzb3JUeXBlLlZFQzQsIGFjY2Vzc29yQ29tcG9uZW50VHlwZTogQWNjZXNzb3JDb21wb25lbnRUeXBlLkZMT0FULCBieXRlU3RyaWRlOiAxNiB9LFxyXG4gICAgICAgIF07XHJcblxyXG4gICAgICAgIGlmIChidWZmZXJNZXNoKSB7XHJcbiAgICAgICAgICAgIGxldCBpbmRleEJ1ZmZlclZpZXdJbmRleDogTnVsbGFibGU8bnVtYmVyPiA9IG51bGw7XHJcbiAgICAgICAgICAgIGNvbnN0IHByaW1pdGl2ZU1vZGUgPSB0aGlzLl9nZXRNZXNoUHJpbWl0aXZlTW9kZShidWZmZXJNZXNoKTtcclxuICAgICAgICAgICAgY29uc3QgdmVydGV4QXR0cmlidXRlQnVmZmVyVmlld3M6IHsgW2F0dHJpYnV0ZUtpbmQ6IHN0cmluZ106IG51bWJlciB9ID0ge307XHJcbiAgICAgICAgICAgIGNvbnN0IG1vcnBoVGFyZ2V0TWFuYWdlciA9IGJ1ZmZlck1lc2gubW9ycGhUYXJnZXRNYW5hZ2VyO1xyXG5cclxuICAgICAgICAgICAgLy8gRm9yIGVhY2ggQmFieWxvbk1lc2gsIGNyZWF0ZSBidWZmZXJ2aWV3cyBmb3IgZWFjaCAna2luZCdcclxuICAgICAgICAgICAgZm9yIChjb25zdCBhdHRyaWJ1dGUgb2YgYXR0cmlidXRlRGF0YSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYXR0cmlidXRlS2luZCA9IGF0dHJpYnV0ZS5raW5kO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYXR0cmlidXRlQ29tcG9uZW50S2luZCA9IGF0dHJpYnV0ZS5hY2Nlc3NvckNvbXBvbmVudFR5cGU7XHJcbiAgICAgICAgICAgICAgICBpZiAoYnVmZmVyTWVzaC5pc1ZlcnRpY2VzRGF0YVByZXNlbnQoYXR0cmlidXRlS2luZCwgdHJ1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB2ZXJ0ZXhCdWZmZXIgPSB0aGlzLl9nZXRWZXJ0ZXhCdWZmZXJGcm9tTWVzaChhdHRyaWJ1dGVLaW5kLCBidWZmZXJNZXNoKTtcclxuICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGUuYnl0ZVN0cmlkZSA9IHZlcnRleEJ1ZmZlclxyXG4gICAgICAgICAgICAgICAgICAgICAgICA/IHZlcnRleEJ1ZmZlci5nZXRTaXplKCkgKiBWZXJ0ZXhCdWZmZXIuR2V0VHlwZUJ5dGVMZW5ndGgoYXR0cmlidXRlLmFjY2Vzc29yQ29tcG9uZW50VHlwZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgOiBWZXJ0ZXhCdWZmZXIuRGVkdWNlU3RyaWRlKGF0dHJpYnV0ZUtpbmQpICogNDtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYXR0cmlidXRlLmJ5dGVTdHJpZGUgPT09IDEyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZS5hY2Nlc3NvclR5cGUgPSBBY2Nlc3NvclR5cGUuVkVDMztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NyZWF0ZUJ1ZmZlclZpZXdLaW5kKGF0dHJpYnV0ZUtpbmQsIGF0dHJpYnV0ZUNvbXBvbmVudEtpbmQsIGJhYnlsb25UcmFuc2Zvcm1Ob2RlLCBiaW5hcnlXcml0ZXIsIGF0dHJpYnV0ZS5ieXRlU3RyaWRlKTtcclxuICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGUuYnVmZmVyVmlld0luZGV4ID0gdGhpcy5fYnVmZmVyVmlld3MubGVuZ3RoIC0gMTtcclxuICAgICAgICAgICAgICAgICAgICB2ZXJ0ZXhBdHRyaWJ1dGVCdWZmZXJWaWV3c1thdHRyaWJ1dGVLaW5kXSA9IGF0dHJpYnV0ZS5idWZmZXJWaWV3SW5kZXg7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIFdyaXRlIGFueSBtb3JwaCB0YXJnZXQgZGF0YSB0byB0aGUgYnVmZmVyIGFuZCBjcmVhdGUgYW4gYXNzb2NpYXRlZCBidWZmZXIgdmlld1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChtb3JwaFRhcmdldE1hbmFnZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtb3JwaFRhcmdldE1hbmFnZXIubnVtVGFyZ2V0czsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBtb3JwaFRhcmdldCA9IG1vcnBoVGFyZ2V0TWFuYWdlci5nZXRUYXJnZXQoaSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBtb3JwaFRhcmdldEluZm8gPSB0aGlzLl9jcmVhdGVNb3JwaFRhcmdldEJ1ZmZlclZpZXdLaW5kKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZUtpbmQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlLmFjY2Vzc29yVHlwZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVDb21wb25lbnRLaW5kLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlck1lc2gsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9ycGhUYXJnZXQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmluYXJ5V3JpdGVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZS5ieXRlU3RyaWRlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFN0b3JlIGluZm8gYWJvdXQgdGhlIG1vcnBoIHRhcmdldCB0aGF0IHdpbGwgYmUgbmVlZGVkIGxhdGVyIHdoZW4gY3JlYXRpbmcgcGVyLXN1Ym1lc2ggYWNjZXNzb3JzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobW9ycGhUYXJnZXRJbmZvKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFhdHRyaWJ1dGUubW9ycGhUYXJnZXRJbmZvKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZS5tb3JwaFRhcmdldEluZm8gPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlLm1vcnBoVGFyZ2V0SW5mb1tpXSA9IG1vcnBoVGFyZ2V0SW5mbztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGJ1ZmZlck1lc2guZ2V0VG90YWxJbmRpY2VzKCkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGluZGljZXMgPSBidWZmZXJNZXNoLmdldEluZGljZXMoKTtcclxuICAgICAgICAgICAgICAgIGlmIChpbmRpY2VzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYnl0ZUxlbmd0aCA9IGluZGljZXMubGVuZ3RoICogNDtcclxuICAgICAgICAgICAgICAgICAgICBidWZmZXJWaWV3ID0gX0dMVEZVdGlsaXRpZXMuX0NyZWF0ZUJ1ZmZlclZpZXcoMCwgYmluYXJ5V3JpdGVyLmdldEJ5dGVPZmZzZXQoKSwgYnl0ZUxlbmd0aCwgdW5kZWZpbmVkLCBcIkluZGljZXMgLSBcIiArIGJ1ZmZlck1lc2gubmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYnVmZmVyVmlld3MucHVzaChidWZmZXJWaWV3KTtcclxuICAgICAgICAgICAgICAgICAgICBpbmRleEJ1ZmZlclZpZXdJbmRleCA9IHRoaXMuX2J1ZmZlclZpZXdzLmxlbmd0aCAtIDE7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSAwLCBsZW5ndGggPSBpbmRpY2VzLmxlbmd0aDsgayA8IGxlbmd0aDsgKytrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJpbmFyeVdyaXRlci5zZXRVSW50MzIoaW5kaWNlc1trXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoYnVmZmVyTWVzaC5zdWJNZXNoZXMpIHtcclxuICAgICAgICAgICAgICAgIC8vIGdvIHRocm91Z2ggYWxsIG1lc2ggcHJpbWl0aXZlcyAoc3VibWVzaGVzKVxyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBzdWJtZXNoIG9mIGJ1ZmZlck1lc2guc3ViTWVzaGVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGJhYnlsb25NYXRlcmlhbCA9IHN1Ym1lc2guZ2V0TWF0ZXJpYWwoKSB8fCBidWZmZXJNZXNoLmdldFNjZW5lKCkuZGVmYXVsdE1hdGVyaWFsO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgbWF0ZXJpYWxJbmRleDogTnVsbGFibGU8bnVtYmVyPiA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJhYnlsb25NYXRlcmlhbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYnVmZmVyTWVzaCBpbnN0YW5jZW9mIExpbmVzTWVzaCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZ2V0IHRoZSBjb2xvciBmcm9tIHRoZSBsaW5lcyBtZXNoIGFuZCBzZXQgaXQgaW4gdGhlIG1hdGVyaWFsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBtYXRlcmlhbDogSU1hdGVyaWFsID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGJ1ZmZlck1lc2gubmFtZSArIFwiIG1hdGVyaWFsXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFidWZmZXJNZXNoLmNvbG9yLmVxdWFscyhDb2xvcjMuV2hpdGUoKSkgfHwgYnVmZmVyTWVzaC5hbHBoYSA8IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRlcmlhbC5wYnJNZXRhbGxpY1JvdWdobmVzcyA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFzZUNvbG9yRmFjdG9yOiBidWZmZXJNZXNoLmNvbG9yLmFzQXJyYXkoKS5jb25jYXQoW2J1ZmZlck1lc2guYWxwaGFdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbWF0ZXJpYWxzLnB1c2gobWF0ZXJpYWwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0ZXJpYWxJbmRleCA9IHRoaXMuX21hdGVyaWFscy5sZW5ndGggLSAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGJhYnlsb25NYXRlcmlhbCBpbnN0YW5jZW9mIE11bHRpTWF0ZXJpYWwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHN1Yk1hdGVyaWFsID0gYmFieWxvbk1hdGVyaWFsLnN1Yk1hdGVyaWFsc1tzdWJtZXNoLm1hdGVyaWFsSW5kZXhdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN1Yk1hdGVyaWFsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFieWxvbk1hdGVyaWFsID0gc3ViTWF0ZXJpYWw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0ZXJpYWxJbmRleCA9IHRoaXMuX21hdGVyaWFsTWFwW2JhYnlsb25NYXRlcmlhbC51bmlxdWVJZF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRlcmlhbEluZGV4ID0gdGhpcy5fbWF0ZXJpYWxNYXBbYmFieWxvbk1hdGVyaWFsLnVuaXF1ZUlkXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZ2xURk1hdGVyaWFsOiBOdWxsYWJsZTxJTWF0ZXJpYWw+ID0gbWF0ZXJpYWxJbmRleCAhPSBudWxsID8gdGhpcy5fbWF0ZXJpYWxzW21hdGVyaWFsSW5kZXhdIDogbnVsbDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbWVzaFByaW1pdGl2ZTogSU1lc2hQcmltaXRpdmUgPSB7IGF0dHJpYnV0ZXM6IHt9IH07XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2V0UHJpbWl0aXZlTW9kZShtZXNoUHJpbWl0aXZlLCBwcmltaXRpdmVNb2RlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBhdHRyaWJ1dGUgb2YgYXR0cmlidXRlRGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBhdHRyaWJ1dGVLaW5kID0gYXR0cmlidXRlLmtpbmQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoYXR0cmlidXRlS2luZCA9PT0gVmVydGV4QnVmZmVyLlVWS2luZCB8fCBhdHRyaWJ1dGVLaW5kID09PSBWZXJ0ZXhCdWZmZXIuVVYyS2luZCkgJiYgIXRoaXMuX29wdGlvbnMuZXhwb3J0VW51c2VkVVZzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWdsVEZNYXRlcmlhbCB8fCAhdGhpcy5fZ2xURk1hdGVyaWFsRXhwb3J0ZXIuX2hhc1RleHR1cmVzUHJlc2VudChnbFRGTWF0ZXJpYWwpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdmVydGV4RGF0YSA9IGJ1ZmZlck1lc2guZ2V0VmVydGljZXNEYXRhKGF0dHJpYnV0ZUtpbmQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZlcnRleERhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHZlcnRleEJ1ZmZlciA9IHRoaXMuX2dldFZlcnRleEJ1ZmZlckZyb21NZXNoKGF0dHJpYnV0ZUtpbmQsIGJ1ZmZlck1lc2gpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZlcnRleEJ1ZmZlcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHN0cmlkZSA9IHZlcnRleEJ1ZmZlci5nZXRTaXplKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYnVmZmVyVmlld0luZGV4ID0gYXR0cmlidXRlLmJ1ZmZlclZpZXdJbmRleDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYnVmZmVyVmlld0luZGV4ICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjaGVjayB0byBzZWUgaWYgYnVmZmVydmlld2luZGV4IGhhcyBhIG51bWVyaWMgdmFsdWUgYXNzaWduZWQuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbk1heCA9IHsgbWluOiBudWxsLCBtYXg6IG51bGwgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZUtpbmQgPT0gVmVydGV4QnVmZmVyLlBvc2l0aW9uS2luZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWluTWF4ID0gX0dMVEZVdGlsaXRpZXMuX0NhbGN1bGF0ZU1pbk1heFBvc2l0aW9ucyh2ZXJ0ZXhEYXRhLCAwLCB2ZXJ0ZXhEYXRhLmxlbmd0aCAvIHN0cmlkZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYWNjZXNzb3IgPSBfR0xURlV0aWxpdGllcy5fQ3JlYXRlQWNjZXNzb3IoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWZmZXJWaWV3SW5kZXgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVLaW5kICsgXCIgLSBcIiArIGJhYnlsb25UcmFuc2Zvcm1Ob2RlLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGUuYWNjZXNzb3JUeXBlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlLmFjY2Vzc29yQ29tcG9uZW50VHlwZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZlcnRleERhdGEubGVuZ3RoIC8gc3RyaWRlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbk1heC5taW4sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaW5NYXgubWF4XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2FjY2Vzc29ycy5wdXNoKGFjY2Vzc29yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2V0QXR0cmlidXRlS2luZChtZXNoUHJpbWl0aXZlLmF0dHJpYnV0ZXMsIGF0dHJpYnV0ZUtpbmQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4QnVmZmVyVmlld0luZGV4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIENyZWF0ZSBhY2Nlc3NvclxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBhY2Nlc3NvciA9IF9HTFRGVXRpbGl0aWVzLl9DcmVhdGVBY2Nlc3NvcihcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4QnVmZmVyVmlld0luZGV4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJpbmRpY2VzIC0gXCIgKyBiYWJ5bG9uVHJhbnNmb3JtTm9kZS5uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQWNjZXNzb3JUeXBlLlNDQUxBUixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFjY2Vzc29yQ29tcG9uZW50VHlwZS5VTlNJR05FRF9JTlQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWJtZXNoLmluZGV4Q291bnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWJtZXNoLmluZGV4U3RhcnQgKiA0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG51bGxcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fYWNjZXNzb3JzLnB1c2goYWNjZXNzb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNoUHJpbWl0aXZlLmluZGljZXMgPSB0aGlzLl9hY2Nlc3NvcnMubGVuZ3RoIC0gMTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChPYmplY3Qua2V5cyhtZXNoUHJpbWl0aXZlLmF0dHJpYnV0ZXMpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2lkZU9yaWVudGF0aW9uID0gYmFieWxvbk1hdGVyaWFsLl9nZXRFZmZlY3RpdmVPcmllbnRhdGlvbihidWZmZXJNZXNoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzaWRlT3JpZW50YXRpb24gPT09ICh0aGlzLl9iYWJ5bG9uU2NlbmUudXNlUmlnaHRIYW5kZWRTeXN0ZW0gPyBNYXRlcmlhbC5DbG9ja1dpc2VTaWRlT3JpZW50YXRpb24gOiBNYXRlcmlhbC5Db3VudGVyQ2xvY2tXaXNlU2lkZU9yaWVudGF0aW9uKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGJ5dGVPZmZzZXQgPSBpbmRleEJ1ZmZlclZpZXdJbmRleCAhPSBudWxsID8gdGhpcy5fYnVmZmVyVmlld3NbaW5kZXhCdWZmZXJWaWV3SW5kZXhdLmJ5dGVPZmZzZXQgOiBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJ5dGVPZmZzZXQgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ5dGVPZmZzZXQgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGJhYnlsb25JbmRpY2VzOiBOdWxsYWJsZTxJbmRpY2VzQXJyYXk+ID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmRleEJ1ZmZlclZpZXdJbmRleCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFieWxvbkluZGljZXMgPSBidWZmZXJNZXNoLmdldEluZGljZXMoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChiYWJ5bG9uSW5kaWNlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3Jlb3JkZXJJbmRpY2VzQmFzZWRPblByaW1pdGl2ZU1vZGUoc3VibWVzaCwgcHJpbWl0aXZlTW9kZSwgYmFieWxvbkluZGljZXMsIGJ5dGVPZmZzZXQsIGJpbmFyeVdyaXRlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgYXR0cmlidXRlIG9mIGF0dHJpYnV0ZURhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdmVydGV4RGF0YSA9IGJ1ZmZlck1lc2guZ2V0VmVydGljZXNEYXRhKGF0dHJpYnV0ZS5raW5kLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2ZXJ0ZXhEYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBieXRlT2Zmc2V0ID0gdGhpcy5fYnVmZmVyVmlld3NbdmVydGV4QXR0cmlidXRlQnVmZmVyVmlld3NbYXR0cmlidXRlLmtpbmRdXS5ieXRlT2Zmc2V0IHx8IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZW9yZGVyVmVydGV4QXR0cmlidXRlRGF0YUJhc2VkT25QcmltaXRpdmVNb2RlKHN1Ym1lc2gsIHByaW1pdGl2ZU1vZGUsIGF0dHJpYnV0ZS5raW5kLCB2ZXJ0ZXhEYXRhLCBieXRlT2Zmc2V0LCBiaW5hcnlXcml0ZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobWF0ZXJpYWxJbmRleCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNoUHJpbWl0aXZlLm1hdGVyaWFsID0gbWF0ZXJpYWxJbmRleDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgdGhlcmUgYXJlIG1vcnBoIHRhcmdldHMsIHdyaXRlIG91dCB0YXJnZXRzIGFuZCBhc3NvY2lhdGVkIGFjY2Vzc29yc1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChtb3JwaFRhcmdldE1hbmFnZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQnkgY29udmVudGlvbiwgbW9ycGggdGFyZ2V0IG5hbWVzIGFyZSBzdG9yZWQgaW4gdGhlIG1lc2ggZXh0cmFzLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIW1lc2guZXh0cmFzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNoLmV4dHJhcyA9IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc2guZXh0cmFzLnRhcmdldE5hbWVzID0gW107XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1vcnBoVGFyZ2V0TWFuYWdlci5udW1UYXJnZXRzOyArK2kpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG1vcnBoVGFyZ2V0ID0gbW9ycGhUYXJnZXRNYW5hZ2VyLmdldFRhcmdldChpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc2guZXh0cmFzLnRhcmdldE5hbWVzLnB1c2gobW9ycGhUYXJnZXQubmFtZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBhdHRyaWJ1dGUgb2YgYXR0cmlidXRlRGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG1vcnBoVGFyZ2V0SW5mbyA9IGF0dHJpYnV0ZS5tb3JwaFRhcmdldEluZm8/LltpXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobW9ycGhUYXJnZXRJbmZvKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdyaXRlIHRoZSBhY2Nlc3NvclxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBieXRlT2Zmc2V0ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYWNjZXNzb3IgPSBfR0xURlV0aWxpdGllcy5fQ3JlYXRlQWNjZXNzb3IoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb3JwaFRhcmdldEluZm8uYnVmZmVyVmlld0luZGV4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYCR7YXR0cmlidXRlLmtpbmR9IC0gJHttb3JwaFRhcmdldC5uYW1lfSAoTW9ycGggVGFyZ2V0KWAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb3JwaFRhcmdldEluZm8uYWNjZXNzb3JUeXBlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlLmFjY2Vzc29yQ29tcG9uZW50VHlwZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vcnBoVGFyZ2V0SW5mby52ZXJ0ZXhDb3VudCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ5dGVPZmZzZXQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb3JwaFRhcmdldEluZm8ubWluTWF4Py5taW4/LmFzQXJyYXkoKSA/PyBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9ycGhUYXJnZXRJbmZvLm1pbk1heD8ubWF4Py5hc0FycmF5KCkgPz8gbnVsbFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9hY2Nlc3NvcnMucHVzaChhY2Nlc3Nvcik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDcmVhdGUgYSB0YXJnZXQgdGhhdCByZWZlcmVuY2VzIHRoZSBuZXcgYWNjZXNzb3JcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFtZXNoUHJpbWl0aXZlLnRhcmdldHMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc2hQcmltaXRpdmUudGFyZ2V0cyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIW1lc2hQcmltaXRpdmUudGFyZ2V0c1tpXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzaFByaW1pdGl2ZS50YXJnZXRzW2ldID0ge307XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NldEF0dHJpYnV0ZUtpbmQobWVzaFByaW1pdGl2ZS50YXJnZXRzW2ldLCBhdHRyaWJ1dGUua2luZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBtZXNoLnByaW1pdGl2ZXMucHVzaChtZXNoUHJpbWl0aXZlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXh0ZW5zaW9uc1Bvc3RFeHBvcnRNZXNoUHJpbWl0aXZlQXN5bmMoXCJwb3N0RXhwb3J0XCIsIG1lc2hQcmltaXRpdmUsIHN1Ym1lc2gsIGJpbmFyeVdyaXRlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvbWlzZXMucHVzaCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgIC8qIGRvIG5vdGhpbmcgKi9cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgYSBnbFRGIHNjZW5lIGJhc2VkIG9uIHRoZSBhcnJheSBvZiBtZXNoZXNcclxuICAgICAqIFJldHVybnMgdGhlIHRvdGFsIGJ5dGUgb2Zmc2V0XHJcbiAgICAgKiBAcGFyYW0gYmluYXJ5V3JpdGVyIEJ1ZmZlciB0byB3cml0ZSBiaW5hcnkgZGF0YSB0b1xyXG4gICAgICogQHJldHVybnMgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2hlbiBkb25lXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgX2NyZWF0ZVNjZW5lQXN5bmMoYmluYXJ5V3JpdGVyOiBfQmluYXJ5V3JpdGVyKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgICAgY29uc3Qgc2NlbmU6IElTY2VuZSA9IHsgbm9kZXM6IFtdIH07XHJcbiAgICAgICAgbGV0IGdsVEZOb2RlSW5kZXg6IG51bWJlcjtcclxuICAgICAgICBsZXQgZ2xURk5vZGU6IElOb2RlO1xyXG4gICAgICAgIGxldCBkaXJlY3REZXNjZW5kZW50czogTm9kZVtdO1xyXG4gICAgICAgIGNvbnN0IG5vZGVzOiBOb2RlW10gPSBbLi4udGhpcy5fYmFieWxvblNjZW5lLnRyYW5zZm9ybU5vZGVzLCAuLi50aGlzLl9iYWJ5bG9uU2NlbmUubWVzaGVzLCAuLi50aGlzLl9iYWJ5bG9uU2NlbmUubGlnaHRzLCAuLi50aGlzLl9iYWJ5bG9uU2NlbmUuY2FtZXJhc107XHJcbiAgICAgICAgY29uc3QgcmVtb3ZlZFJvb3ROb2RlcyA9IG5ldyBTZXQ8Tm9kZT4oKTtcclxuXHJcbiAgICAgICAgLy8gU2NlbmUgbWV0YWRhdGFcclxuICAgICAgICBpZiAodGhpcy5fYmFieWxvblNjZW5lLm1ldGFkYXRhKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9vcHRpb25zLm1ldGFkYXRhU2VsZWN0b3IpIHtcclxuICAgICAgICAgICAgICAgIHNjZW5lLmV4dHJhcyA9IHRoaXMuX29wdGlvbnMubWV0YWRhdGFTZWxlY3Rvcih0aGlzLl9iYWJ5bG9uU2NlbmUubWV0YWRhdGEpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2JhYnlsb25TY2VuZS5tZXRhZGF0YS5nbHRmKSB7XHJcbiAgICAgICAgICAgICAgICBzY2VuZS5leHRyYXMgPSB0aGlzLl9iYWJ5bG9uU2NlbmUubWV0YWRhdGEuZ2x0Zi5leHRyYXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFJlbW92ZSBuby1vcCByb290IG5vZGVzXHJcbiAgICAgICAgaWYgKCh0aGlzLl9vcHRpb25zLnJlbW92ZU5vb3BSb290Tm9kZXMgPz8gdHJ1ZSkgJiYgIXRoaXMuX29wdGlvbnMuaW5jbHVkZUNvb3JkaW5hdGVTeXN0ZW1Db252ZXJzaW9uTm9kZXMpIHtcclxuICAgICAgICAgICAgZm9yIChjb25zdCByb290Tm9kZSBvZiB0aGlzLl9iYWJ5bG9uU2NlbmUucm9vdE5vZGVzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNOb29wTm9kZShyb290Tm9kZSwgdGhpcy5fYmFieWxvblNjZW5lLnVzZVJpZ2h0SGFuZGVkU3lzdGVtKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlbW92ZWRSb290Tm9kZXMuYWRkKHJvb3ROb2RlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gRXhjbHVkZSB0aGUgbm9kZSBmcm9tIGxpc3Qgb2Ygbm9kZXMgdG8gZXhwb3J0XHJcbiAgICAgICAgICAgICAgICAgICAgbm9kZXMuc3BsaWNlKG5vZGVzLmluZGV4T2Yocm9vdE5vZGUpLCAxKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gRXhwb3J0IGJhYnlsb24gY2FtZXJhcyB0byBnbFRGQ2FtZXJhXHJcbiAgICAgICAgY29uc3QgY2FtZXJhTWFwID0gbmV3IE1hcDxDYW1lcmEsIG51bWJlcj4oKTtcclxuICAgICAgICB0aGlzLl9iYWJ5bG9uU2NlbmUuY2FtZXJhcy5mb3JFYWNoKChjYW1lcmEpID0+IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX29wdGlvbnMuc2hvdWxkRXhwb3J0Tm9kZSAmJiAhdGhpcy5fb3B0aW9ucy5zaG91bGRFeHBvcnROb2RlKGNhbWVyYSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgZ2xURkNhbWVyYTogSUNhbWVyYSA9IHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IGNhbWVyYS5tb2RlID09PSBDYW1lcmEuUEVSU1BFQ1RJVkVfQ0FNRVJBID8gQ2FtZXJhVHlwZS5QRVJTUEVDVElWRSA6IENhbWVyYVR5cGUuT1JUSE9HUkFQSElDLFxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgaWYgKGNhbWVyYS5uYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBnbFRGQ2FtZXJhLm5hbWUgPSBjYW1lcmEubmFtZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGdsVEZDYW1lcmEudHlwZSA9PT0gQ2FtZXJhVHlwZS5QRVJTUEVDVElWRSkge1xyXG4gICAgICAgICAgICAgICAgZ2xURkNhbWVyYS5wZXJzcGVjdGl2ZSA9IHtcclxuICAgICAgICAgICAgICAgICAgICBhc3BlY3RSYXRpbzogY2FtZXJhLmdldEVuZ2luZSgpLmdldEFzcGVjdFJhdGlvKGNhbWVyYSksXHJcbiAgICAgICAgICAgICAgICAgICAgeWZvdjogY2FtZXJhLmZvdk1vZGUgPT09IENhbWVyYS5GT1ZNT0RFX1ZFUlRJQ0FMX0ZJWEVEID8gY2FtZXJhLmZvdiA6IGNhbWVyYS5mb3YgKiBjYW1lcmEuZ2V0RW5naW5lKCkuZ2V0QXNwZWN0UmF0aW8oY2FtZXJhKSxcclxuICAgICAgICAgICAgICAgICAgICB6bmVhcjogY2FtZXJhLm1pblosXHJcbiAgICAgICAgICAgICAgICAgICAgemZhcjogY2FtZXJhLm1heFosXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGdsVEZDYW1lcmEudHlwZSA9PT0gQ2FtZXJhVHlwZS5PUlRIT0dSQVBISUMpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGhhbGZXaWR0aCA9IGNhbWVyYS5vcnRob0xlZnQgJiYgY2FtZXJhLm9ydGhvUmlnaHQgPyAwLjUgKiAoY2FtZXJhLm9ydGhvUmlnaHQgLSBjYW1lcmEub3J0aG9MZWZ0KSA6IGNhbWVyYS5nZXRFbmdpbmUoKS5nZXRSZW5kZXJXaWR0aCgpICogMC41O1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaGFsZkhlaWdodCA9IGNhbWVyYS5vcnRob0JvdHRvbSAmJiBjYW1lcmEub3J0aG9Ub3AgPyAwLjUgKiAoY2FtZXJhLm9ydGhvVG9wIC0gY2FtZXJhLm9ydGhvQm90dG9tKSA6IGNhbWVyYS5nZXRFbmdpbmUoKS5nZXRSZW5kZXJIZWlnaHQoKSAqIDAuNTtcclxuICAgICAgICAgICAgICAgIGdsVEZDYW1lcmEub3J0aG9ncmFwaGljID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHhtYWc6IGhhbGZXaWR0aCxcclxuICAgICAgICAgICAgICAgICAgICB5bWFnOiBoYWxmSGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgICAgIHpuZWFyOiBjYW1lcmEubWluWixcclxuICAgICAgICAgICAgICAgICAgICB6ZmFyOiBjYW1lcmEubWF4WixcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNhbWVyYU1hcC5zZXQoY2FtZXJhLCB0aGlzLl9jYW1lcmFzLmxlbmd0aCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2NhbWVyYXMucHVzaChnbFRGQ2FtZXJhKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29uc3QgW2V4cG9ydE5vZGVzLCBleHBvcnRNYXRlcmlhbHNdID0gdGhpcy5fZ2V0RXhwb3J0Tm9kZXMobm9kZXMpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9nbFRGTWF0ZXJpYWxFeHBvcnRlci5fY29udmVydE1hdGVyaWFsc1RvR0xURkFzeW5jKGV4cG9ydE1hdGVyaWFscywgSW1hZ2VNaW1lVHlwZS5QTkcsIHRydWUpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY3JlYXRlTm9kZU1hcEFuZEFuaW1hdGlvbnNBc3luYyhleHBvcnROb2RlcywgYmluYXJ5V3JpdGVyKS50aGVuKChub2RlTWFwKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fY3JlYXRlU2tpbnNBc3luYyhub2RlTWFwLCBiaW5hcnlXcml0ZXIpLnRoZW4oKHNraW5NYXApID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ub2RlTWFwID0gbm9kZU1hcDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdG90YWxCeXRlTGVuZ3RoID0gYmluYXJ5V3JpdGVyLmdldEJ5dGVPZmZzZXQoKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fdG90YWxCeXRlTGVuZ3RoID09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ1bmRlZmluZWQgYnl0ZSBsZW5ndGghXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gQnVpbGQgSGllcmFyY2h5IHdpdGggdGhlIG5vZGUgbWFwLlxyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgYmFieWxvbk5vZGUgb2Ygbm9kZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2xURk5vZGVJbmRleCA9IHRoaXMuX25vZGVNYXBbYmFieWxvbk5vZGUudW5pcXVlSWRdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZ2xURk5vZGVJbmRleCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnbFRGTm9kZSA9IHRoaXMuX25vZGVzW2dsVEZOb2RlSW5kZXhdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChiYWJ5bG9uTm9kZS5tZXRhZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9vcHRpb25zLm1ldGFkYXRhU2VsZWN0b3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2xURk5vZGUuZXh0cmFzID0gdGhpcy5fb3B0aW9ucy5tZXRhZGF0YVNlbGVjdG9yKGJhYnlsb25Ob2RlLm1ldGFkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGJhYnlsb25Ob2RlLm1ldGFkYXRhLmdsdGYpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2xURk5vZGUuZXh0cmFzID0gYmFieWxvbk5vZGUubWV0YWRhdGEuZ2x0Zi5leHRyYXM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChiYWJ5bG9uTm9kZSBpbnN0YW5jZW9mIENhbWVyYSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsVEZOb2RlLmNhbWVyYSA9IGNhbWVyYU1hcC5nZXQoYmFieWxvbk5vZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9vcHRpb25zLnNob3VsZEV4cG9ydE5vZGUgJiYgIXRoaXMuX29wdGlvbnMuc2hvdWxkRXhwb3J0Tm9kZShiYWJ5bG9uTm9kZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUb29scy5Mb2coXCJPbWl0dGluZyBcIiArIGJhYnlsb25Ob2RlLm5hbWUgKyBcIiBmcm9tIHNjZW5lLlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFiYWJ5bG9uTm9kZS5wYXJlbnQgJiYgIXRoaXMuX2JhYnlsb25TY2VuZS51c2VSaWdodEhhbmRlZFN5c3RlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb252ZXJ0Tm9kZUhhbmRlZG5lc3MoZ2xURk5vZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFiYWJ5bG9uTm9kZS5wYXJlbnQgfHwgcmVtb3ZlZFJvb3ROb2Rlcy5oYXMoYmFieWxvbk5vZGUucGFyZW50KSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY2VuZS5ub2Rlcy5wdXNoKGdsVEZOb2RlSW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYmFieWxvbk5vZGUgaW5zdGFuY2VvZiBNZXNoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJhYnlsb25Ob2RlLnNrZWxldG9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsVEZOb2RlLnNraW4gPSBza2luTWFwW2JhYnlsb25Ob2RlLnNrZWxldG9uLnVuaXF1ZUlkXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlyZWN0RGVzY2VuZGVudHMgPSBiYWJ5bG9uTm9kZS5nZXREZXNjZW5kYW50cyh0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZ2xURk5vZGUuY2hpbGRyZW4gJiYgZGlyZWN0RGVzY2VuZGVudHMgJiYgZGlyZWN0RGVzY2VuZGVudHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY2hpbGRyZW46IG51bWJlcltdID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBkZXNjZW5kZW50IG9mIGRpcmVjdERlc2NlbmRlbnRzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9ub2RlTWFwW2Rlc2NlbmRlbnQudW5pcXVlSWRdICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuLnB1c2godGhpcy5fbm9kZU1hcFtkZXNjZW5kZW50LnVuaXF1ZUlkXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNoaWxkcmVuLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnbFRGTm9kZS5jaGlsZHJlbiA9IGNoaWxkcmVuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2NlbmUubm9kZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NjZW5lcy5wdXNoKHNjZW5lKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXR0aW5nIHRoZSBub2RlcyBhbmQgbWF0ZXJpYWxzIHRoYXQgd291bGQgYmUgZXhwb3J0ZWQuXHJcbiAgICAgKiBAcGFyYW0gbm9kZXMgQmFieWxvbiB0cmFuc2Zvcm0gbm9kZXNcclxuICAgICAqIEByZXR1cm5zIFNldCBvZiBtYXRlcmlhbHMgd2hpY2ggd291bGQgYmUgZXhwb3J0ZWQuXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgX2dldEV4cG9ydE5vZGVzKG5vZGVzOiBOb2RlW10pOiBbTm9kZVtdLCBTZXQ8TWF0ZXJpYWw+XSB7XHJcbiAgICAgICAgY29uc3QgZXhwb3J0Tm9kZXM6IE5vZGVbXSA9IFtdO1xyXG4gICAgICAgIGNvbnN0IGV4cG9ydE1hdGVyaWFsczogU2V0PE1hdGVyaWFsPiA9IG5ldyBTZXQ8TWF0ZXJpYWw+KCk7XHJcblxyXG4gICAgICAgIGZvciAoY29uc3QgYmFieWxvbk5vZGUgb2Ygbm9kZXMpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLl9vcHRpb25zLnNob3VsZEV4cG9ydE5vZGUgfHwgdGhpcy5fb3B0aW9ucy5zaG91bGRFeHBvcnROb2RlKGJhYnlsb25Ob2RlKSkge1xyXG4gICAgICAgICAgICAgICAgZXhwb3J0Tm9kZXMucHVzaChiYWJ5bG9uTm9kZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgYmFieWxvbk1lc2ggPSBiYWJ5bG9uTm9kZSBhcyBBYnN0cmFjdE1lc2g7XHJcbiAgICAgICAgICAgICAgICBpZiAoYmFieWxvbk1lc2guc3ViTWVzaGVzICYmIGJhYnlsb25NZXNoLnN1Yk1lc2hlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbWF0ZXJpYWwgPSBiYWJ5bG9uTWVzaC5tYXRlcmlhbCB8fCBiYWJ5bG9uTWVzaC5nZXRTY2VuZSgpLmRlZmF1bHRNYXRlcmlhbDtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobWF0ZXJpYWwgaW5zdGFuY2VvZiBNdWx0aU1hdGVyaWFsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3Qgc3ViTWF0ZXJpYWwgb2YgbWF0ZXJpYWwuc3ViTWF0ZXJpYWxzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3ViTWF0ZXJpYWwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHBvcnRNYXRlcmlhbHMuYWRkKHN1Yk1hdGVyaWFsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4cG9ydE1hdGVyaWFscy5hZGQobWF0ZXJpYWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGBFeGNsdWRpbmcgbm9kZSAke2JhYnlsb25Ob2RlLm5hbWV9YDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIFtleHBvcnROb2RlcywgZXhwb3J0TWF0ZXJpYWxzXTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgYSBtYXBwaW5nIG9mIE5vZGUgdW5pcXVlIGlkIHRvIG5vZGUgaW5kZXggYW5kIGhhbmRsZXMgYW5pbWF0aW9uc1xyXG4gICAgICogQHBhcmFtIG5vZGVzIEJhYnlsb24gdHJhbnNmb3JtIG5vZGVzXHJcbiAgICAgKiBAcGFyYW0gYmluYXJ5V3JpdGVyIEJ1ZmZlciB0byB3cml0ZSBiaW5hcnkgZGF0YSB0b1xyXG4gICAgICogQHJldHVybnMgTm9kZSBtYXBwaW5nIG9mIHVuaXF1ZSBpZCB0byBpbmRleFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIF9jcmVhdGVOb2RlTWFwQW5kQW5pbWF0aW9uc0FzeW5jKG5vZGVzOiBOb2RlW10sIGJpbmFyeVdyaXRlcjogX0JpbmFyeVdyaXRlcik6IFByb21pc2U8eyBba2V5OiBudW1iZXJdOiBudW1iZXIgfT4ge1xyXG4gICAgICAgIGxldCBwcm9taXNlQ2hhaW4gPSBQcm9taXNlLnJlc29sdmUoKTtcclxuICAgICAgICBjb25zdCBub2RlTWFwOiB7IFtrZXk6IG51bWJlcl06IG51bWJlciB9ID0ge307XHJcbiAgICAgICAgbGV0IG5vZGVJbmRleDogbnVtYmVyO1xyXG4gICAgICAgIGNvbnN0IHJ1bnRpbWVHTFRGQW5pbWF0aW9uOiBJQW5pbWF0aW9uID0ge1xyXG4gICAgICAgICAgICBuYW1lOiBcInJ1bnRpbWUgYW5pbWF0aW9uc1wiLFxyXG4gICAgICAgICAgICBjaGFubmVsczogW10sXHJcbiAgICAgICAgICAgIHNhbXBsZXJzOiBbXSxcclxuICAgICAgICB9O1xyXG4gICAgICAgIGNvbnN0IGlkbGVHTFRGQW5pbWF0aW9uczogSUFuaW1hdGlvbltdID0gW107XHJcblxyXG4gICAgICAgIGZvciAoY29uc3QgYmFieWxvbk5vZGUgb2Ygbm9kZXMpIHtcclxuICAgICAgICAgICAgcHJvbWlzZUNoYWluID0gcHJvbWlzZUNoYWluLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NyZWF0ZU5vZGVBc3luYyhiYWJ5bG9uTm9kZSwgYmluYXJ5V3JpdGVyKS50aGVuKChub2RlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJvbWlzZSA9IHRoaXMuX2V4dGVuc2lvbnNQb3N0RXhwb3J0Tm9kZUFzeW5jKFwiY3JlYXRlTm9kZUFzeW5jXCIsIG5vZGUsIGJhYnlsb25Ob2RlLCBub2RlTWFwLCBiaW5hcnlXcml0ZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9taXNlID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgVG9vbHMuV2FybihgTm90IGV4cG9ydGluZyBub2RlICR7YmFieWxvbk5vZGUubmFtZX1gKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwcm9taXNlLnRoZW4oKG5vZGUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX25vZGVzLnB1c2gobm9kZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlSW5kZXggPSB0aGlzLl9ub2Rlcy5sZW5ndGggLSAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZU1hcFtiYWJ5bG9uTm9kZS51bmlxdWVJZF0gPSBub2RlSW5kZXg7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLl9iYWJ5bG9uU2NlbmUuYW5pbWF0aW9uR3JvdXBzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9HTFRGQW5pbWF0aW9uLl9DcmVhdGVNb3JwaFRhcmdldEFuaW1hdGlvbkZyb21Nb3JwaFRhcmdldEFuaW1hdGlvbnMoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhYnlsb25Ob2RlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBydW50aW1lR0xURkFuaW1hdGlvbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWRsZUdMVEZBbmltYXRpb25zLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlTWFwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9ub2RlcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmluYXJ5V3JpdGVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9idWZmZXJWaWV3cyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fYWNjZXNzb3JzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9hbmltYXRpb25TYW1wbGVSYXRlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9vcHRpb25zLnNob3VsZEV4cG9ydEFuaW1hdGlvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJhYnlsb25Ob2RlLmFuaW1hdGlvbnMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9HTFRGQW5pbWF0aW9uLl9DcmVhdGVOb2RlQW5pbWF0aW9uRnJvbU5vZGVBbmltYXRpb25zKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFieWxvbk5vZGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBydW50aW1lR0xURkFuaW1hdGlvbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkbGVHTFRGQW5pbWF0aW9ucyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVNYXAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9ub2RlcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJpbmFyeVdyaXRlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2J1ZmZlclZpZXdzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fYWNjZXNzb3JzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fYW5pbWF0aW9uU2FtcGxlUmF0ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX29wdGlvbnMuc2hvdWxkRXhwb3J0QW5pbWF0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcHJvbWlzZUNoYWluLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAocnVudGltZUdMVEZBbmltYXRpb24uY2hhbm5lbHMubGVuZ3RoICYmIHJ1bnRpbWVHTFRGQW5pbWF0aW9uLnNhbXBsZXJzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYW5pbWF0aW9ucy5wdXNoKHJ1bnRpbWVHTFRGQW5pbWF0aW9uKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZGxlR0xURkFuaW1hdGlvbnMuZm9yRWFjaCgoaWRsZUdMVEZBbmltYXRpb24pID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChpZGxlR0xURkFuaW1hdGlvbi5jaGFubmVscy5sZW5ndGggJiYgaWRsZUdMVEZBbmltYXRpb24uc2FtcGxlcnMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYW5pbWF0aW9ucy5wdXNoKGlkbGVHTFRGQW5pbWF0aW9uKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5fYmFieWxvblNjZW5lLmFuaW1hdGlvbkdyb3Vwcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIF9HTFRGQW5pbWF0aW9uLl9DcmVhdGVOb2RlQW5kTW9ycGhBbmltYXRpb25Gcm9tQW5pbWF0aW9uR3JvdXBzKFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2JhYnlsb25TY2VuZSxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9hbmltYXRpb25zLFxyXG4gICAgICAgICAgICAgICAgICAgIG5vZGVNYXAsXHJcbiAgICAgICAgICAgICAgICAgICAgYmluYXJ5V3JpdGVyLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2J1ZmZlclZpZXdzLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2FjY2Vzc29ycyxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9hbmltYXRpb25TYW1wbGVSYXRlLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX29wdGlvbnMuc2hvdWxkRXhwb3J0QW5pbWF0aW9uXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbm9kZU1hcDtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgYSBnbFRGIG5vZGUgZnJvbSBhIEJhYnlsb24gbWVzaFxyXG4gICAgICogQHBhcmFtIGJhYnlsb25Ob2RlIFNvdXJjZSBCYWJ5bG9uIG1lc2hcclxuICAgICAqIEBwYXJhbSBiaW5hcnlXcml0ZXIgQnVmZmVyIGZvciBzdG9yaW5nIGdlb21ldHJ5IGRhdGFcclxuICAgICAqIEByZXR1cm5zIGdsVEYgbm9kZVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIF9jcmVhdGVOb2RlQXN5bmMoYmFieWxvbk5vZGU6IE5vZGUsIGJpbmFyeVdyaXRlcjogX0JpbmFyeVdyaXRlcik6IFByb21pc2U8SU5vZGU+IHtcclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgIC8vIGNyZWF0ZSBub2RlIHRvIGhvbGQgdHJhbnNsYXRpb24vcm90YXRpb24vc2NhbGUgYW5kIHRoZSBtZXNoXHJcbiAgICAgICAgICAgIGNvbnN0IG5vZGU6IElOb2RlID0ge307XHJcbiAgICAgICAgICAgIC8vIGNyZWF0ZSBtZXNoXHJcbiAgICAgICAgICAgIGNvbnN0IG1lc2g6IElNZXNoID0geyBwcmltaXRpdmVzOiBbXSB9O1xyXG5cclxuICAgICAgICAgICAgaWYgKGJhYnlsb25Ob2RlLm5hbWUpIHtcclxuICAgICAgICAgICAgICAgIG5vZGUubmFtZSA9IGJhYnlsb25Ob2RlLm5hbWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChiYWJ5bG9uTm9kZSBpbnN0YW5jZW9mIFRyYW5zZm9ybU5vZGUpIHtcclxuICAgICAgICAgICAgICAgIC8vIFNldCB0cmFuc2Zvcm1hdGlvblxyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2V0Tm9kZVRyYW5zZm9ybWF0aW9uKG5vZGUsIGJhYnlsb25Ob2RlKTtcclxuICAgICAgICAgICAgICAgIGlmIChiYWJ5bG9uTm9kZSBpbnN0YW5jZW9mIE1lc2gpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBtb3JwaFRhcmdldE1hbmFnZXIgPSBiYWJ5bG9uTm9kZS5tb3JwaFRhcmdldE1hbmFnZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1vcnBoVGFyZ2V0TWFuYWdlciAmJiBtb3JwaFRhcmdldE1hbmFnZXIubnVtVGFyZ2V0cyA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzaC53ZWlnaHRzID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbW9ycGhUYXJnZXRNYW5hZ2VyLm51bVRhcmdldHM7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzaC53ZWlnaHRzLnB1c2gobW9ycGhUYXJnZXRNYW5hZ2VyLmdldFRhcmdldChpKS5pbmZsdWVuY2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NldFByaW1pdGl2ZUF0dHJpYnV0ZXNBc3luYyhtZXNoLCBiYWJ5bG9uTm9kZSwgYmluYXJ5V3JpdGVyKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobWVzaC5wcmltaXRpdmVzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9tZXNoZXMucHVzaChtZXNoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5tZXNoID0gdGhpcy5fbWVzaGVzLmxlbmd0aCAtIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBub2RlO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYmFieWxvbk5vZGUgaW5zdGFuY2VvZiBDYW1lcmEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NldENhbWVyYVRyYW5zZm9ybWF0aW9uKG5vZGUsIGJhYnlsb25Ob2RlKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBub2RlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5vZGU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgYSBnbFRGIHNraW4gZnJvbSBhIEJhYnlsb24gc2tlbGV0b25cclxuICAgICAqIEBwYXJhbSBub2RlTWFwIEJhYnlsb24gdHJhbnNmb3JtIG5vZGVzXHJcbiAgICAgKiBAcGFyYW0gYmluYXJ5V3JpdGVyIEJ1ZmZlciB0byB3cml0ZSBiaW5hcnkgZGF0YSB0b1xyXG4gICAgICogQHJldHVybnMgTm9kZSBtYXBwaW5nIG9mIHVuaXF1ZSBpZCB0byBpbmRleFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIF9jcmVhdGVTa2luc0FzeW5jKG5vZGVNYXA6IHsgW2tleTogbnVtYmVyXTogbnVtYmVyIH0sIGJpbmFyeVdyaXRlcjogX0JpbmFyeVdyaXRlcik6IFByb21pc2U8eyBba2V5OiBudW1iZXJdOiBudW1iZXIgfT4ge1xyXG4gICAgICAgIGNvbnN0IHByb21pc2VDaGFpbiA9IFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgICAgIGNvbnN0IHNraW5NYXA6IHsgW2tleTogbnVtYmVyXTogbnVtYmVyIH0gPSB7fTtcclxuICAgICAgICBmb3IgKGNvbnN0IHNrZWxldG9uIG9mIHRoaXMuX2JhYnlsb25TY2VuZS5za2VsZXRvbnMpIHtcclxuICAgICAgICAgICAgaWYgKHNrZWxldG9uLmJvbmVzLmxlbmd0aCA8PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBjcmVhdGUgc2tpblxyXG4gICAgICAgICAgICBjb25zdCBza2luOiBJU2tpbiA9IHsgam9pbnRzOiBbXSB9O1xyXG4gICAgICAgICAgICBjb25zdCBpbnZlcnNlQmluZE1hdHJpY2VzOiBNYXRyaXhbXSA9IFtdO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgYm9uZUluZGV4TWFwOiB7IFtpbmRleDogbnVtYmVyXTogQm9uZSB9ID0ge307XHJcbiAgICAgICAgICAgIGxldCBtYXhCb25lSW5kZXggPSAtMTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBza2VsZXRvbi5ib25lcy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYm9uZSA9IHNrZWxldG9uLmJvbmVzW2ldO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYm9uZUluZGV4ID0gYm9uZS5nZXRJbmRleCgpID8/IGk7XHJcbiAgICAgICAgICAgICAgICBpZiAoYm9uZUluZGV4ICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGJvbmVJbmRleE1hcFtib25lSW5kZXhdID0gYm9uZTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYm9uZUluZGV4ID4gbWF4Qm9uZUluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1heEJvbmVJbmRleCA9IGJvbmVJbmRleDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGJvbmVJbmRleCA9IDA7IGJvbmVJbmRleCA8PSBtYXhCb25lSW5kZXg7ICsrYm9uZUluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBib25lID0gYm9uZUluZGV4TWFwW2JvbmVJbmRleF07XHJcbiAgICAgICAgICAgICAgICBpbnZlcnNlQmluZE1hdHJpY2VzLnB1c2goYm9uZS5nZXRJbnZlcnRlZEFic29sdXRlVHJhbnNmb3JtKCkpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IHRyYW5zZm9ybU5vZGUgPSBib25lLmdldFRyYW5zZm9ybU5vZGUoKTtcclxuICAgICAgICAgICAgICAgIGlmICh0cmFuc2Zvcm1Ob2RlICYmIG5vZGVNYXBbdHJhbnNmb3JtTm9kZS51bmlxdWVJZF0gIT09IG51bGwgJiYgbm9kZU1hcFt0cmFuc2Zvcm1Ob2RlLnVuaXF1ZUlkXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2tpbi5qb2ludHMucHVzaChub2RlTWFwW3RyYW5zZm9ybU5vZGUudW5pcXVlSWRdKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgVG9vbHMuV2FybihcIkV4cG9ydGluZyBhIGJvbmUgd2l0aG91dCBhIGxpbmtlZCB0cmFuc2Zvcm0gbm9kZSBpcyBjdXJyZW50bHkgdW5zdXBwb3J0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChza2luLmpvaW50cy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBjcmVhdGUgYnVmZmVyIHZpZXcgZm9yIGludmVyc2UgYmluZCBtYXRyaWNlc1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYnl0ZVN0cmlkZSA9IDY0OyAvLyA0IHggNCBtYXRyaXggb2YgMzIgYml0IGZsb2F0XHJcbiAgICAgICAgICAgICAgICBjb25zdCBieXRlTGVuZ3RoID0gaW52ZXJzZUJpbmRNYXRyaWNlcy5sZW5ndGggKiBieXRlU3RyaWRlO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYnVmZmVyVmlld09mZnNldCA9IGJpbmFyeVdyaXRlci5nZXRCeXRlT2Zmc2V0KCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBidWZmZXJWaWV3ID0gX0dMVEZVdGlsaXRpZXMuX0NyZWF0ZUJ1ZmZlclZpZXcoMCwgYnVmZmVyVmlld09mZnNldCwgYnl0ZUxlbmd0aCwgdW5kZWZpbmVkLCBcIkludmVyc2VCaW5kTWF0cmljZXNcIiArIFwiIC0gXCIgKyBza2VsZXRvbi5uYW1lKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2J1ZmZlclZpZXdzLnB1c2goYnVmZmVyVmlldyk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBidWZmZXJWaWV3SW5kZXggPSB0aGlzLl9idWZmZXJWaWV3cy5sZW5ndGggLSAxO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYmluZE1hdHJpeEFjY2Vzc29yID0gX0dMVEZVdGlsaXRpZXMuX0NyZWF0ZUFjY2Vzc29yKFxyXG4gICAgICAgICAgICAgICAgICAgIGJ1ZmZlclZpZXdJbmRleCxcclxuICAgICAgICAgICAgICAgICAgICBcIkludmVyc2VCaW5kTWF0cmljZXNcIiArIFwiIC0gXCIgKyBza2VsZXRvbi5uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIEFjY2Vzc29yVHlwZS5NQVQ0LFxyXG4gICAgICAgICAgICAgICAgICAgIEFjY2Vzc29yQ29tcG9uZW50VHlwZS5GTE9BVCxcclxuICAgICAgICAgICAgICAgICAgICBpbnZlcnNlQmluZE1hdHJpY2VzLmxlbmd0aCxcclxuICAgICAgICAgICAgICAgICAgICBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgbnVsbFxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGludmVyc2VCaW5kQWNjZXNzb3JJbmRleCA9IHRoaXMuX2FjY2Vzc29ycy5wdXNoKGJpbmRNYXRyaXhBY2Nlc3NvcikgLSAxO1xyXG4gICAgICAgICAgICAgICAgc2tpbi5pbnZlcnNlQmluZE1hdHJpY2VzID0gaW52ZXJzZUJpbmRBY2Nlc3NvckluZGV4O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2tpbnMucHVzaChza2luKTtcclxuICAgICAgICAgICAgICAgIHNraW5NYXBbc2tlbGV0b24udW5pcXVlSWRdID0gdGhpcy5fc2tpbnMubGVuZ3RoIC0gMTtcclxuXHJcbiAgICAgICAgICAgICAgICBpbnZlcnNlQmluZE1hdHJpY2VzLmZvckVhY2goKG1hdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIG1hdC5tLmZvckVhY2goKGNlbGw6IG51bWJlcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBiaW5hcnlXcml0ZXIuc2V0RmxvYXQzMihjZWxsKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBwcm9taXNlQ2hhaW4udGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBza2luTWFwO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogQGludGVybmFsXHJcbiAqXHJcbiAqIFN0b3JlcyBnbFRGIGJpbmFyeSBkYXRhLiAgSWYgdGhlIGFycmF5IGJ1ZmZlciBieXRlIGxlbmd0aCBpcyBleGNlZWRlZCwgaXQgZG91YmxlcyBpbiBzaXplIGR5bmFtaWNhbGx5XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgX0JpbmFyeVdyaXRlciB7XHJcbiAgICAvKipcclxuICAgICAqIEFycmF5IGJ1ZmZlciB3aGljaCBzdG9yZXMgYWxsIGJpbmFyeSBkYXRhXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgX2FycmF5QnVmZmVyOiBBcnJheUJ1ZmZlcjtcclxuICAgIC8qKlxyXG4gICAgICogVmlldyBvZiB0aGUgYXJyYXkgYnVmZmVyXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgX2RhdGFWaWV3OiBEYXRhVmlldztcclxuICAgIC8qKlxyXG4gICAgICogYnl0ZSBvZmZzZXQgb2YgZGF0YSBpbiBhcnJheSBidWZmZXJcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBfYnl0ZU9mZnNldDogbnVtYmVyO1xyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplIGJpbmFyeSB3cml0ZXIgd2l0aCBhbiBpbml0aWFsIGJ5dGUgbGVuZ3RoXHJcbiAgICAgKiBAcGFyYW0gYnl0ZUxlbmd0aCBJbml0aWFsIGJ5dGUgbGVuZ3RoIG9mIHRoZSBhcnJheSBidWZmZXJcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoYnl0ZUxlbmd0aDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fYXJyYXlCdWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoYnl0ZUxlbmd0aCk7XHJcbiAgICAgICAgdGhpcy5fZGF0YVZpZXcgPSBuZXcgRGF0YVZpZXcodGhpcy5fYXJyYXlCdWZmZXIpO1xyXG4gICAgICAgIHRoaXMuX2J5dGVPZmZzZXQgPSAwO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXNpemUgdGhlIGFycmF5IGJ1ZmZlciB0byB0aGUgc3BlY2lmaWVkIGJ5dGUgbGVuZ3RoXHJcbiAgICAgKiBAcGFyYW0gYnl0ZUxlbmd0aCBUaGUgbmV3IGJ5dGUgbGVuZ3RoXHJcbiAgICAgKiBAcmV0dXJucyBUaGUgcmVzaXplZCBhcnJheSBidWZmZXJcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBfcmVzaXplQnVmZmVyKGJ5dGVMZW5ndGg6IG51bWJlcik6IEFycmF5QnVmZmVyIHtcclxuICAgICAgICBjb25zdCBuZXdCdWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoYnl0ZUxlbmd0aCk7XHJcbiAgICAgICAgY29uc3QgY29weU9sZEJ1ZmZlclNpemUgPSBNYXRoLm1pbih0aGlzLl9hcnJheUJ1ZmZlci5ieXRlTGVuZ3RoLCBieXRlTGVuZ3RoKTtcclxuICAgICAgICBjb25zdCBvbGRVaW50OEFycmF5ID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5fYXJyYXlCdWZmZXIsIDAsIGNvcHlPbGRCdWZmZXJTaXplKTtcclxuICAgICAgICBjb25zdCBuZXdVaW50OEFycmF5ID0gbmV3IFVpbnQ4QXJyYXkobmV3QnVmZmVyKTtcclxuICAgICAgICBuZXdVaW50OEFycmF5LnNldChvbGRVaW50OEFycmF5LCAwKTtcclxuICAgICAgICB0aGlzLl9hcnJheUJ1ZmZlciA9IG5ld0J1ZmZlcjtcclxuICAgICAgICB0aGlzLl9kYXRhVmlldyA9IG5ldyBEYXRhVmlldyh0aGlzLl9hcnJheUJ1ZmZlcik7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXdCdWZmZXI7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEdldCBhbiBhcnJheSBidWZmZXIgd2l0aCB0aGUgbGVuZ3RoIG9mIHRoZSBieXRlIG9mZnNldFxyXG4gICAgICogQHJldHVybnMgQXJyYXlCdWZmZXIgcmVzaXplZCB0byB0aGUgYnl0ZSBvZmZzZXRcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldEFycmF5QnVmZmVyKCk6IEFycmF5QnVmZmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcmVzaXplQnVmZmVyKHRoaXMuZ2V0Qnl0ZU9mZnNldCgpKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogR2V0IHRoZSBieXRlIG9mZnNldCBvZiB0aGUgYXJyYXkgYnVmZmVyXHJcbiAgICAgKiBAcmV0dXJucyBieXRlIG9mZnNldFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0Qnl0ZU9mZnNldCgpOiBudW1iZXIge1xyXG4gICAgICAgIGlmICh0aGlzLl9ieXRlT2Zmc2V0ID09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJCeXRlIG9mZnNldCBpcyB1bmRlZmluZWQhXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fYnl0ZU9mZnNldDtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogU3RvcmVzIGFuIFVJbnQ4IGluIHRoZSBhcnJheSBidWZmZXJcclxuICAgICAqIEBwYXJhbSBlbnRyeVxyXG4gICAgICogQHBhcmFtIGJ5dGVPZmZzZXQgSWYgZGVmaW5lZCwgc3BlY2lmaWVzIHdoZXJlIHRvIHNldCB0aGUgdmFsdWUgYXMgYW4gb2Zmc2V0LlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0VUludDgoZW50cnk6IG51bWJlciwgYnl0ZU9mZnNldD86IG51bWJlcikge1xyXG4gICAgICAgIGlmIChieXRlT2Zmc2V0ICE9IG51bGwpIHtcclxuICAgICAgICAgICAgaWYgKGJ5dGVPZmZzZXQgPCB0aGlzLl9ieXRlT2Zmc2V0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9kYXRhVmlldy5zZXRVaW50OChieXRlT2Zmc2V0LCBlbnRyeSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBUb29scy5FcnJvcihcIkJpbmFyeVdyaXRlcjogYnl0ZW9mZnNldCBpcyBncmVhdGVyIHRoYW4gdGhlIGN1cnJlbnQgYmluYXJ5IGJ1ZmZlciBsZW5ndGghXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2J5dGVPZmZzZXQgKyAxID4gdGhpcy5fYXJyYXlCdWZmZXIuYnl0ZUxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVzaXplQnVmZmVyKHRoaXMuX2FycmF5QnVmZmVyLmJ5dGVMZW5ndGggKiAyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9kYXRhVmlldy5zZXRVaW50OCh0aGlzLl9ieXRlT2Zmc2V0LCBlbnRyeSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2J5dGVPZmZzZXQgKz0gMTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTdG9yZXMgYW4gVUludDE2IGluIHRoZSBhcnJheSBidWZmZXJcclxuICAgICAqIEBwYXJhbSBlbnRyeVxyXG4gICAgICogQHBhcmFtIGJ5dGVPZmZzZXQgSWYgZGVmaW5lZCwgc3BlY2lmaWVzIHdoZXJlIHRvIHNldCB0aGUgdmFsdWUgYXMgYW4gb2Zmc2V0LlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0VUludDE2KGVudHJ5OiBudW1iZXIsIGJ5dGVPZmZzZXQ/OiBudW1iZXIpIHtcclxuICAgICAgICBpZiAoYnl0ZU9mZnNldCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIGlmIChieXRlT2Zmc2V0IDwgdGhpcy5fYnl0ZU9mZnNldCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZGF0YVZpZXcuc2V0VWludDE2KGJ5dGVPZmZzZXQsIGVudHJ5LCB0cnVlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIFRvb2xzLkVycm9yKFwiQmluYXJ5V3JpdGVyOiBieXRlb2Zmc2V0IGlzIGdyZWF0ZXIgdGhhbiB0aGUgY3VycmVudCBiaW5hcnkgYnVmZmVyIGxlbmd0aCFcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fYnl0ZU9mZnNldCArIDIgPiB0aGlzLl9hcnJheUJ1ZmZlci5ieXRlTGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZXNpemVCdWZmZXIodGhpcy5fYXJyYXlCdWZmZXIuYnl0ZUxlbmd0aCAqIDIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX2RhdGFWaWV3LnNldFVpbnQxNih0aGlzLl9ieXRlT2Zmc2V0LCBlbnRyeSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2J5dGVPZmZzZXQgKz0gMjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXRzIGFuIFVJbnQzMiBpbiB0aGUgYXJyYXkgYnVmZmVyXHJcbiAgICAgKiBAcGFyYW0gYnl0ZU9mZnNldCBJZiBkZWZpbmVkLCBzcGVjaWZpZXMgd2hlcmUgdG8gc2V0IHRoZSB2YWx1ZSBhcyBhbiBvZmZzZXQuXHJcbiAgICAgKiBAcmV0dXJucyBlbnRyeVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0VUludDMyKGJ5dGVPZmZzZXQ6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICAgICAgaWYgKGJ5dGVPZmZzZXQgPCB0aGlzLl9ieXRlT2Zmc2V0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9kYXRhVmlldy5nZXRVaW50MzIoYnl0ZU9mZnNldCwgdHJ1ZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgVG9vbHMuRXJyb3IoXCJCaW5hcnlXcml0ZXI6IGJ5dGVvZmZzZXQgaXMgZ3JlYXRlciB0aGFuIHRoZSBjdXJyZW50IGJpbmFyeSBidWZmZXIgbGVuZ3RoIVwiKTtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQmluYXJ5V3JpdGVyOiBieXRlb2Zmc2V0IGlzIGdyZWF0ZXIgdGhhbiB0aGUgY3VycmVudCBiaW5hcnkgYnVmZmVyIGxlbmd0aCFcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRWZWN0b3IzRmxvYXQzMkZyb21SZWYodmVjdG9yMzogVmVjdG9yMywgYnl0ZU9mZnNldDogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKGJ5dGVPZmZzZXQgKyA4ID4gdGhpcy5fYnl0ZU9mZnNldCkge1xyXG4gICAgICAgICAgICBUb29scy5FcnJvcihgQmluYXJ5V3JpdGVyOiBieXRlb2Zmc2V0IGlzIGdyZWF0ZXIgdGhhbiB0aGUgY3VycmVudCBiaW5hcnkgYnVmZmVyIGxlbmd0aCFgKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2ZWN0b3IzLnggPSB0aGlzLl9kYXRhVmlldy5nZXRGbG9hdDMyKGJ5dGVPZmZzZXQsIHRydWUpO1xyXG4gICAgICAgICAgICB2ZWN0b3IzLnkgPSB0aGlzLl9kYXRhVmlldy5nZXRGbG9hdDMyKGJ5dGVPZmZzZXQgKyA0LCB0cnVlKTtcclxuICAgICAgICAgICAgdmVjdG9yMy56ID0gdGhpcy5fZGF0YVZpZXcuZ2V0RmxvYXQzMihieXRlT2Zmc2V0ICsgOCwgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRWZWN0b3IzRmxvYXQzMkZyb21SZWYodmVjdG9yMzogVmVjdG9yMywgYnl0ZU9mZnNldDogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKGJ5dGVPZmZzZXQgKyA4ID4gdGhpcy5fYnl0ZU9mZnNldCkge1xyXG4gICAgICAgICAgICBUb29scy5FcnJvcihgQmluYXJ5V3JpdGVyOiBieXRlb2Zmc2V0IGlzIGdyZWF0ZXIgdGhhbiB0aGUgY3VycmVudCBiaW5hcnkgYnVmZmVyIGxlbmd0aCFgKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9kYXRhVmlldy5zZXRGbG9hdDMyKGJ5dGVPZmZzZXQsIHZlY3RvcjMueCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2RhdGFWaWV3LnNldEZsb2F0MzIoYnl0ZU9mZnNldCArIDQsIHZlY3RvcjMueSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2RhdGFWaWV3LnNldEZsb2F0MzIoYnl0ZU9mZnNldCArIDgsIHZlY3RvcjMueiwgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRWZWN0b3I0RmxvYXQzMkZyb21SZWYodmVjdG9yNDogVmVjdG9yNCwgYnl0ZU9mZnNldDogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKGJ5dGVPZmZzZXQgKyAxMiA+IHRoaXMuX2J5dGVPZmZzZXQpIHtcclxuICAgICAgICAgICAgVG9vbHMuRXJyb3IoYEJpbmFyeVdyaXRlcjogYnl0ZW9mZnNldCBpcyBncmVhdGVyIHRoYW4gdGhlIGN1cnJlbnQgYmluYXJ5IGJ1ZmZlciBsZW5ndGghYCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmVjdG9yNC54ID0gdGhpcy5fZGF0YVZpZXcuZ2V0RmxvYXQzMihieXRlT2Zmc2V0LCB0cnVlKTtcclxuICAgICAgICAgICAgdmVjdG9yNC55ID0gdGhpcy5fZGF0YVZpZXcuZ2V0RmxvYXQzMihieXRlT2Zmc2V0ICsgNCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIHZlY3RvcjQueiA9IHRoaXMuX2RhdGFWaWV3LmdldEZsb2F0MzIoYnl0ZU9mZnNldCArIDgsIHRydWUpO1xyXG4gICAgICAgICAgICB2ZWN0b3I0LncgPSB0aGlzLl9kYXRhVmlldy5nZXRGbG9hdDMyKGJ5dGVPZmZzZXQgKyAxMiwgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRWZWN0b3I0RmxvYXQzMkZyb21SZWYodmVjdG9yNDogVmVjdG9yNCwgYnl0ZU9mZnNldDogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKGJ5dGVPZmZzZXQgKyAxMiA+IHRoaXMuX2J5dGVPZmZzZXQpIHtcclxuICAgICAgICAgICAgVG9vbHMuRXJyb3IoYEJpbmFyeVdyaXRlcjogYnl0ZW9mZnNldCBpcyBncmVhdGVyIHRoYW4gdGhlIGN1cnJlbnQgYmluYXJ5IGJ1ZmZlciBsZW5ndGghYCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fZGF0YVZpZXcuc2V0RmxvYXQzMihieXRlT2Zmc2V0LCB2ZWN0b3I0LngsIHRydWUpO1xyXG4gICAgICAgICAgICB0aGlzLl9kYXRhVmlldy5zZXRGbG9hdDMyKGJ5dGVPZmZzZXQgKyA0LCB2ZWN0b3I0LnksIHRydWUpO1xyXG4gICAgICAgICAgICB0aGlzLl9kYXRhVmlldy5zZXRGbG9hdDMyKGJ5dGVPZmZzZXQgKyA4LCB2ZWN0b3I0LnosIHRydWUpO1xyXG4gICAgICAgICAgICB0aGlzLl9kYXRhVmlldy5zZXRGbG9hdDMyKGJ5dGVPZmZzZXQgKyAxMiwgdmVjdG9yNC53LCB0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFN0b3JlcyBhIEZsb2F0MzIgaW4gdGhlIGFycmF5IGJ1ZmZlclxyXG4gICAgICogQHBhcmFtIGVudHJ5XHJcbiAgICAgKiBAcGFyYW0gYnl0ZU9mZnNldFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0RmxvYXQzMihlbnRyeTogbnVtYmVyLCBieXRlT2Zmc2V0PzogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKGlzTmFOKGVudHJ5KSkge1xyXG4gICAgICAgICAgICBUb29scy5FcnJvcihcIkludmFsaWQgZGF0YSBiZWluZyB3cml0dGVuIVwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGJ5dGVPZmZzZXQgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICBpZiAoYnl0ZU9mZnNldCA8IHRoaXMuX2J5dGVPZmZzZXQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2RhdGFWaWV3LnNldEZsb2F0MzIoYnl0ZU9mZnNldCwgZW50cnksIHRydWUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgVG9vbHMuRXJyb3IoXCJCaW5hcnlXcml0ZXI6IGJ5dGVvZmZzZXQgaXMgZ3JlYXRlciB0aGFuIHRoZSBjdXJyZW50IGJpbmFyeSBsZW5ndGghXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLl9ieXRlT2Zmc2V0ICsgNCA+IHRoaXMuX2FycmF5QnVmZmVyLmJ5dGVMZW5ndGgpIHtcclxuICAgICAgICAgICAgdGhpcy5fcmVzaXplQnVmZmVyKHRoaXMuX2FycmF5QnVmZmVyLmJ5dGVMZW5ndGggKiAyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fZGF0YVZpZXcuc2V0RmxvYXQzMih0aGlzLl9ieXRlT2Zmc2V0LCBlbnRyeSwgdHJ1ZSk7XHJcbiAgICAgICAgdGhpcy5fYnl0ZU9mZnNldCArPSA0O1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBTdG9yZXMgYW4gVUludDMyIGluIHRoZSBhcnJheSBidWZmZXJcclxuICAgICAqIEBwYXJhbSBlbnRyeVxyXG4gICAgICogQHBhcmFtIGJ5dGVPZmZzZXQgSWYgZGVmaW5lZCwgc3BlY2lmaWVzIHdoZXJlIHRvIHNldCB0aGUgdmFsdWUgYXMgYW4gb2Zmc2V0LlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0VUludDMyKGVudHJ5OiBudW1iZXIsIGJ5dGVPZmZzZXQ/OiBudW1iZXIpIHtcclxuICAgICAgICBpZiAoYnl0ZU9mZnNldCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIGlmIChieXRlT2Zmc2V0IDwgdGhpcy5fYnl0ZU9mZnNldCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZGF0YVZpZXcuc2V0VWludDMyKGJ5dGVPZmZzZXQsIGVudHJ5LCB0cnVlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIFRvb2xzLkVycm9yKFwiQmluYXJ5V3JpdGVyOiBieXRlb2Zmc2V0IGlzIGdyZWF0ZXIgdGhhbiB0aGUgY3VycmVudCBiaW5hcnkgYnVmZmVyIGxlbmd0aCFcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fYnl0ZU9mZnNldCArIDQgPiB0aGlzLl9hcnJheUJ1ZmZlci5ieXRlTGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZXNpemVCdWZmZXIodGhpcy5fYXJyYXlCdWZmZXIuYnl0ZUxlbmd0aCAqIDIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX2RhdGFWaWV3LnNldFVpbnQzMih0aGlzLl9ieXRlT2Zmc2V0LCBlbnRyeSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2J5dGVPZmZzZXQgKz0gNDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFN0b3JlcyBhbiBJbnQxNiBpbiB0aGUgYXJyYXkgYnVmZmVyXHJcbiAgICAgKiBAcGFyYW0gZW50cnlcclxuICAgICAqIEBwYXJhbSBieXRlT2Zmc2V0IElmIGRlZmluZWQsIHNwZWNpZmllcyB3aGVyZSB0byBzZXQgdGhlIHZhbHVlIGFzIGFuIG9mZnNldC5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldEludDE2KGVudHJ5OiBudW1iZXIsIGJ5dGVPZmZzZXQ/OiBudW1iZXIpIHtcclxuICAgICAgICBpZiAoYnl0ZU9mZnNldCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIGlmIChieXRlT2Zmc2V0IDwgdGhpcy5fYnl0ZU9mZnNldCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZGF0YVZpZXcuc2V0SW50MTYoYnl0ZU9mZnNldCwgZW50cnksIHRydWUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgVG9vbHMuRXJyb3IoXCJCaW5hcnlXcml0ZXI6IGJ5dGVvZmZzZXQgaXMgZ3JlYXRlciB0aGFuIHRoZSBjdXJyZW50IGJpbmFyeSBidWZmZXIgbGVuZ3RoIVwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9ieXRlT2Zmc2V0ICsgMiA+IHRoaXMuX2FycmF5QnVmZmVyLmJ5dGVMZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3Jlc2l6ZUJ1ZmZlcih0aGlzLl9hcnJheUJ1ZmZlci5ieXRlTGVuZ3RoICogMik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fZGF0YVZpZXcuc2V0SW50MTYodGhpcy5fYnl0ZU9mZnNldCwgZW50cnksIHRydWUpO1xyXG4gICAgICAgICAgICB0aGlzLl9ieXRlT2Zmc2V0ICs9IDI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBTdG9yZXMgYSBieXRlIGluIHRoZSBhcnJheSBidWZmZXJcclxuICAgICAqIEBwYXJhbSBlbnRyeVxyXG4gICAgICogQHBhcmFtIGJ5dGVPZmZzZXQgSWYgZGVmaW5lZCwgc3BlY2lmaWVzIHdoZXJlIHRvIHNldCB0aGUgdmFsdWUgYXMgYW4gb2Zmc2V0LlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0Qnl0ZShlbnRyeTogbnVtYmVyLCBieXRlT2Zmc2V0PzogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKGJ5dGVPZmZzZXQgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICBpZiAoYnl0ZU9mZnNldCA8IHRoaXMuX2J5dGVPZmZzZXQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2RhdGFWaWV3LnNldEludDgoYnl0ZU9mZnNldCwgZW50cnkpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgVG9vbHMuRXJyb3IoXCJCaW5hcnlXcml0ZXI6IGJ5dGVvZmZzZXQgaXMgZ3JlYXRlciB0aGFuIHRoZSBjdXJyZW50IGJpbmFyeSBidWZmZXIgbGVuZ3RoIVwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9ieXRlT2Zmc2V0ICsgMSA+IHRoaXMuX2FycmF5QnVmZmVyLmJ5dGVMZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3Jlc2l6ZUJ1ZmZlcih0aGlzLl9hcnJheUJ1ZmZlci5ieXRlTGVuZ3RoICogMik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fZGF0YVZpZXcuc2V0SW50OCh0aGlzLl9ieXRlT2Zmc2V0LCBlbnRyeSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2J5dGVPZmZzZXQrKztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHR5cGUgeyBJbWFnZU1pbWVUeXBlLCBJTWVzaFByaW1pdGl2ZSwgSU5vZGUsIElNYXRlcmlhbCwgSVRleHR1cmVJbmZvIH0gZnJvbSBcImJhYnlsb25qcy1nbHRmMmludGVyZmFjZVwiO1xyXG5pbXBvcnQgdHlwZSB7IE5vZGUgfSBmcm9tIFwiY29yZS9ub2RlXCI7XHJcbmltcG9ydCB0eXBlIHsgTnVsbGFibGUgfSBmcm9tIFwiY29yZS90eXBlc1wiO1xyXG5cclxuaW1wb3J0IHR5cGUgeyBUZXh0dXJlIH0gZnJvbSBcImNvcmUvTWF0ZXJpYWxzL1RleHR1cmVzL3RleHR1cmVcIjtcclxuaW1wb3J0IHR5cGUgeyBTdWJNZXNoIH0gZnJvbSBcImNvcmUvTWVzaGVzL3N1Yk1lc2hcIjtcclxuaW1wb3J0IHR5cGUgeyBJRGlzcG9zYWJsZSB9IGZyb20gXCJjb3JlL3NjZW5lXCI7XHJcblxyXG5pbXBvcnQgdHlwZSB7IF9CaW5hcnlXcml0ZXIgfSBmcm9tIFwiLi9nbFRGRXhwb3J0ZXJcIjtcclxuaW1wb3J0IHR5cGUgeyBJR0xURkV4cG9ydGVyRXh0ZW5zaW9uIH0gZnJvbSBcIi4uL2dsVEZGaWxlRXhwb3J0ZXJcIjtcclxuaW1wb3J0IHR5cGUgeyBNYXRlcmlhbCB9IGZyb20gXCJjb3JlL01hdGVyaWFscy9tYXRlcmlhbFwiO1xyXG5pbXBvcnQgdHlwZSB7IEJhc2VUZXh0dXJlIH0gZnJvbSBcImNvcmUvTWF0ZXJpYWxzL1RleHR1cmVzL2Jhc2VUZXh0dXJlXCI7XHJcblxyXG4vKiogQGludGVybmFsICovXHJcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby12YXIsIEB0eXBlc2NyaXB0LWVzbGludC9uYW1pbmctY29udmVudGlvblxyXG5leHBvcnQgdmFyIF9fSUdMVEZFeHBvcnRlckV4dGVuc2lvblYyID0gMDsgLy8gSSBhbSBoZXJlIHRvIGFsbG93IGR0cyB0byBiZSBjcmVhdGVkXHJcblxyXG4vKipcclxuICogSW50ZXJmYWNlIGZvciBhIGdsVEYgZXhwb3J0ZXIgZXh0ZW5zaW9uXHJcbiAqIEBpbnRlcm5hbFxyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBJR0xURkV4cG9ydGVyRXh0ZW5zaW9uVjIgZXh0ZW5kcyBJR0xURkV4cG9ydGVyRXh0ZW5zaW9uLCBJRGlzcG9zYWJsZSB7XHJcbiAgICAvKipcclxuICAgICAqIERlZmluZSB0aGlzIG1ldGhvZCB0byBtb2RpZnkgdGhlIGRlZmF1bHQgYmVoYXZpb3IgYmVmb3JlIGV4cG9ydGluZyBhIHRleHR1cmVcclxuICAgICAqIEBwYXJhbSBjb250ZXh0IFRoZSBjb250ZXh0IHdoZW4gbG9hZGluZyB0aGUgYXNzZXRcclxuICAgICAqIEBwYXJhbSBiYWJ5bG9uVGV4dHVyZSBUaGUgQmFieWxvbi5qcyB0ZXh0dXJlXHJcbiAgICAgKiBAcGFyYW0gbWltZVR5cGUgVGhlIG1pbWUtdHlwZSBvZiB0aGUgZ2VuZXJhdGVkIGltYWdlXHJcbiAgICAgKiBAcmV0dXJucyBBIHByb21pc2UgdGhhdCByZXNvbHZlcyB3aXRoIHRoZSBleHBvcnRlZCB0ZXh0dXJlXHJcbiAgICAgKi9cclxuICAgIHByZUV4cG9ydFRleHR1cmVBc3luYz8oY29udGV4dDogc3RyaW5nLCBiYWJ5bG9uVGV4dHVyZTogTnVsbGFibGU8VGV4dHVyZT4sIG1pbWVUeXBlOiBJbWFnZU1pbWVUeXBlKTogUHJvbWlzZTxOdWxsYWJsZTxUZXh0dXJlPj47XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEZWZpbmUgdGhpcyBtZXRob2QgdG8gZ2V0IG5vdGlmaWVkIHdoZW4gYSB0ZXh0dXJlIGluZm8gaXMgY3JlYXRlZFxyXG4gICAgICogQHBhcmFtIGNvbnRleHQgVGhlIGNvbnRleHQgd2hlbiBsb2FkaW5nIHRoZSBhc3NldFxyXG4gICAgICogQHBhcmFtIHRleHR1cmVJbmZvIFRoZSBnbFRGIHRleHR1cmUgaW5mb1xyXG4gICAgICogQHBhcmFtIGJhYnlsb25UZXh0dXJlIFRoZSBCYWJ5bG9uLmpzIHRleHR1cmVcclxuICAgICAqL1xyXG4gICAgcG9zdEV4cG9ydFRleHR1cmU/KGNvbnRleHQ6IHN0cmluZywgdGV4dHVyZUluZm86IElUZXh0dXJlSW5mbywgYmFieWxvblRleHR1cmU6IEJhc2VUZXh0dXJlKTogdm9pZDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIERlZmluZSB0aGlzIG1ldGhvZCB0byBtb2RpZnkgdGhlIGRlZmF1bHQgYmVoYXZpb3Igd2hlbiBleHBvcnRpbmcgdGV4dHVyZSBpbmZvXHJcbiAgICAgKiBAcGFyYW0gY29udGV4dCBUaGUgY29udGV4dCB3aGVuIGxvYWRpbmcgdGhlIGFzc2V0XHJcbiAgICAgKiBAcGFyYW0gbWVzaFByaW1pdGl2ZSBnbFRGIG1lc2ggcHJpbWl0aXZlXHJcbiAgICAgKiBAcGFyYW0gYmFieWxvblN1Yk1lc2ggQmFieWxvbiBzdWJtZXNoXHJcbiAgICAgKiBAcGFyYW0gYmluYXJ5V3JpdGVyIGdsVEYgc2VyaWFsaXplciBiaW5hcnkgd3JpdGVyIGluc3RhbmNlXHJcbiAgICAgKiBAcmV0dXJucyBudWxsYWJsZSBJTWVzaFByaW1pdGl2ZSBwcm9taXNlXHJcbiAgICAgKi9cclxuICAgIHBvc3RFeHBvcnRNZXNoUHJpbWl0aXZlQXN5bmM/KGNvbnRleHQ6IHN0cmluZywgbWVzaFByaW1pdGl2ZTogTnVsbGFibGU8SU1lc2hQcmltaXRpdmU+LCBiYWJ5bG9uU3ViTWVzaDogU3ViTWVzaCwgYmluYXJ5V3JpdGVyOiBfQmluYXJ5V3JpdGVyKTogUHJvbWlzZTxJTWVzaFByaW1pdGl2ZT47XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEZWZpbmUgdGhpcyBtZXRob2QgdG8gbW9kaWZ5IHRoZSBkZWZhdWx0IGJlaGF2aW9yIHdoZW4gZXhwb3J0aW5nIGEgbm9kZVxyXG4gICAgICogQHBhcmFtIGNvbnRleHQgVGhlIGNvbnRleHQgd2hlbiBleHBvcnRpbmcgdGhlIG5vZGVcclxuICAgICAqIEBwYXJhbSBub2RlIGdsVEYgbm9kZVxyXG4gICAgICogQHBhcmFtIGJhYnlsb25Ob2RlIEJhYnlsb25KUyBub2RlXHJcbiAgICAgKiBAcmV0dXJucyBudWxsYWJsZSBJTm9kZSBwcm9taXNlXHJcbiAgICAgKi9cclxuICAgIHBvc3RFeHBvcnROb2RlQXN5bmM/KGNvbnRleHQ6IHN0cmluZywgbm9kZTogTnVsbGFibGU8SU5vZGU+LCBiYWJ5bG9uTm9kZTogTm9kZSwgbm9kZU1hcDogeyBba2V5OiBudW1iZXJdOiBudW1iZXIgfSwgYmluYXJ5V3JpdGVyOiBfQmluYXJ5V3JpdGVyKTogUHJvbWlzZTxOdWxsYWJsZTxJTm9kZT4+O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGVmaW5lIHRoaXMgbWV0aG9kIHRvIG1vZGlmeSB0aGUgZGVmYXVsdCBiZWhhdmlvciB3aGVuIGV4cG9ydGluZyBhIG1hdGVyaWFsXHJcbiAgICAgKiBAcGFyYW0gbWF0ZXJpYWwgZ2xURiBtYXRlcmlhbFxyXG4gICAgICogQHBhcmFtIGJhYnlsb25NYXRlcmlhbCBCYWJ5bG9uSlMgbWF0ZXJpYWxcclxuICAgICAqIEByZXR1cm5zIG51bGxhYmxlIElNYXRlcmlhbCBwcm9taXNlXHJcbiAgICAgKi9cclxuICAgIHBvc3RFeHBvcnRNYXRlcmlhbEFzeW5jPyhjb250ZXh0OiBzdHJpbmcsIG5vZGU6IE51bGxhYmxlPElNYXRlcmlhbD4sIGJhYnlsb25NYXRlcmlhbDogTWF0ZXJpYWwpOiBQcm9taXNlPElNYXRlcmlhbD47XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEZWZpbmUgdGhpcyBtZXRob2QgdG8gcmV0dXJuIGFkZGl0aW9uYWwgdGV4dHVyZXMgdG8gZXhwb3J0IGZyb20gYSBtYXRlcmlhbFxyXG4gICAgICogQHBhcmFtIG1hdGVyaWFsIGdsVEYgbWF0ZXJpYWxcclxuICAgICAqIEBwYXJhbSBiYWJ5bG9uTWF0ZXJpYWwgQmFieWxvbkpTIG1hdGVyaWFsXHJcbiAgICAgKiBAcmV0dXJucyBMaXN0IG9mIHRleHR1cmVzXHJcbiAgICAgKi9cclxuICAgIHBvc3RFeHBvcnRNYXRlcmlhbEFkZGl0aW9uYWxUZXh0dXJlcz8oY29udGV4dDogc3RyaW5nLCBub2RlOiBJTWF0ZXJpYWwsIGJhYnlsb25NYXRlcmlhbDogTWF0ZXJpYWwpOiBCYXNlVGV4dHVyZVtdO1xyXG5cclxuICAgIC8qKiBHZXRzIGEgYm9vbGVhbiBpbmRpY2F0aW5nIHRoYXQgdGhpcyBleHRlbnNpb24gd2FzIHVzZWQgKi9cclxuICAgIHdhc1VzZWQ6IGJvb2xlYW47XHJcblxyXG4gICAgLyoqIEdldHMgYSBib29sZWFuIGluZGljYXRpbmcgdGhhdCB0aGlzIGV4dGVuc2lvbiBpcyByZXF1aXJlZCBmb3IgdGhlIGZpbGUgdG8gd29yayAqL1xyXG4gICAgcmVxdWlyZWQ6IGJvb2xlYW47XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxsZWQgYWZ0ZXIgdGhlIGV4cG9ydGVyIHN0YXRlIGNoYW5nZXMgdG8gRVhQT1JUSU5HXHJcbiAgICAgKi9cclxuICAgIG9uRXhwb3J0aW5nPygpOiB2b2lkO1xyXG59XHJcbiIsImltcG9ydCB0eXBlIHsgSVRleHR1cmVJbmZvLCBJTWF0ZXJpYWwsIElNYXRlcmlhbFBick1ldGFsbGljUm91Z2huZXNzLCBJTWF0ZXJpYWxPY2NsdXNpb25UZXh0dXJlSW5mbywgSVNhbXBsZXIsIElNYXRlcmlhbEV4dGVuc2lvbiB9IGZyb20gXCJiYWJ5bG9uanMtZ2x0ZjJpbnRlcmZhY2VcIjtcclxuaW1wb3J0IHsgSW1hZ2VNaW1lVHlwZSwgTWF0ZXJpYWxBbHBoYU1vZGUsIFRleHR1cmVNYWdGaWx0ZXIsIFRleHR1cmVNaW5GaWx0ZXIsIFRleHR1cmVXcmFwTW9kZSB9IGZyb20gXCJiYWJ5bG9uanMtZ2x0ZjJpbnRlcmZhY2VcIjtcclxuXHJcbmltcG9ydCB0eXBlIHsgTnVsbGFibGUgfSBmcm9tIFwiY29yZS90eXBlc1wiO1xyXG5pbXBvcnQgeyBWZWN0b3IyIH0gZnJvbSBcImNvcmUvTWF0aHMvbWF0aC52ZWN0b3JcIjtcclxuaW1wb3J0IHsgQ29sb3IzIH0gZnJvbSBcImNvcmUvTWF0aHMvbWF0aC5jb2xvclwiO1xyXG5pbXBvcnQgeyBTY2FsYXIgfSBmcm9tIFwiY29yZS9NYXRocy9tYXRoLnNjYWxhclwiO1xyXG5pbXBvcnQgeyBUb29scyB9IGZyb20gXCJjb3JlL01pc2MvdG9vbHNcIjtcclxuaW1wb3J0IHsgVGV4dHVyZVRvb2xzIH0gZnJvbSBcImNvcmUvTWlzYy90ZXh0dXJlVG9vbHNcIjtcclxuaW1wb3J0IHR5cGUgeyBCYXNlVGV4dHVyZSB9IGZyb20gXCJjb3JlL01hdGVyaWFscy9UZXh0dXJlcy9iYXNlVGV4dHVyZVwiO1xyXG5pbXBvcnQgeyBUZXh0dXJlIH0gZnJvbSBcImNvcmUvTWF0ZXJpYWxzL1RleHR1cmVzL3RleHR1cmVcIjtcclxuaW1wb3J0IHsgUmF3VGV4dHVyZSB9IGZyb20gXCJjb3JlL01hdGVyaWFscy9UZXh0dXJlcy9yYXdUZXh0dXJlXCI7XHJcblxyXG5pbXBvcnQgdHlwZSB7IFNjZW5lIH0gZnJvbSBcImNvcmUvc2NlbmVcIjtcclxuXHJcbmltcG9ydCB0eXBlIHsgX0V4cG9ydGVyIH0gZnJvbSBcIi4vZ2xURkV4cG9ydGVyXCI7XHJcbmltcG9ydCB7IENvbnN0YW50cyB9IGZyb20gXCJjb3JlL0VuZ2luZXMvY29uc3RhbnRzXCI7XHJcbmltcG9ydCB7IER1bXBUb29scyB9IGZyb20gXCJjb3JlL01pc2MvZHVtcFRvb2xzXCI7XHJcblxyXG5pbXBvcnQgdHlwZSB7IE1hdGVyaWFsIH0gZnJvbSBcImNvcmUvTWF0ZXJpYWxzL21hdGVyaWFsXCI7XHJcbmltcG9ydCB0eXBlIHsgU3RhbmRhcmRNYXRlcmlhbCB9IGZyb20gXCJjb3JlL01hdGVyaWFscy9zdGFuZGFyZE1hdGVyaWFsXCI7XHJcbmltcG9ydCB0eXBlIHsgUEJSQmFzZU1hdGVyaWFsIH0gZnJvbSBcImNvcmUvTWF0ZXJpYWxzL1BCUi9wYnJCYXNlTWF0ZXJpYWxcIjtcclxuaW1wb3J0IHR5cGUgeyBQQlJNYXRlcmlhbCB9IGZyb20gXCJjb3JlL01hdGVyaWFscy9QQlIvcGJyTWF0ZXJpYWxcIjtcclxuXHJcbmltcG9ydCBcImNvcmUvRW5naW5lcy9FeHRlbnNpb25zL2VuZ2luZS5yZWFkVGV4dHVyZVwiO1xyXG5cclxuLyoqXHJcbiAqIEludGVyZmFjZSBmb3Igc3RvcmluZyBzcGVjdWxhciBnbG9zc2luZXNzIGZhY3RvcnNcclxuICogQGludGVybmFsXHJcbiAqL1xyXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25hbWluZy1jb252ZW50aW9uXHJcbmludGVyZmFjZSBfSVBCUlNwZWN1bGFyR2xvc3NpbmVzcyB7XHJcbiAgICAvKipcclxuICAgICAqIFJlcHJlc2VudHMgdGhlIGxpbmVhciBkaWZmdXNlIGZhY3RvcnMgb2YgdGhlIG1hdGVyaWFsXHJcbiAgICAgKi9cclxuICAgIGRpZmZ1c2VDb2xvcjogQ29sb3IzO1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZXByZXNlbnRzIHRoZSBsaW5lYXIgc3BlY3VsYXIgZmFjdG9ycyBvZiB0aGUgbWF0ZXJpYWxcclxuICAgICAqL1xyXG4gICAgc3BlY3VsYXJDb2xvcjogQ29sb3IzO1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZXByZXNlbnRzIHRoZSBzbW9vdGhuZXNzIG9mIHRoZSBtYXRlcmlhbFxyXG4gICAgICovXHJcbiAgICBnbG9zc2luZXNzOiBudW1iZXI7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBJbnRlcmZhY2UgZm9yIHN0b3JpbmcgbWV0YWxsaWMgcm91Z2huZXNzIGZhY3RvcnNcclxuICogQGludGVybmFsXHJcbiAqL1xyXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25hbWluZy1jb252ZW50aW9uXHJcbmludGVyZmFjZSBfSVBCUk1ldGFsbGljUm91Z2huZXNzIHtcclxuICAgIC8qKlxyXG4gICAgICogUmVwcmVzZW50cyB0aGUgYWxiZWRvIGNvbG9yIG9mIHRoZSBtYXRlcmlhbFxyXG4gICAgICovXHJcbiAgICBiYXNlQ29sb3I6IENvbG9yMztcclxuICAgIC8qKlxyXG4gICAgICogUmVwcmVzZW50cyB0aGUgbWV0YWxuZXNzIG9mIHRoZSBtYXRlcmlhbFxyXG4gICAgICovXHJcbiAgICBtZXRhbGxpYzogTnVsbGFibGU8bnVtYmVyPjtcclxuICAgIC8qKlxyXG4gICAgICogUmVwcmVzZW50cyB0aGUgcm91Z2huZXNzIG9mIHRoZSBtYXRlcmlhbFxyXG4gICAgICovXHJcbiAgICByb3VnaG5lc3M6IE51bGxhYmxlPG51bWJlcj47XHJcbiAgICAvKipcclxuICAgICAqIFRoZSBtZXRhbGxpYyByb3VnaG5lc3MgdGV4dHVyZSBkYXRhXHJcbiAgICAgKi9cclxuICAgIG1ldGFsbGljUm91Z2huZXNzVGV4dHVyZURhdGE/OiBOdWxsYWJsZTxBcnJheUJ1ZmZlcj47XHJcbiAgICAvKipcclxuICAgICAqIFRoZSBiYXNlIGNvbG9yIHRleHR1cmUgZGF0YVxyXG4gICAgICovXHJcbiAgICBiYXNlQ29sb3JUZXh0dXJlRGF0YT86IE51bGxhYmxlPEFycmF5QnVmZmVyPjtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0RmlsZUV4dGVuc2lvbkZyb21NaW1lVHlwZShtaW1lVHlwZTogSW1hZ2VNaW1lVHlwZSk6IHN0cmluZyB7XHJcbiAgICBzd2l0Y2ggKG1pbWVUeXBlKSB7XHJcbiAgICAgICAgY2FzZSBJbWFnZU1pbWVUeXBlLkpQRUc6XHJcbiAgICAgICAgICAgIHJldHVybiBcIi5qcGdcIjtcclxuICAgICAgICBjYXNlIEltYWdlTWltZVR5cGUuUE5HOlxyXG4gICAgICAgICAgICByZXR1cm4gXCIucG5nXCI7XHJcbiAgICAgICAgY2FzZSBJbWFnZU1pbWVUeXBlLldFQlA6XHJcbiAgICAgICAgICAgIHJldHVybiBcIi53ZWJwXCI7XHJcbiAgICAgICAgY2FzZSBJbWFnZU1pbWVUeXBlLkFWSUY6XHJcbiAgICAgICAgICAgIHJldHVybiBcIi5hdmlmXCI7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBVdGlsaXR5IG1ldGhvZHMgZm9yIHdvcmtpbmcgd2l0aCBnbFRGIG1hdGVyaWFsIGNvbnZlcnNpb24gcHJvcGVydGllcy4gIFRoaXMgY2xhc3Mgc2hvdWxkIG9ubHkgYmUgdXNlZCBpbnRlcm5hbGx5XHJcbiAqIEBpbnRlcm5hbFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIF9HTFRGTWF0ZXJpYWxFeHBvcnRlciB7XHJcbiAgICAvKipcclxuICAgICAqIFJlcHJlc2VudHMgdGhlIGRpZWxlY3RyaWMgc3BlY3VsYXIgdmFsdWVzIGZvciBSLCBHIGFuZCBCXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IF9EaWVsZWN0cmljU3BlY3VsYXI6IENvbG9yMyA9IG5ldyBDb2xvcjMoMC4wNCwgMC4wNCwgMC4wNCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBbGxvd3MgdGhlIG1heGltdW0gc3BlY3VsYXIgcG93ZXIgdG8gYmUgZGVmaW5lZCBmb3IgbWF0ZXJpYWwgY2FsY3VsYXRpb25zXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IF9NYXhTcGVjdWxhclBvd2VyID0gMTAyNDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIE1hcHBpbmcgdG8gc3RvcmUgdGV4dHVyZXNcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBfdGV4dHVyZU1hcDogeyBbdGV4dHVyZUlkOiBzdHJpbmddOiBJVGV4dHVyZUluZm8gfSA9IHt9O1xyXG5cclxuICAgIC8vIE1hcHBpbmcgb2YgaW50ZXJuYWwgdGV4dHVyZXMgdG8gaW1hZ2VzIHRvIGF2b2lkIGV4cG9ydGluZyBkdXBsaWNhdGUgaW1hZ2VzLlxyXG4gICAgcHJpdmF0ZSBfaW50ZXJuYWxUZXh0dXJlVG9JbWFnZTogeyBbdW5pcXVlSWQ6IG51bWJlcl06IHsgW21pbWVUeXBlOiBzdHJpbmddOiBQcm9taXNlPG51bWJlcj4gfSB9ID0ge307XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBOdW1lcmljIHRvbGVyYW5jZSB2YWx1ZVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBfRXBzaWxvbiA9IDFlLTY7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZWZlcmVuY2UgdG8gdGhlIGdsVEYgRXhwb3J0ZXJcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBfZXhwb3J0ZXI6IF9FeHBvcnRlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihleHBvcnRlcjogX0V4cG9ydGVyKSB7XHJcbiAgICAgICAgdGhpcy5fdGV4dHVyZU1hcCA9IHt9O1xyXG4gICAgICAgIHRoaXMuX2V4cG9ydGVyID0gZXhwb3J0ZXI7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTcGVjaWZpZXMgaWYgdHdvIGNvbG9ycyBhcmUgYXBwcm94aW1hdGVseSBlcXVhbCBpbiB2YWx1ZVxyXG4gICAgICogQHBhcmFtIGNvbG9yMSBmaXJzdCBjb2xvciB0byBjb21wYXJlIHRvXHJcbiAgICAgKiBAcGFyYW0gY29sb3IyIHNlY29uZCBjb2xvciB0byBjb21wYXJlIHRvXHJcbiAgICAgKiBAcGFyYW0gZXBzaWxvbiB0aHJlc2hvbGQgdmFsdWVcclxuICAgICAqIEByZXR1cm5zIGJvb2xlYW4gc3BlY2lmeWluZyBpZiB0aGUgY29sb3JzIGFyZSBhcHByb3hpbWF0ZWx5IGVxdWFsIGluIHZhbHVlXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgc3RhdGljIF9GdXp6eUVxdWFscyhjb2xvcjE6IENvbG9yMywgY29sb3IyOiBDb2xvcjMsIGVwc2lsb246IG51bWJlcik6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiBTY2FsYXIuV2l0aGluRXBzaWxvbihjb2xvcjEuciwgY29sb3IyLnIsIGVwc2lsb24pICYmIFNjYWxhci5XaXRoaW5FcHNpbG9uKGNvbG9yMS5nLCBjb2xvcjIuZywgZXBzaWxvbikgJiYgU2NhbGFyLldpdGhpbkVwc2lsb24oY29sb3IxLmIsIGNvbG9yMi5iLCBlcHNpbG9uKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldHMgdGhlIG1hdGVyaWFscyBmcm9tIGEgQmFieWxvbiBzY2VuZSBhbmQgY29udmVydHMgdGhlbSB0byBnbFRGIG1hdGVyaWFsc1xyXG4gICAgICogQHBhcmFtIGV4cG9ydE1hdGVyaWFsc1xyXG4gICAgICogQHBhcmFtIG1pbWVUeXBlIHRleHR1cmUgbWltZSB0eXBlXHJcbiAgICAgKiBAcGFyYW0gaGFzVGV4dHVyZUNvb3JkcyBzcGVjaWZpZXMgaWYgdGV4dHVyZSBjb29yZGluYXRlcyBhcmUgcHJlc2VudCBvbiB0aGUgbWF0ZXJpYWxcclxuICAgICAqIEByZXR1cm5zIHByb21pc2UgdGhhdCByZXNvbHZlcyBhZnRlciBhbGwgbWF0ZXJpYWxzIGhhdmUgYmVlbiBjb252ZXJ0ZWRcclxuICAgICAqL1xyXG4gICAgcHVibGljIF9jb252ZXJ0TWF0ZXJpYWxzVG9HTFRGQXN5bmMoZXhwb3J0TWF0ZXJpYWxzOiBTZXQ8TWF0ZXJpYWw+LCBtaW1lVHlwZTogSW1hZ2VNaW1lVHlwZSwgaGFzVGV4dHVyZUNvb3JkczogYm9vbGVhbikge1xyXG4gICAgICAgIGNvbnN0IHByb21pc2VzOiBQcm9taXNlPElNYXRlcmlhbD5bXSA9IFtdO1xyXG4gICAgICAgIGV4cG9ydE1hdGVyaWFscy5mb3JFYWNoKChtYXRlcmlhbCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAobWF0ZXJpYWwuZ2V0Q2xhc3NOYW1lKCkgPT09IFwiU3RhbmRhcmRNYXRlcmlhbFwiKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9taXNlcy5wdXNoKHRoaXMuX2NvbnZlcnRTdGFuZGFyZE1hdGVyaWFsQXN5bmMobWF0ZXJpYWwgYXMgU3RhbmRhcmRNYXRlcmlhbCwgbWltZVR5cGUsIGhhc1RleHR1cmVDb29yZHMpKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChtYXRlcmlhbC5nZXRDbGFzc05hbWUoKS5pbmRleE9mKFwiUEJSXCIpICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgcHJvbWlzZXMucHVzaCh0aGlzLl9jb252ZXJ0UEJSTWF0ZXJpYWxBc3luYyhtYXRlcmlhbCBhcyBQQlJNYXRlcmlhbCwgbWltZVR5cGUsIGhhc1RleHR1cmVDb29yZHMpKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIFRvb2xzLldhcm4oYFVuc3VwcG9ydGVkIG1hdGVyaWFsIHR5cGU6ICR7bWF0ZXJpYWwubmFtZX1gKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAvKiBkbyBub3RoaW5nICovXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBNYWtlcyBhIGNvcHkgb2YgdGhlIGdsVEYgbWF0ZXJpYWwgd2l0aG91dCB0aGUgdGV4dHVyZSBwYXJhbWV0ZXJzXHJcbiAgICAgKiBAcGFyYW0gb3JpZ2luYWxNYXRlcmlhbCBvcmlnaW5hbCBnbFRGIG1hdGVyaWFsXHJcbiAgICAgKiBAcmV0dXJucyBnbFRGIG1hdGVyaWFsIHdpdGhvdXQgdGV4dHVyZSBwYXJhbWV0ZXJzXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBfc3RyaXBUZXh0dXJlc0Zyb21NYXRlcmlhbChvcmlnaW5hbE1hdGVyaWFsOiBJTWF0ZXJpYWwpOiBJTWF0ZXJpYWwge1xyXG4gICAgICAgIGNvbnN0IG5ld01hdGVyaWFsOiBJTWF0ZXJpYWwgPSB7fTtcclxuICAgICAgICBpZiAob3JpZ2luYWxNYXRlcmlhbCkge1xyXG4gICAgICAgICAgICBuZXdNYXRlcmlhbC5uYW1lID0gb3JpZ2luYWxNYXRlcmlhbC5uYW1lO1xyXG4gICAgICAgICAgICBuZXdNYXRlcmlhbC5kb3VibGVTaWRlZCA9IG9yaWdpbmFsTWF0ZXJpYWwuZG91YmxlU2lkZWQ7XHJcbiAgICAgICAgICAgIG5ld01hdGVyaWFsLmFscGhhTW9kZSA9IG9yaWdpbmFsTWF0ZXJpYWwuYWxwaGFNb2RlO1xyXG4gICAgICAgICAgICBuZXdNYXRlcmlhbC5hbHBoYUN1dG9mZiA9IG9yaWdpbmFsTWF0ZXJpYWwuYWxwaGFDdXRvZmY7XHJcbiAgICAgICAgICAgIG5ld01hdGVyaWFsLmVtaXNzaXZlRmFjdG9yID0gb3JpZ2luYWxNYXRlcmlhbC5lbWlzc2l2ZUZhY3RvcjtcclxuICAgICAgICAgICAgY29uc3Qgb3JpZ2luYWxQQlJNZXRhbGxpY1JvdWdobmVzcyA9IG9yaWdpbmFsTWF0ZXJpYWwucGJyTWV0YWxsaWNSb3VnaG5lc3M7XHJcbiAgICAgICAgICAgIGlmIChvcmlnaW5hbFBCUk1ldGFsbGljUm91Z2huZXNzKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdNYXRlcmlhbC5wYnJNZXRhbGxpY1JvdWdobmVzcyA9IHt9O1xyXG4gICAgICAgICAgICAgICAgbmV3TWF0ZXJpYWwucGJyTWV0YWxsaWNSb3VnaG5lc3MuYmFzZUNvbG9yRmFjdG9yID0gb3JpZ2luYWxQQlJNZXRhbGxpY1JvdWdobmVzcy5iYXNlQ29sb3JGYWN0b3I7XHJcbiAgICAgICAgICAgICAgICBuZXdNYXRlcmlhbC5wYnJNZXRhbGxpY1JvdWdobmVzcy5tZXRhbGxpY0ZhY3RvciA9IG9yaWdpbmFsUEJSTWV0YWxsaWNSb3VnaG5lc3MubWV0YWxsaWNGYWN0b3I7XHJcbiAgICAgICAgICAgICAgICBuZXdNYXRlcmlhbC5wYnJNZXRhbGxpY1JvdWdobmVzcy5yb3VnaG5lc3NGYWN0b3IgPSBvcmlnaW5hbFBCUk1ldGFsbGljUm91Z2huZXNzLnJvdWdobmVzc0ZhY3RvcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3TWF0ZXJpYWw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTcGVjaWZpZXMgaWYgdGhlIG1hdGVyaWFsIGhhcyBhbnkgdGV4dHVyZSBwYXJhbWV0ZXJzIHByZXNlbnRcclxuICAgICAqIEBwYXJhbSBtYXRlcmlhbCBnbFRGIE1hdGVyaWFsXHJcbiAgICAgKiBAcmV0dXJucyBib29sZWFuIHNwZWNpZnlpbmcgaWYgdGV4dHVyZSBwYXJhbWV0ZXJzIGFyZSBwcmVzZW50XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBfaGFzVGV4dHVyZXNQcmVzZW50KG1hdGVyaWFsOiBJTWF0ZXJpYWwpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAobWF0ZXJpYWwuZW1pc3NpdmVUZXh0dXJlIHx8IG1hdGVyaWFsLm5vcm1hbFRleHR1cmUgfHwgbWF0ZXJpYWwub2NjbHVzaW9uVGV4dHVyZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgcGJyTWF0ID0gbWF0ZXJpYWwucGJyTWV0YWxsaWNSb3VnaG5lc3M7XHJcbiAgICAgICAgaWYgKHBick1hdCkge1xyXG4gICAgICAgICAgICBpZiAocGJyTWF0LmJhc2VDb2xvclRleHR1cmUgfHwgcGJyTWF0Lm1ldGFsbGljUm91Z2huZXNzVGV4dHVyZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChtYXRlcmlhbC5leHRlbnNpb25zKSB7XHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgZXh0ZW5zaW9uIGluIG1hdGVyaWFsLmV4dGVuc2lvbnMpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGV4dGVuc2lvbk9iamVjdCA9IG1hdGVyaWFsLmV4dGVuc2lvbnNbZXh0ZW5zaW9uXTtcclxuICAgICAgICAgICAgICAgIGlmIChleHRlbnNpb25PYmplY3QgYXMgSU1hdGVyaWFsRXh0ZW5zaW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGV4dGVuc2lvbk9iamVjdC5oYXNUZXh0dXJlcz8uKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgX2dldFRleHR1cmVJbmZvKGJhYnlsb25UZXh0dXJlOiBOdWxsYWJsZTxCYXNlVGV4dHVyZT4pOiBOdWxsYWJsZTxJVGV4dHVyZUluZm8+IHtcclxuICAgICAgICBpZiAoYmFieWxvblRleHR1cmUpIHtcclxuICAgICAgICAgICAgY29uc3QgdGV4dHVyZVVpZCA9IGJhYnlsb25UZXh0dXJlLnVpZDtcclxuICAgICAgICAgICAgaWYgKHRleHR1cmVVaWQgaW4gdGhpcy5fdGV4dHVyZU1hcCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RleHR1cmVNYXBbdGV4dHVyZVVpZF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb252ZXJ0cyBhIEJhYnlsb24gU3RhbmRhcmRNYXRlcmlhbCB0byBhIGdsVEYgTWV0YWxsaWMgUm91Z2huZXNzIE1hdGVyaWFsXHJcbiAgICAgKiBAcGFyYW0gYmFieWxvblN0YW5kYXJkTWF0ZXJpYWxcclxuICAgICAqIEByZXR1cm5zIGdsVEYgTWV0YWxsaWMgUm91Z2huZXNzIE1hdGVyaWFsIHJlcHJlc2VudGF0aW9uXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBfY29udmVydFRvR0xURlBCUk1ldGFsbGljUm91Z2huZXNzKGJhYnlsb25TdGFuZGFyZE1hdGVyaWFsOiBTdGFuZGFyZE1hdGVyaWFsKTogSU1hdGVyaWFsUGJyTWV0YWxsaWNSb3VnaG5lc3Mge1xyXG4gICAgICAgIC8vIERlZmluZXMgYSBjdWJpYyBiZXppZXIgY3VydmUgd2hlcmUgeCBpcyBzcGVjdWxhciBwb3dlciBhbmQgeSBpcyByb3VnaG5lc3NcclxuICAgICAgICBjb25zdCBQMCA9IG5ldyBWZWN0b3IyKDAsIDEpO1xyXG4gICAgICAgIGNvbnN0IFAxID0gbmV3IFZlY3RvcjIoMCwgMC4xKTtcclxuICAgICAgICBjb25zdCBQMiA9IG5ldyBWZWN0b3IyKDAsIDAuMSk7XHJcbiAgICAgICAgY29uc3QgUDMgPSBuZXcgVmVjdG9yMigxMzAwLCAwLjEpO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBHaXZlbiB0aGUgY29udHJvbCBwb2ludHMsIHNvbHZlIGZvciB4IGJhc2VkIG9uIGEgZ2l2ZW4gdCBmb3IgYSBjdWJpYyBiZXppZXIgY3VydmVcclxuICAgICAgICAgKiBAcGFyYW0gdCBhIHZhbHVlIGJldHdlZW4gMCBhbmQgMVxyXG4gICAgICAgICAqIEBwYXJhbSBwMCBmaXJzdCBjb250cm9sIHBvaW50XHJcbiAgICAgICAgICogQHBhcmFtIHAxIHNlY29uZCBjb250cm9sIHBvaW50XHJcbiAgICAgICAgICogQHBhcmFtIHAyIHRoaXJkIGNvbnRyb2wgcG9pbnRcclxuICAgICAgICAgKiBAcGFyYW0gcDMgZm91cnRoIGNvbnRyb2wgcG9pbnRcclxuICAgICAgICAgKiBAcmV0dXJucyBudW1iZXIgcmVzdWx0IG9mIGN1YmljIGJlemllciBjdXJ2ZSBhdCB0aGUgc3BlY2lmaWVkIHRcclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBjdWJpY0JlemllckN1cnZlKHQ6IG51bWJlciwgcDA6IG51bWJlciwgcDE6IG51bWJlciwgcDI6IG51bWJlciwgcDM6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICAgICAgICAgIHJldHVybiAoMSAtIHQpICogKDEgLSB0KSAqICgxIC0gdCkgKiBwMCArIDMgKiAoMSAtIHQpICogKDEgLSB0KSAqIHQgKiBwMSArIDMgKiAoMSAtIHQpICogdCAqIHQgKiBwMiArIHQgKiB0ICogdCAqIHAzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRXZhbHVhdGVzIGEgc3BlY2lmaWVkIHNwZWN1bGFyIHBvd2VyIHZhbHVlIHRvIGRldGVybWluZSB0aGUgYXBwcm9wcmlhdGUgcm91Z2huZXNzIHZhbHVlLFxyXG4gICAgICAgICAqIGJhc2VkIG9uIGEgcHJlLWRlZmluZWQgY3ViaWMgYmV6aWVyIGN1cnZlIHdpdGggc3BlY3VsYXIgb24gdGhlIGFic2Npc3NhIGF4aXMgKHgtYXhpcylcclxuICAgICAgICAgKiBhbmQgcm91Z2huZXNzIG9uIHRoZSBvcmRpbmFudCBheGlzICh5LWF4aXMpXHJcbiAgICAgICAgICogQHBhcmFtIHNwZWN1bGFyUG93ZXIgc3BlY3VsYXIgcG93ZXIgb2Ygc3RhbmRhcmQgbWF0ZXJpYWxcclxuICAgICAgICAgKiBAcmV0dXJucyBOdW1iZXIgcmVwcmVzZW50aW5nIHRoZSByb3VnaG5lc3MgdmFsdWVcclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBzb2x2ZUZvclJvdWdobmVzcyhzcGVjdWxhclBvd2VyOiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgICAgICAgICAvLyBHaXZlbiBQMC54ID0gMCwgUDEueCA9IDAsIFAyLnggPSAwXHJcbiAgICAgICAgICAgIC8vICAgeCA9IHQgKiB0ICogdCAqIFAzLnhcclxuICAgICAgICAgICAgLy8gICB0ID0gKHggLyBQMy54KV4oMS8zKVxyXG4gICAgICAgICAgICBjb25zdCB0ID0gTWF0aC5wb3coc3BlY3VsYXJQb3dlciAvIFAzLngsIDAuMzMzMzMzKTtcclxuICAgICAgICAgICAgcmV0dXJuIGN1YmljQmV6aWVyQ3VydmUodCwgUDAueSwgUDEueSwgUDIueSwgUDMueSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBkaWZmdXNlID0gYmFieWxvblN0YW5kYXJkTWF0ZXJpYWwuZGlmZnVzZUNvbG9yLnRvTGluZWFyU3BhY2UoYmFieWxvblN0YW5kYXJkTWF0ZXJpYWwuZ2V0U2NlbmUoKS5nZXRFbmdpbmUoKS51c2VFeGFjdFNyZ2JDb252ZXJzaW9ucykuc2NhbGUoMC41KTtcclxuICAgICAgICBjb25zdCBvcGFjaXR5ID0gYmFieWxvblN0YW5kYXJkTWF0ZXJpYWwuYWxwaGE7XHJcbiAgICAgICAgY29uc3Qgc3BlY3VsYXJQb3dlciA9IFNjYWxhci5DbGFtcChiYWJ5bG9uU3RhbmRhcmRNYXRlcmlhbC5zcGVjdWxhclBvd2VyLCAwLCBfR0xURk1hdGVyaWFsRXhwb3J0ZXIuX01heFNwZWN1bGFyUG93ZXIpO1xyXG5cclxuICAgICAgICBjb25zdCByb3VnaG5lc3MgPSBzb2x2ZUZvclJvdWdobmVzcyhzcGVjdWxhclBvd2VyKTtcclxuXHJcbiAgICAgICAgY29uc3QgZ2xURlBick1ldGFsbGljUm91Z2huZXNzOiBJTWF0ZXJpYWxQYnJNZXRhbGxpY1JvdWdobmVzcyA9IHtcclxuICAgICAgICAgICAgYmFzZUNvbG9yRmFjdG9yOiBbZGlmZnVzZS5yLCBkaWZmdXNlLmcsIGRpZmZ1c2UuYiwgb3BhY2l0eV0sXHJcbiAgICAgICAgICAgIG1ldGFsbGljRmFjdG9yOiAwLFxyXG4gICAgICAgICAgICByb3VnaG5lc3NGYWN0b3I6IHJvdWdobmVzcyxcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gZ2xURlBick1ldGFsbGljUm91Z2huZXNzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29tcHV0ZXMgdGhlIG1ldGFsbGljIGZhY3RvclxyXG4gICAgICogQHBhcmFtIGRpZmZ1c2UgZGlmZnVzZWQgdmFsdWVcclxuICAgICAqIEBwYXJhbSBzcGVjdWxhciBzcGVjdWxhciB2YWx1ZVxyXG4gICAgICogQHBhcmFtIG9uZU1pbnVzU3BlY3VsYXJTdHJlbmd0aCBvbmUgbWludXMgdGhlIHNwZWN1bGFyIHN0cmVuZ3RoXHJcbiAgICAgKiBAcmV0dXJucyBtZXRhbGxpYyB2YWx1ZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIF9Tb2x2ZU1ldGFsbGljKGRpZmZ1c2U6IG51bWJlciwgc3BlY3VsYXI6IG51bWJlciwgb25lTWludXNTcGVjdWxhclN0cmVuZ3RoOiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgICAgIGlmIChzcGVjdWxhciA8IHRoaXMuX0RpZWxlY3RyaWNTcGVjdWxhci5yKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX0RpZWxlY3RyaWNTcGVjdWxhcjtcclxuICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBhID0gdGhpcy5fRGllbGVjdHJpY1NwZWN1bGFyLnI7XHJcbiAgICAgICAgY29uc3QgYiA9IChkaWZmdXNlICogb25lTWludXNTcGVjdWxhclN0cmVuZ3RoKSAvICgxLjAgLSB0aGlzLl9EaWVsZWN0cmljU3BlY3VsYXIucikgKyBzcGVjdWxhciAtIDIuMCAqIHRoaXMuX0RpZWxlY3RyaWNTcGVjdWxhci5yO1xyXG4gICAgICAgIGNvbnN0IGMgPSB0aGlzLl9EaWVsZWN0cmljU3BlY3VsYXIuciAtIHNwZWN1bGFyO1xyXG4gICAgICAgIGNvbnN0IEQgPSBiICogYiAtIDQuMCAqIGEgKiBjO1xyXG4gICAgICAgIHJldHVybiBTY2FsYXIuQ2xhbXAoKC1iICsgTWF0aC5zcXJ0KEQpKSAvICgyLjAgKiBhKSwgMCwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIHRoZSBnbFRGIGFscGhhIG1vZGUgdG8gYSBnbFRGIG1hdGVyaWFsIGZyb20gdGhlIEJhYnlsb24gTWF0ZXJpYWxcclxuICAgICAqIEBwYXJhbSBnbFRGTWF0ZXJpYWwgZ2xURiBtYXRlcmlhbFxyXG4gICAgICogQHBhcmFtIGJhYnlsb25NYXRlcmlhbCBCYWJ5bG9uIG1hdGVyaWFsXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgc3RhdGljIF9TZXRBbHBoYU1vZGUoZ2xURk1hdGVyaWFsOiBJTWF0ZXJpYWwsIGJhYnlsb25NYXRlcmlhbDogTWF0ZXJpYWwgJiB7IGFscGhhQ3V0T2ZmOiBudW1iZXIgfSk6IHZvaWQge1xyXG4gICAgICAgIGlmIChiYWJ5bG9uTWF0ZXJpYWwubmVlZEFscGhhQmxlbmRpbmcoKSkge1xyXG4gICAgICAgICAgICBnbFRGTWF0ZXJpYWwuYWxwaGFNb2RlID0gTWF0ZXJpYWxBbHBoYU1vZGUuQkxFTkQ7XHJcbiAgICAgICAgfSBlbHNlIGlmIChiYWJ5bG9uTWF0ZXJpYWwubmVlZEFscGhhVGVzdGluZygpKSB7XHJcbiAgICAgICAgICAgIGdsVEZNYXRlcmlhbC5hbHBoYU1vZGUgPSBNYXRlcmlhbEFscGhhTW9kZS5NQVNLO1xyXG4gICAgICAgICAgICBnbFRGTWF0ZXJpYWwuYWxwaGFDdXRvZmYgPSBiYWJ5bG9uTWF0ZXJpYWwuYWxwaGFDdXRPZmY7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29udmVydHMgYSBCYWJ5bG9uIFN0YW5kYXJkIE1hdGVyaWFsIHRvIGEgZ2xURiBNYXRlcmlhbFxyXG4gICAgICogQHBhcmFtIGJhYnlsb25TdGFuZGFyZE1hdGVyaWFsIEJKUyBTdGFuZGFyZCBNYXRlcmlhbFxyXG4gICAgICogQHBhcmFtIG1pbWVUeXBlIG1pbWUgdHlwZSB0byB1c2UgZm9yIHRoZSB0ZXh0dXJlc1xyXG4gICAgICogQHBhcmFtIGhhc1RleHR1cmVDb29yZHMgc3BlY2lmaWVzIGlmIHRleHR1cmUgY29vcmRpbmF0ZXMgYXJlIHByZXNlbnQgb24gdGhlIHN1Ym1lc2ggdG8gZGV0ZXJtaW5lIGlmIHRleHR1cmVzIHNob3VsZCBiZSBhcHBsaWVkXHJcbiAgICAgKiBAcmV0dXJucyBwcm9taXNlLCByZXNvbHZlZCB3aXRoIHRoZSBtYXRlcmlhbFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgX2NvbnZlcnRTdGFuZGFyZE1hdGVyaWFsQXN5bmMoYmFieWxvblN0YW5kYXJkTWF0ZXJpYWw6IFN0YW5kYXJkTWF0ZXJpYWwsIG1pbWVUeXBlOiBJbWFnZU1pbWVUeXBlLCBoYXNUZXh0dXJlQ29vcmRzOiBib29sZWFuKTogUHJvbWlzZTxJTWF0ZXJpYWw+IHtcclxuICAgICAgICBjb25zdCBtYXRlcmlhbE1hcCA9IHRoaXMuX2V4cG9ydGVyLl9tYXRlcmlhbE1hcDtcclxuICAgICAgICBjb25zdCBtYXRlcmlhbHMgPSB0aGlzLl9leHBvcnRlci5fbWF0ZXJpYWxzO1xyXG4gICAgICAgIGNvbnN0IHByb21pc2VzID0gW107XHJcbiAgICAgICAgY29uc3QgcGJyTWV0YWxsaWNSb3VnaG5lc3MgPSB0aGlzLl9jb252ZXJ0VG9HTFRGUEJSTWV0YWxsaWNSb3VnaG5lc3MoYmFieWxvblN0YW5kYXJkTWF0ZXJpYWwpO1xyXG5cclxuICAgICAgICBjb25zdCBtYXRlcmlhbDogSU1hdGVyaWFsID0geyBuYW1lOiBiYWJ5bG9uU3RhbmRhcmRNYXRlcmlhbC5uYW1lIH07XHJcbiAgICAgICAgaWYgKGJhYnlsb25TdGFuZGFyZE1hdGVyaWFsLmJhY2tGYWNlQ3VsbGluZyAhPSBudWxsICYmICFiYWJ5bG9uU3RhbmRhcmRNYXRlcmlhbC5iYWNrRmFjZUN1bGxpbmcpIHtcclxuICAgICAgICAgICAgaWYgKCFiYWJ5bG9uU3RhbmRhcmRNYXRlcmlhbC50d29TaWRlZExpZ2h0aW5nKSB7XHJcbiAgICAgICAgICAgICAgICBUb29scy5XYXJuKGJhYnlsb25TdGFuZGFyZE1hdGVyaWFsLm5hbWUgKyBcIjogQmFjay1mYWNlIGN1bGxpbmcgZGlzYWJsZWQgYW5kIHR3by1zaWRlZCBsaWdodGluZyBkaXNhYmxlZCBpcyBub3Qgc3VwcG9ydGVkIGluIGdsVEYuXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG1hdGVyaWFsLmRvdWJsZVNpZGVkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGhhc1RleHR1cmVDb29yZHMpIHtcclxuICAgICAgICAgICAgaWYgKGJhYnlsb25TdGFuZGFyZE1hdGVyaWFsLmRpZmZ1c2VUZXh0dXJlKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9taXNlcy5wdXNoKFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2V4cG9ydFRleHR1cmVBc3luYyhiYWJ5bG9uU3RhbmRhcmRNYXRlcmlhbC5kaWZmdXNlVGV4dHVyZSwgbWltZVR5cGUpLnRoZW4oKHRleHR1cmVJbmZvKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0ZXh0dXJlSW5mbykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGJyTWV0YWxsaWNSb3VnaG5lc3MuYmFzZUNvbG9yVGV4dHVyZSA9IHRleHR1cmVJbmZvO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgYnVtcFRleHR1cmUgPSBiYWJ5bG9uU3RhbmRhcmRNYXRlcmlhbC5idW1wVGV4dHVyZTtcclxuICAgICAgICAgICAgaWYgKGJ1bXBUZXh0dXJlKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9taXNlcy5wdXNoKFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2V4cG9ydFRleHR1cmVBc3luYyhidW1wVGV4dHVyZSwgbWltZVR5cGUpLnRoZW4oKHRleHR1cmVJbmZvKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0ZXh0dXJlSW5mbykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0ZXJpYWwubm9ybWFsVGV4dHVyZSA9IHRleHR1cmVJbmZvO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJ1bXBUZXh0dXJlLmxldmVsICE9PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0ZXJpYWwubm9ybWFsVGV4dHVyZS5zY2FsZSA9IGJ1bXBUZXh0dXJlLmxldmVsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGJhYnlsb25TdGFuZGFyZE1hdGVyaWFsLmVtaXNzaXZlVGV4dHVyZSkge1xyXG4gICAgICAgICAgICAgICAgbWF0ZXJpYWwuZW1pc3NpdmVGYWN0b3IgPSBbMS4wLCAxLjAsIDEuMF07XHJcblxyXG4gICAgICAgICAgICAgICAgcHJvbWlzZXMucHVzaChcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9leHBvcnRUZXh0dXJlQXN5bmMoYmFieWxvblN0YW5kYXJkTWF0ZXJpYWwuZW1pc3NpdmVUZXh0dXJlLCBtaW1lVHlwZSkudGhlbigodGV4dHVyZUluZm8pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRleHR1cmVJbmZvKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRlcmlhbC5lbWlzc2l2ZVRleHR1cmUgPSB0ZXh0dXJlSW5mbztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChiYWJ5bG9uU3RhbmRhcmRNYXRlcmlhbC5hbWJpZW50VGV4dHVyZSkge1xyXG4gICAgICAgICAgICAgICAgcHJvbWlzZXMucHVzaChcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9leHBvcnRUZXh0dXJlQXN5bmMoYmFieWxvblN0YW5kYXJkTWF0ZXJpYWwuYW1iaWVudFRleHR1cmUsIG1pbWVUeXBlKS50aGVuKCh0ZXh0dXJlSW5mbykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGV4dHVyZUluZm8pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9jY2x1c2lvblRleHR1cmU6IElNYXRlcmlhbE9jY2x1c2lvblRleHR1cmVJbmZvID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4OiB0ZXh0dXJlSW5mby5pbmRleCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRlcmlhbC5vY2NsdXNpb25UZXh0dXJlID0gb2NjbHVzaW9uVGV4dHVyZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoYmFieWxvblN0YW5kYXJkTWF0ZXJpYWwuYWxwaGEgPCAxLjAgfHwgYmFieWxvblN0YW5kYXJkTWF0ZXJpYWwub3BhY2l0eVRleHR1cmUpIHtcclxuICAgICAgICAgICAgaWYgKGJhYnlsb25TdGFuZGFyZE1hdGVyaWFsLmFscGhhTW9kZSA9PT0gQ29uc3RhbnRzLkFMUEhBX0NPTUJJTkUpIHtcclxuICAgICAgICAgICAgICAgIG1hdGVyaWFsLmFscGhhTW9kZSA9IE1hdGVyaWFsQWxwaGFNb2RlLkJMRU5EO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgVG9vbHMuV2FybihiYWJ5bG9uU3RhbmRhcmRNYXRlcmlhbC5uYW1lICsgXCI6IGdsVEYgMi4wIGRvZXMgbm90IHN1cHBvcnQgYWxwaGEgbW9kZTogXCIgKyBiYWJ5bG9uU3RhbmRhcmRNYXRlcmlhbC5hbHBoYU1vZGUudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGJhYnlsb25TdGFuZGFyZE1hdGVyaWFsLmVtaXNzaXZlQ29sb3IgJiYgIV9HTFRGTWF0ZXJpYWxFeHBvcnRlci5fRnV6enlFcXVhbHMoYmFieWxvblN0YW5kYXJkTWF0ZXJpYWwuZW1pc3NpdmVDb2xvciwgQ29sb3IzLkJsYWNrKCksIF9HTFRGTWF0ZXJpYWxFeHBvcnRlci5fRXBzaWxvbikpIHtcclxuICAgICAgICAgICAgbWF0ZXJpYWwuZW1pc3NpdmVGYWN0b3IgPSBiYWJ5bG9uU3RhbmRhcmRNYXRlcmlhbC5lbWlzc2l2ZUNvbG9yLmFzQXJyYXkoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG1hdGVyaWFsLnBick1ldGFsbGljUm91Z2huZXNzID0gcGJyTWV0YWxsaWNSb3VnaG5lc3M7XHJcbiAgICAgICAgX0dMVEZNYXRlcmlhbEV4cG9ydGVyLl9TZXRBbHBoYU1vZGUobWF0ZXJpYWwsIGJhYnlsb25TdGFuZGFyZE1hdGVyaWFsKTtcclxuXHJcbiAgICAgICAgbWF0ZXJpYWxzLnB1c2gobWF0ZXJpYWwpO1xyXG4gICAgICAgIG1hdGVyaWFsTWFwW2JhYnlsb25TdGFuZGFyZE1hdGVyaWFsLnVuaXF1ZUlkXSA9IG1hdGVyaWFscy5sZW5ndGggLSAxO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fZmluaXNoTWF0ZXJpYWwocHJvbWlzZXMsIG1hdGVyaWFsLCBiYWJ5bG9uU3RhbmRhcmRNYXRlcmlhbCwgbWltZVR5cGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2ZpbmlzaE1hdGVyaWFsPFQ+KHByb21pc2VzOiBQcm9taXNlPFQ+W10sIGdsVEZNYXRlcmlhbDogSU1hdGVyaWFsLCBiYWJ5bG9uTWF0ZXJpYWw6IE1hdGVyaWFsLCBtaW1lVHlwZTogSW1hZ2VNaW1lVHlwZSkge1xyXG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRleHR1cmVzID0gdGhpcy5fZXhwb3J0ZXIuX2V4dGVuc2lvbnNQb3N0RXhwb3J0TWF0ZXJpYWxBZGRpdGlvbmFsVGV4dHVyZXMoXCJleHBvcnRNYXRlcmlhbFwiLCBnbFRGTWF0ZXJpYWwsIGJhYnlsb25NYXRlcmlhbCk7XHJcbiAgICAgICAgICAgIGxldCB0YXNrczogTnVsbGFibGU8UHJvbWlzZTxOdWxsYWJsZTxJVGV4dHVyZUluZm8+PltdPiA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IHRleHR1cmUgb2YgdGV4dHVyZXMpIHtcclxuICAgICAgICAgICAgICAgIGlmICghdGFza3MpIHtcclxuICAgICAgICAgICAgICAgICAgICB0YXNrcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGFza3MucHVzaCh0aGlzLl9leHBvcnRUZXh0dXJlQXN5bmModGV4dHVyZSwgbWltZVR5cGUpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCF0YXNrcykge1xyXG4gICAgICAgICAgICAgICAgdGFza3MgPSBbUHJvbWlzZS5yZXNvbHZlKG51bGwpXTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHRhc2tzKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGV4dGVuc2lvbldvcmsgPSB0aGlzLl9leHBvcnRlci5fZXh0ZW5zaW9uc1Bvc3RFeHBvcnRNYXRlcmlhbEFzeW5jKFwiZXhwb3J0TWF0ZXJpYWxcIiwgZ2xURk1hdGVyaWFsLCBiYWJ5bG9uTWF0ZXJpYWwpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFleHRlbnNpb25Xb3JrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdsVEZNYXRlcmlhbDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBleHRlbnNpb25Xb3JrLnRoZW4oKCkgPT4gZ2xURk1hdGVyaWFsKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb252ZXJ0cyBhbiBpbWFnZSB0eXBlZCBhcnJheSBidWZmZXIgdG8gYSBiYXNlNjQgaW1hZ2VcclxuICAgICAqIEBwYXJhbSBidWZmZXIgdHlwZWQgYXJyYXkgYnVmZmVyXHJcbiAgICAgKiBAcGFyYW0gd2lkdGggd2lkdGggb2YgdGhlIGltYWdlXHJcbiAgICAgKiBAcGFyYW0gaGVpZ2h0IGhlaWdodCBvZiB0aGUgaW1hZ2VcclxuICAgICAqIEBwYXJhbSBtaW1lVHlwZSBtaW1ldHlwZSBvZiB0aGUgaW1hZ2VcclxuICAgICAqIEByZXR1cm5zIGJhc2U2NCBpbWFnZSBzdHJpbmdcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBhc3luYyBfZ2V0SW1hZ2VEYXRhQXN5bmMoYnVmZmVyOiBVaW50OEFycmF5IHwgRmxvYXQzMkFycmF5LCB3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlciwgbWltZVR5cGU6IEltYWdlTWltZVR5cGUpOiBQcm9taXNlPEFycmF5QnVmZmVyPiB7XHJcbiAgICAgICAgY29uc3QgdGV4dHVyZVR5cGUgPSBDb25zdGFudHMuVEVYVFVSRVRZUEVfVU5TSUdORURfSU5UO1xyXG5cclxuICAgICAgICBjb25zdCBob3N0aW5nU2NlbmUgPSB0aGlzLl9leHBvcnRlci5fYmFieWxvblNjZW5lO1xyXG4gICAgICAgIGNvbnN0IGVuZ2luZSA9IGhvc3RpbmdTY2VuZS5nZXRFbmdpbmUoKTtcclxuXHJcbiAgICAgICAgLy8gQ3JlYXRlIGEgdGVtcG9yYXJ5IHRleHR1cmUgd2l0aCB0aGUgdGV4dHVyZSBidWZmZXIgZGF0YVxyXG4gICAgICAgIGNvbnN0IHRlbXBUZXh0dXJlID0gZW5naW5lLmNyZWF0ZVJhd1RleHR1cmUoYnVmZmVyLCB3aWR0aCwgaGVpZ2h0LCBDb25zdGFudHMuVEVYVFVSRUZPUk1BVF9SR0JBLCBmYWxzZSwgdHJ1ZSwgVGV4dHVyZS5ORUFSRVNUX1NBTVBMSU5HTU9ERSwgbnVsbCwgdGV4dHVyZVR5cGUpO1xyXG5cclxuICAgICAgICBhd2FpdCBUZXh0dXJlVG9vbHMuQXBwbHlQb3N0UHJvY2VzcyhcInBhc3NcIiwgdGVtcFRleHR1cmUsIGhvc3RpbmdTY2VuZSwgdGV4dHVyZVR5cGUsIENvbnN0YW50cy5URVhUVVJFX05FQVJFU1RfU0FNUExJTkdNT0RFLCBDb25zdGFudHMuVEVYVFVSRUZPUk1BVF9SR0JBKTtcclxuXHJcbiAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IGVuZ2luZS5fcmVhZFRleHR1cmVQaXhlbHModGVtcFRleHR1cmUsIHdpZHRoLCBoZWlnaHQpO1xyXG5cclxuICAgICAgICByZXR1cm4gKGF3YWl0IER1bXBUb29scy5EdW1wRGF0YUFzeW5jKHdpZHRoLCBoZWlnaHQsIGRhdGEsIG1pbWVUeXBlLCB1bmRlZmluZWQsIHRydWUsIHRydWUpKSBhcyBBcnJheUJ1ZmZlcjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdlbmVyYXRlcyBhIHdoaXRlIHRleHR1cmUgYmFzZWQgb24gdGhlIHNwZWNpZmllZCB3aWR0aCBhbmQgaGVpZ2h0XHJcbiAgICAgKiBAcGFyYW0gd2lkdGggd2lkdGggb2YgdGhlIHRleHR1cmUgaW4gcGl4ZWxzXHJcbiAgICAgKiBAcGFyYW0gaGVpZ2h0IGhlaWdodCBvZiB0aGUgdGV4dHVyZSBpbiBwaXhlbHNcclxuICAgICAqIEBwYXJhbSBzY2VuZSBiYWJ5bG9uanMgc2NlbmVcclxuICAgICAqIEByZXR1cm5zIHdoaXRlIHRleHR1cmVcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBfY3JlYXRlV2hpdGVUZXh0dXJlKHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyLCBzY2VuZTogU2NlbmUpOiBUZXh0dXJlIHtcclxuICAgICAgICBjb25zdCBkYXRhID0gbmV3IFVpbnQ4QXJyYXkod2lkdGggKiBoZWlnaHQgKiA0KTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSA9IGkgKyA0KSB7XHJcbiAgICAgICAgICAgIGRhdGFbaV0gPSBkYXRhW2kgKyAxXSA9IGRhdGFbaSArIDJdID0gZGF0YVtpICsgM10gPSAweGZmO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgcmF3VGV4dHVyZSA9IFJhd1RleHR1cmUuQ3JlYXRlUkdCQVRleHR1cmUoZGF0YSwgd2lkdGgsIGhlaWdodCwgc2NlbmUpO1xyXG5cclxuICAgICAgICByZXR1cm4gcmF3VGV4dHVyZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlc2l6ZXMgdGhlIHR3byBzb3VyY2UgdGV4dHVyZXMgdG8gdGhlIHNhbWUgZGltZW5zaW9ucy4gIElmIGEgdGV4dHVyZSBpcyBudWxsLCBhIGRlZmF1bHQgd2hpdGUgdGV4dHVyZSBpcyBnZW5lcmF0ZWQuICBJZiBib3RoIHRleHR1cmVzIGFyZSBudWxsLCByZXR1cm5zIG51bGxcclxuICAgICAqIEBwYXJhbSB0ZXh0dXJlMSBmaXJzdCB0ZXh0dXJlIHRvIHJlc2l6ZVxyXG4gICAgICogQHBhcmFtIHRleHR1cmUyIHNlY29uZCB0ZXh0dXJlIHRvIHJlc2l6ZVxyXG4gICAgICogQHBhcmFtIHNjZW5lIGJhYnlsb25qcyBzY2VuZVxyXG4gICAgICogQHJldHVybnMgcmVzaXplZCB0ZXh0dXJlcyBvciBudWxsXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgX3Jlc2l6ZVRleHR1cmVzVG9TYW1lRGltZW5zaW9ucyh0ZXh0dXJlMTogTnVsbGFibGU8QmFzZVRleHR1cmU+LCB0ZXh0dXJlMjogTnVsbGFibGU8QmFzZVRleHR1cmU+LCBzY2VuZTogU2NlbmUpOiB7IHRleHR1cmUxOiBCYXNlVGV4dHVyZTsgdGV4dHVyZTI6IEJhc2VUZXh0dXJlIH0ge1xyXG4gICAgICAgIGNvbnN0IHRleHR1cmUxU2l6ZSA9IHRleHR1cmUxID8gdGV4dHVyZTEuZ2V0U2l6ZSgpIDogeyB3aWR0aDogMCwgaGVpZ2h0OiAwIH07XHJcbiAgICAgICAgY29uc3QgdGV4dHVyZTJTaXplID0gdGV4dHVyZTIgPyB0ZXh0dXJlMi5nZXRTaXplKCkgOiB7IHdpZHRoOiAwLCBoZWlnaHQ6IDAgfTtcclxuICAgICAgICBsZXQgcmVzaXplZFRleHR1cmUxOiBCYXNlVGV4dHVyZTtcclxuICAgICAgICBsZXQgcmVzaXplZFRleHR1cmUyOiBCYXNlVGV4dHVyZTtcclxuXHJcbiAgICAgICAgaWYgKHRleHR1cmUxU2l6ZS53aWR0aCA8IHRleHR1cmUyU2l6ZS53aWR0aCkge1xyXG4gICAgICAgICAgICBpZiAodGV4dHVyZTEgJiYgdGV4dHVyZTEgaW5zdGFuY2VvZiBUZXh0dXJlKSB7XHJcbiAgICAgICAgICAgICAgICByZXNpemVkVGV4dHVyZTEgPSBUZXh0dXJlVG9vbHMuQ3JlYXRlUmVzaXplZENvcHkodGV4dHVyZTEsIHRleHR1cmUyU2l6ZS53aWR0aCwgdGV4dHVyZTJTaXplLmhlaWdodCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXNpemVkVGV4dHVyZTEgPSB0aGlzLl9jcmVhdGVXaGl0ZVRleHR1cmUodGV4dHVyZTJTaXplLndpZHRoLCB0ZXh0dXJlMlNpemUuaGVpZ2h0LCBzY2VuZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmVzaXplZFRleHR1cmUyID0gdGV4dHVyZTIhO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGV4dHVyZTFTaXplLndpZHRoID4gdGV4dHVyZTJTaXplLndpZHRoKSB7XHJcbiAgICAgICAgICAgIGlmICh0ZXh0dXJlMiAmJiB0ZXh0dXJlMiBpbnN0YW5jZW9mIFRleHR1cmUpIHtcclxuICAgICAgICAgICAgICAgIHJlc2l6ZWRUZXh0dXJlMiA9IFRleHR1cmVUb29scy5DcmVhdGVSZXNpemVkQ29weSh0ZXh0dXJlMiwgdGV4dHVyZTFTaXplLndpZHRoLCB0ZXh0dXJlMVNpemUuaGVpZ2h0LCB0cnVlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlc2l6ZWRUZXh0dXJlMiA9IHRoaXMuX2NyZWF0ZVdoaXRlVGV4dHVyZSh0ZXh0dXJlMVNpemUud2lkdGgsIHRleHR1cmUxU2l6ZS5oZWlnaHQsIHNjZW5lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXNpemVkVGV4dHVyZTEgPSB0ZXh0dXJlMSE7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmVzaXplZFRleHR1cmUxID0gdGV4dHVyZTEhO1xyXG4gICAgICAgICAgICByZXNpemVkVGV4dHVyZTIgPSB0ZXh0dXJlMiE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB0ZXh0dXJlMTogcmVzaXplZFRleHR1cmUxISxcclxuICAgICAgICAgICAgdGV4dHVyZTI6IHJlc2l6ZWRUZXh0dXJlMiEsXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnZlcnRzIGFuIGFycmF5IG9mIHBpeGVscyB0byBhIEZsb2F0MzJBcnJheVxyXG4gICAgICogVGhyb3dzIGFuIGVycm9yIGlmIHRoZSBwaXhlbCBmb3JtYXQgaXMgbm90IHN1cHBvcnRlZFxyXG4gICAgICogQHBhcmFtIHBpeGVscyAtIGFycmF5IGJ1ZmZlciBjb250YWluaW5nIHBpeGVsIHZhbHVlc1xyXG4gICAgICogQHJldHVybnMgRmxvYXQzMiBvZiBwaXhlbHNcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBfY29udmVydFBpeGVsQXJyYXlUb0Zsb2F0MzIocGl4ZWxzOiBBcnJheUJ1ZmZlclZpZXcpOiBGbG9hdDMyQXJyYXkge1xyXG4gICAgICAgIGlmIChwaXhlbHMgaW5zdGFuY2VvZiBVaW50OEFycmF5KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGxlbmd0aCA9IHBpeGVscy5sZW5ndGg7XHJcbiAgICAgICAgICAgIGNvbnN0IGJ1ZmZlciA9IG5ldyBGbG9hdDMyQXJyYXkocGl4ZWxzLmxlbmd0aCk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgICAgIGJ1ZmZlcltpXSA9IHBpeGVsc1tpXSAvIDI1NTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gYnVmZmVyO1xyXG4gICAgICAgIH0gZWxzZSBpZiAocGl4ZWxzIGluc3RhbmNlb2YgRmxvYXQzMkFycmF5KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBwaXhlbHM7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5zdXBwb3J0ZWQgcGl4ZWwgZm9ybWF0IVwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb252ZXJ0IFNwZWN1bGFyIEdsb3NzaW5lc3MgVGV4dHVyZXMgdG8gTWV0YWxsaWMgUm91Z2huZXNzXHJcbiAgICAgKiBTZWUgbGluayBiZWxvdyBmb3IgaW5mbyBvbiB0aGUgbWF0ZXJpYWwgY29udmVyc2lvbnMgZnJvbSBQQlIgTWV0YWxsaWMvUm91Z2huZXNzIGFuZCBTcGVjdWxhci9HbG9zc2luZXNzXHJcbiAgICAgKiBAbGluayBodHRwczovL2dpdGh1Yi5jb20vS2hyb25vc0dyb3VwL2dsVEYvYmxvYi9tYWluL2V4dGVuc2lvbnMvMi4wL0FyY2hpdmVkL0tIUl9tYXRlcmlhbHNfcGJyU3BlY3VsYXJHbG9zc2luZXNzL2V4YW1wbGVzL2NvbnZlcnQtYmV0d2Vlbi13b3JrZmxvd3MtYmpzL2pzL2JhYnlsb24ucGJyVXRpbGl0aWVzLmpzXHJcbiAgICAgKiBAcGFyYW0gZGlmZnVzZVRleHR1cmUgdGV4dHVyZSB1c2VkIHRvIHN0b3JlIGRpZmZ1c2UgaW5mb3JtYXRpb25cclxuICAgICAqIEBwYXJhbSBzcGVjdWxhckdsb3NzaW5lc3NUZXh0dXJlIHRleHR1cmUgdXNlZCB0byBzdG9yZSBzcGVjdWxhciBhbmQgZ2xvc3NpbmVzcyBpbmZvcm1hdGlvblxyXG4gICAgICogQHBhcmFtIGZhY3RvcnMgc3BlY3VsYXIgZ2xvc3NpbmVzcyBtYXRlcmlhbCBmYWN0b3JzXHJcbiAgICAgKiBAcGFyYW0gbWltZVR5cGUgdGhlIG1pbWUgdHlwZSB0byB1c2UgZm9yIHRoZSB0ZXh0dXJlXHJcbiAgICAgKiBAcmV0dXJucyBwYnIgbWV0YWxsaWMgcm91Z2huZXNzIGludGVyZmFjZSBvciBudWxsXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgYXN5bmMgX2NvbnZlcnRTcGVjdWxhckdsb3NzaW5lc3NUZXh0dXJlc1RvTWV0YWxsaWNSb3VnaG5lc3NBc3luYyhcclxuICAgICAgICBkaWZmdXNlVGV4dHVyZTogTnVsbGFibGU8QmFzZVRleHR1cmU+LFxyXG4gICAgICAgIHNwZWN1bGFyR2xvc3NpbmVzc1RleHR1cmU6IE51bGxhYmxlPEJhc2VUZXh0dXJlPixcclxuICAgICAgICBmYWN0b3JzOiBfSVBCUlNwZWN1bGFyR2xvc3NpbmVzcyxcclxuICAgICAgICBtaW1lVHlwZTogSW1hZ2VNaW1lVHlwZVxyXG4gICAgKTogUHJvbWlzZTxfSVBCUk1ldGFsbGljUm91Z2huZXNzPiB7XHJcbiAgICAgICAgY29uc3QgcHJvbWlzZXMgPSBuZXcgQXJyYXk8UHJvbWlzZTx2b2lkPj4oKTtcclxuICAgICAgICBpZiAoIShkaWZmdXNlVGV4dHVyZSB8fCBzcGVjdWxhckdsb3NzaW5lc3NUZXh0dXJlKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoXCJfQ29udmVydFNwZWN1bGFyR2xvc2luZXNzVGV4dHVyZXNUb01ldGFsbGljUm91Z2huZXNzOiBkaWZmdXNlIGFuZCBzcGVjdWxhciBnbG9zc2luZXNzIHRleHR1cmVzIGFyZSBub3QgZGVmaW5lZCFcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBzY2VuZTogTnVsbGFibGU8U2NlbmU+ID0gZGlmZnVzZVRleHR1cmUgPyBkaWZmdXNlVGV4dHVyZS5nZXRTY2VuZSgpIDogc3BlY3VsYXJHbG9zc2luZXNzVGV4dHVyZSA/IHNwZWN1bGFyR2xvc3NpbmVzc1RleHR1cmUuZ2V0U2NlbmUoKSA6IG51bGw7XHJcbiAgICAgICAgaWYgKHNjZW5lKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc2l6ZWRUZXh0dXJlcyA9IHRoaXMuX3Jlc2l6ZVRleHR1cmVzVG9TYW1lRGltZW5zaW9ucyhkaWZmdXNlVGV4dHVyZSwgc3BlY3VsYXJHbG9zc2luZXNzVGV4dHVyZSwgc2NlbmUpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgZGlmZnVzZVNpemUgPSByZXNpemVkVGV4dHVyZXMudGV4dHVyZTE/LmdldFNpemUoKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBkaWZmdXNlQnVmZmVyOiBGbG9hdDMyQXJyYXk7XHJcbiAgICAgICAgICAgIGxldCBzcGVjdWxhckdsb3NzaW5lc3NCdWZmZXI6IEZsb2F0MzJBcnJheTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHdpZHRoID0gZGlmZnVzZVNpemUud2lkdGg7XHJcbiAgICAgICAgICAgIGNvbnN0IGhlaWdodCA9IGRpZmZ1c2VTaXplLmhlaWdodDtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGRpZmZ1c2VQaXhlbHMgPSBhd2FpdCByZXNpemVkVGV4dHVyZXMudGV4dHVyZTEucmVhZFBpeGVscygpO1xyXG4gICAgICAgICAgICBjb25zdCBzcGVjdWxhclBpeGVscyA9IGF3YWl0IHJlc2l6ZWRUZXh0dXJlcy50ZXh0dXJlMi5yZWFkUGl4ZWxzKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoZGlmZnVzZVBpeGVscykge1xyXG4gICAgICAgICAgICAgICAgZGlmZnVzZUJ1ZmZlciA9IHRoaXMuX2NvbnZlcnRQaXhlbEFycmF5VG9GbG9hdDMyKGRpZmZ1c2VQaXhlbHMpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KFwiRmFpbGVkIHRvIHJldHJpZXZlIHBpeGVscyBmcm9tIGRpZmZ1c2UgdGV4dHVyZSFcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHNwZWN1bGFyUGl4ZWxzKSB7XHJcbiAgICAgICAgICAgICAgICBzcGVjdWxhckdsb3NzaW5lc3NCdWZmZXIgPSB0aGlzLl9jb252ZXJ0UGl4ZWxBcnJheVRvRmxvYXQzMihzcGVjdWxhclBpeGVscyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoXCJGYWlsZWQgdG8gcmV0cmlldmUgcGl4ZWxzIGZyb20gc3BlY3VsYXIgZ2xvc3NpbmVzcyB0ZXh0dXJlIVwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgYnl0ZUxlbmd0aCA9IHNwZWN1bGFyR2xvc3NpbmVzc0J1ZmZlci5ieXRlTGVuZ3RoO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgbWV0YWxsaWNSb3VnaG5lc3NCdWZmZXIgPSBuZXcgVWludDhBcnJheShieXRlTGVuZ3RoKTtcclxuICAgICAgICAgICAgY29uc3QgYmFzZUNvbG9yQnVmZmVyID0gbmV3IFVpbnQ4QXJyYXkoYnl0ZUxlbmd0aCk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBzdHJpZGVTaXplID0gNDtcclxuICAgICAgICAgICAgY29uc3QgbWF4QmFzZUNvbG9yID0gQ29sb3IzLkJsYWNrKCk7XHJcbiAgICAgICAgICAgIGxldCBtYXhNZXRhbGxpYyA9IDA7XHJcbiAgICAgICAgICAgIGxldCBtYXhSb3VnaG5lc3MgPSAwO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaCA9IDA7IGggPCBoZWlnaHQ7ICsraCkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgdyA9IDA7IHcgPCB3aWR0aDsgKyt3KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb2Zmc2V0ID0gKHdpZHRoICogaCArIHcpICogc3RyaWRlU2l6ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGlmZnVzZUNvbG9yID0gbmV3IENvbG9yMyhkaWZmdXNlQnVmZmVyW29mZnNldF0sIGRpZmZ1c2VCdWZmZXJbb2Zmc2V0ICsgMV0sIGRpZmZ1c2VCdWZmZXJbb2Zmc2V0ICsgMl0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC50b0xpbmVhclNwYWNlKHNjZW5lLmdldEVuZ2luZSgpLnVzZUV4YWN0U3JnYkNvbnZlcnNpb25zKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAubXVsdGlwbHkoZmFjdG9ycy5kaWZmdXNlQ29sb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNwZWN1bGFyQ29sb3IgPSBuZXcgQ29sb3IzKHNwZWN1bGFyR2xvc3NpbmVzc0J1ZmZlcltvZmZzZXRdLCBzcGVjdWxhckdsb3NzaW5lc3NCdWZmZXJbb2Zmc2V0ICsgMV0sIHNwZWN1bGFyR2xvc3NpbmVzc0J1ZmZlcltvZmZzZXQgKyAyXSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnRvTGluZWFyU3BhY2Uoc2NlbmUuZ2V0RW5naW5lKCkudXNlRXhhY3RTcmdiQ29udmVyc2lvbnMpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tdWx0aXBseShmYWN0b3JzLnNwZWN1bGFyQ29sb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGdsb3NzaW5lc3MgPSBzcGVjdWxhckdsb3NzaW5lc3NCdWZmZXJbb2Zmc2V0ICsgM10gKiBmYWN0b3JzLmdsb3NzaW5lc3M7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNwZWN1bGFyR2xvc3NpbmVzczogX0lQQlJTcGVjdWxhckdsb3NzaW5lc3MgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpZmZ1c2VDb2xvcjogZGlmZnVzZUNvbG9yLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzcGVjdWxhckNvbG9yOiBzcGVjdWxhckNvbG9yLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBnbG9zc2luZXNzOiBnbG9zc2luZXNzLFxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG1ldGFsbGljUm91Z2huZXNzID0gdGhpcy5fY29udmVydFNwZWN1bGFyR2xvc3NpbmVzc1RvTWV0YWxsaWNSb3VnaG5lc3Moc3BlY3VsYXJHbG9zc2luZXNzKTtcclxuICAgICAgICAgICAgICAgICAgICBtYXhCYXNlQ29sb3IuciA9IE1hdGgubWF4KG1heEJhc2VDb2xvci5yLCBtZXRhbGxpY1JvdWdobmVzcy5iYXNlQ29sb3Iucik7XHJcbiAgICAgICAgICAgICAgICAgICAgbWF4QmFzZUNvbG9yLmcgPSBNYXRoLm1heChtYXhCYXNlQ29sb3IuZywgbWV0YWxsaWNSb3VnaG5lc3MuYmFzZUNvbG9yLmcpO1xyXG4gICAgICAgICAgICAgICAgICAgIG1heEJhc2VDb2xvci5iID0gTWF0aC5tYXgobWF4QmFzZUNvbG9yLmIsIG1ldGFsbGljUm91Z2huZXNzLmJhc2VDb2xvci5iKTtcclxuICAgICAgICAgICAgICAgICAgICBtYXhNZXRhbGxpYyA9IE1hdGgubWF4KG1heE1ldGFsbGljLCBtZXRhbGxpY1JvdWdobmVzcy5tZXRhbGxpYyEpO1xyXG4gICAgICAgICAgICAgICAgICAgIG1heFJvdWdobmVzcyA9IE1hdGgubWF4KG1heFJvdWdobmVzcywgbWV0YWxsaWNSb3VnaG5lc3Mucm91Z2huZXNzISk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGJhc2VDb2xvckJ1ZmZlcltvZmZzZXRdID0gbWV0YWxsaWNSb3VnaG5lc3MuYmFzZUNvbG9yLnIgKiAyNTU7XHJcbiAgICAgICAgICAgICAgICAgICAgYmFzZUNvbG9yQnVmZmVyW29mZnNldCArIDFdID0gbWV0YWxsaWNSb3VnaG5lc3MuYmFzZUNvbG9yLmcgKiAyNTU7XHJcbiAgICAgICAgICAgICAgICAgICAgYmFzZUNvbG9yQnVmZmVyW29mZnNldCArIDJdID0gbWV0YWxsaWNSb3VnaG5lc3MuYmFzZUNvbG9yLmIgKiAyNTU7XHJcbiAgICAgICAgICAgICAgICAgICAgYmFzZUNvbG9yQnVmZmVyW29mZnNldCArIDNdID0gcmVzaXplZFRleHR1cmVzLnRleHR1cmUxLmhhc0FscGhhID8gZGlmZnVzZUJ1ZmZlcltvZmZzZXQgKyAzXSAqIDI1NSA6IDI1NTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbWV0YWxsaWNSb3VnaG5lc3NCdWZmZXJbb2Zmc2V0XSA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgbWV0YWxsaWNSb3VnaG5lc3NCdWZmZXJbb2Zmc2V0ICsgMV0gPSBtZXRhbGxpY1JvdWdobmVzcy5yb3VnaG5lc3MhICogMjU1O1xyXG4gICAgICAgICAgICAgICAgICAgIG1ldGFsbGljUm91Z2huZXNzQnVmZmVyW29mZnNldCArIDJdID0gbWV0YWxsaWNSb3VnaG5lc3MubWV0YWxsaWMhICogMjU1O1xyXG4gICAgICAgICAgICAgICAgICAgIG1ldGFsbGljUm91Z2huZXNzQnVmZmVyW29mZnNldCArIDNdID0gMjU1O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBSZXRyaWV2ZXMgdGhlIG1ldGFsbGljIHJvdWdobmVzcyBmYWN0b3JzIGZyb20gdGhlIG1heGltdW0gdGV4dHVyZSB2YWx1ZXMuXHJcbiAgICAgICAgICAgIGNvbnN0IG1ldGFsbGljUm91Z2huZXNzRmFjdG9yczogX0lQQlJNZXRhbGxpY1JvdWdobmVzcyA9IHtcclxuICAgICAgICAgICAgICAgIGJhc2VDb2xvcjogbWF4QmFzZUNvbG9yLFxyXG4gICAgICAgICAgICAgICAgbWV0YWxsaWM6IG1heE1ldGFsbGljLFxyXG4gICAgICAgICAgICAgICAgcm91Z2huZXNzOiBtYXhSb3VnaG5lc3MsXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBsZXQgd3JpdGVPdXRNZXRhbGxpY1JvdWdobmVzc1RleHR1cmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgbGV0IHdyaXRlT3V0QmFzZUNvbG9yVGV4dHVyZSA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaCA9IDA7IGggPCBoZWlnaHQ7ICsraCkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgdyA9IDA7IHcgPCB3aWR0aDsgKyt3KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVzdGluYXRpb25PZmZzZXQgPSAod2lkdGggKiBoICsgdykgKiBzdHJpZGVTaXplO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBiYXNlQ29sb3JCdWZmZXJbZGVzdGluYXRpb25PZmZzZXRdIC89IG1ldGFsbGljUm91Z2huZXNzRmFjdG9ycy5iYXNlQ29sb3IuciA+IF9HTFRGTWF0ZXJpYWxFeHBvcnRlci5fRXBzaWxvbiA/IG1ldGFsbGljUm91Z2huZXNzRmFjdG9ycy5iYXNlQ29sb3IuciA6IDE7XHJcbiAgICAgICAgICAgICAgICAgICAgYmFzZUNvbG9yQnVmZmVyW2Rlc3RpbmF0aW9uT2Zmc2V0ICsgMV0gLz0gbWV0YWxsaWNSb3VnaG5lc3NGYWN0b3JzLmJhc2VDb2xvci5nID4gX0dMVEZNYXRlcmlhbEV4cG9ydGVyLl9FcHNpbG9uID8gbWV0YWxsaWNSb3VnaG5lc3NGYWN0b3JzLmJhc2VDb2xvci5nIDogMTtcclxuICAgICAgICAgICAgICAgICAgICBiYXNlQ29sb3JCdWZmZXJbZGVzdGluYXRpb25PZmZzZXQgKyAyXSAvPSBtZXRhbGxpY1JvdWdobmVzc0ZhY3RvcnMuYmFzZUNvbG9yLmIgPiBfR0xURk1hdGVyaWFsRXhwb3J0ZXIuX0Vwc2lsb24gPyBtZXRhbGxpY1JvdWdobmVzc0ZhY3RvcnMuYmFzZUNvbG9yLmIgOiAxO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBsaW5lYXJCYXNlQ29sb3JQaXhlbCA9IENvbG9yMy5Gcm9tSW50cyhcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmFzZUNvbG9yQnVmZmVyW2Rlc3RpbmF0aW9uT2Zmc2V0XSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmFzZUNvbG9yQnVmZmVyW2Rlc3RpbmF0aW9uT2Zmc2V0ICsgMV0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhc2VDb2xvckJ1ZmZlcltkZXN0aW5hdGlvbk9mZnNldCArIDJdXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzUkdCQmFzZUNvbG9yUGl4ZWwgPSBsaW5lYXJCYXNlQ29sb3JQaXhlbC50b0dhbW1hU3BhY2Uoc2NlbmUuZ2V0RW5naW5lKCkudXNlRXhhY3RTcmdiQ29udmVyc2lvbnMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJhc2VDb2xvckJ1ZmZlcltkZXN0aW5hdGlvbk9mZnNldF0gPSBzUkdCQmFzZUNvbG9yUGl4ZWwuciAqIDI1NTtcclxuICAgICAgICAgICAgICAgICAgICBiYXNlQ29sb3JCdWZmZXJbZGVzdGluYXRpb25PZmZzZXQgKyAxXSA9IHNSR0JCYXNlQ29sb3JQaXhlbC5nICogMjU1O1xyXG4gICAgICAgICAgICAgICAgICAgIGJhc2VDb2xvckJ1ZmZlcltkZXN0aW5hdGlvbk9mZnNldCArIDJdID0gc1JHQkJhc2VDb2xvclBpeGVsLmIgKiAyNTU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghX0dMVEZNYXRlcmlhbEV4cG9ydGVyLl9GdXp6eUVxdWFscyhzUkdCQmFzZUNvbG9yUGl4ZWwsIENvbG9yMy5XaGl0ZSgpLCBfR0xURk1hdGVyaWFsRXhwb3J0ZXIuX0Vwc2lsb24pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdyaXRlT3V0QmFzZUNvbG9yVGV4dHVyZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBtZXRhbGxpY1JvdWdobmVzc0J1ZmZlcltkZXN0aW5hdGlvbk9mZnNldCArIDFdIC89XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGFsbGljUm91Z2huZXNzRmFjdG9ycy5yb3VnaG5lc3MhID4gX0dMVEZNYXRlcmlhbEV4cG9ydGVyLl9FcHNpbG9uID8gbWV0YWxsaWNSb3VnaG5lc3NGYWN0b3JzLnJvdWdobmVzcyEgOiAxO1xyXG4gICAgICAgICAgICAgICAgICAgIG1ldGFsbGljUm91Z2huZXNzQnVmZmVyW2Rlc3RpbmF0aW9uT2Zmc2V0ICsgMl0gLz0gbWV0YWxsaWNSb3VnaG5lc3NGYWN0b3JzLm1ldGFsbGljISA+IF9HTFRGTWF0ZXJpYWxFeHBvcnRlci5fRXBzaWxvbiA/IG1ldGFsbGljUm91Z2huZXNzRmFjdG9ycy5tZXRhbGxpYyEgOiAxO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBtZXRhbGxpY1JvdWdobmVzc1BpeGVsID0gQ29sb3IzLkZyb21JbnRzKDI1NSwgbWV0YWxsaWNSb3VnaG5lc3NCdWZmZXJbZGVzdGluYXRpb25PZmZzZXQgKyAxXSwgbWV0YWxsaWNSb3VnaG5lc3NCdWZmZXJbZGVzdGluYXRpb25PZmZzZXQgKyAyXSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghX0dMVEZNYXRlcmlhbEV4cG9ydGVyLl9GdXp6eUVxdWFscyhtZXRhbGxpY1JvdWdobmVzc1BpeGVsLCBDb2xvcjMuV2hpdGUoKSwgX0dMVEZNYXRlcmlhbEV4cG9ydGVyLl9FcHNpbG9uKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3cml0ZU91dE1ldGFsbGljUm91Z2huZXNzVGV4dHVyZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAod3JpdGVPdXRNZXRhbGxpY1JvdWdobmVzc1RleHR1cmUpIHtcclxuICAgICAgICAgICAgICAgIHByb21pc2VzLnB1c2goXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZ2V0SW1hZ2VEYXRhQXN5bmMobWV0YWxsaWNSb3VnaG5lc3NCdWZmZXIsIHdpZHRoLCBoZWlnaHQsIG1pbWVUeXBlKS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGFsbGljUm91Z2huZXNzRmFjdG9ycy5tZXRhbGxpY1JvdWdobmVzc1RleHR1cmVEYXRhID0gZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAod3JpdGVPdXRCYXNlQ29sb3JUZXh0dXJlKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9taXNlcy5wdXNoKFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2dldEltYWdlRGF0YUFzeW5jKGJhc2VDb2xvckJ1ZmZlciwgd2lkdGgsIGhlaWdodCwgbWltZVR5cGUpLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWV0YWxsaWNSb3VnaG5lc3NGYWN0b3JzLmJhc2VDb2xvclRleHR1cmVEYXRhID0gZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBtZXRhbGxpY1JvdWdobmVzc0ZhY3RvcnM7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChcIl9Db252ZXJ0U3BlY3VsYXJHbG9zc2luZXNzVGV4dHVyZXNUb01ldGFsbGljUm91Z2huZXNzOiBTY2VuZSBmcm9tIHRleHR1cmVzIGlzIG1pc3NpbmchXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnZlcnRzIHNwZWN1bGFyIGdsb3NzaW5lc3MgbWF0ZXJpYWwgcHJvcGVydGllcyB0byBtZXRhbGxpYyByb3VnaG5lc3NcclxuICAgICAqIEBwYXJhbSBzcGVjdWxhckdsb3NzaW5lc3MgaW50ZXJmYWNlIHdpdGggc3BlY3VsYXIgZ2xvc3NpbmVzcyBtYXRlcmlhbCBwcm9wZXJ0aWVzXHJcbiAgICAgKiBAcmV0dXJucyBpbnRlcmZhY2Ugd2l0aCBtZXRhbGxpYyByb3VnaG5lc3MgbWF0ZXJpYWwgcHJvcGVydGllc1xyXG4gICAgICovXHJcbiAgICBwcml2YXRlIF9jb252ZXJ0U3BlY3VsYXJHbG9zc2luZXNzVG9NZXRhbGxpY1JvdWdobmVzcyhzcGVjdWxhckdsb3NzaW5lc3M6IF9JUEJSU3BlY3VsYXJHbG9zc2luZXNzKTogX0lQQlJNZXRhbGxpY1JvdWdobmVzcyB7XHJcbiAgICAgICAgY29uc3QgZGlmZnVzZVBlcmNlaXZlZEJyaWdodG5lc3MgPSB0aGlzLl9nZXRQZXJjZWl2ZWRCcmlnaHRuZXNzKHNwZWN1bGFyR2xvc3NpbmVzcy5kaWZmdXNlQ29sb3IpO1xyXG4gICAgICAgIGNvbnN0IHNwZWN1bGFyUGVyY2VpdmVkQnJpZ2h0bmVzcyA9IHRoaXMuX2dldFBlcmNlaXZlZEJyaWdodG5lc3Moc3BlY3VsYXJHbG9zc2luZXNzLnNwZWN1bGFyQ29sb3IpO1xyXG4gICAgICAgIGNvbnN0IG9uZU1pbnVzU3BlY3VsYXJTdHJlbmd0aCA9IDEgLSB0aGlzLl9nZXRNYXhDb21wb25lbnQoc3BlY3VsYXJHbG9zc2luZXNzLnNwZWN1bGFyQ29sb3IpO1xyXG4gICAgICAgIGNvbnN0IG1ldGFsbGljID0gX0dMVEZNYXRlcmlhbEV4cG9ydGVyLl9Tb2x2ZU1ldGFsbGljKGRpZmZ1c2VQZXJjZWl2ZWRCcmlnaHRuZXNzLCBzcGVjdWxhclBlcmNlaXZlZEJyaWdodG5lc3MsIG9uZU1pbnVzU3BlY3VsYXJTdHJlbmd0aCk7XHJcbiAgICAgICAgY29uc3QgYmFzZUNvbG9yRnJvbURpZmZ1c2UgPSBzcGVjdWxhckdsb3NzaW5lc3MuZGlmZnVzZUNvbG9yLnNjYWxlKFxyXG4gICAgICAgICAgICBvbmVNaW51c1NwZWN1bGFyU3RyZW5ndGggLyAoMS4wIC0gX0dMVEZNYXRlcmlhbEV4cG9ydGVyLl9EaWVsZWN0cmljU3BlY3VsYXIucikgLyBNYXRoLm1heCgxIC0gbWV0YWxsaWMsIF9HTFRGTWF0ZXJpYWxFeHBvcnRlci5fRXBzaWxvbilcclxuICAgICAgICApO1xyXG4gICAgICAgIGNvbnN0IGJhc2VDb2xvckZyb21TcGVjdWxhciA9IHNwZWN1bGFyR2xvc3NpbmVzcy5zcGVjdWxhckNvbG9yXHJcbiAgICAgICAgICAgIC5zdWJ0cmFjdChfR0xURk1hdGVyaWFsRXhwb3J0ZXIuX0RpZWxlY3RyaWNTcGVjdWxhci5zY2FsZSgxIC0gbWV0YWxsaWMpKVxyXG4gICAgICAgICAgICAuc2NhbGUoMSAvIE1hdGgubWF4KG1ldGFsbGljLCBfR0xURk1hdGVyaWFsRXhwb3J0ZXIuX0Vwc2lsb24pKTtcclxuICAgICAgICBsZXQgYmFzZUNvbG9yID0gQ29sb3IzLkxlcnAoYmFzZUNvbG9yRnJvbURpZmZ1c2UsIGJhc2VDb2xvckZyb21TcGVjdWxhciwgbWV0YWxsaWMgKiBtZXRhbGxpYyk7XHJcbiAgICAgICAgYmFzZUNvbG9yID0gYmFzZUNvbG9yLmNsYW1wVG9SZWYoMCwgMSwgYmFzZUNvbG9yKTtcclxuXHJcbiAgICAgICAgY29uc3QgbWV0YWxsaWNSb3VnaG5lc3M6IF9JUEJSTWV0YWxsaWNSb3VnaG5lc3MgPSB7XHJcbiAgICAgICAgICAgIGJhc2VDb2xvcjogYmFzZUNvbG9yLFxyXG4gICAgICAgICAgICBtZXRhbGxpYzogbWV0YWxsaWMsXHJcbiAgICAgICAgICAgIHJvdWdobmVzczogMSAtIHNwZWN1bGFyR2xvc3NpbmVzcy5nbG9zc2luZXNzLFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiBtZXRhbGxpY1JvdWdobmVzcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENhbGN1bGF0ZXMgdGhlIHN1cmZhY2UgcmVmbGVjdGFuY2UsIGluZGVwZW5kZW50IG9mIGxpZ2h0aW5nIGNvbmRpdGlvbnNcclxuICAgICAqIEBwYXJhbSBjb2xvciBDb2xvciBzb3VyY2UgdG8gY2FsY3VsYXRlIGJyaWdodG5lc3MgZnJvbVxyXG4gICAgICogQHJldHVybnMgbnVtYmVyIHJlcHJlc2VudGluZyB0aGUgcGVyY2VpdmVkIGJyaWdodG5lc3MsIG9yIHplcm8gaWYgY29sb3IgaXMgdW5kZWZpbmVkXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgX2dldFBlcmNlaXZlZEJyaWdodG5lc3MoY29sb3I6IENvbG9yMyk6IG51bWJlciB7XHJcbiAgICAgICAgaWYgKGNvbG9yKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBNYXRoLnNxcnQoMC4yOTkgKiBjb2xvci5yICogY29sb3IuciArIDAuNTg3ICogY29sb3IuZyAqIGNvbG9yLmcgKyAwLjExNCAqIGNvbG9yLmIgKiBjb2xvci5iKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIDA7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBtYXhpbXVtIGNvbG9yIGNvbXBvbmVudCB2YWx1ZVxyXG4gICAgICogQHBhcmFtIGNvbG9yXHJcbiAgICAgKiBAcmV0dXJucyBtYXhpbXVtIGNvbG9yIGNvbXBvbmVudCB2YWx1ZSwgb3IgemVybyBpZiBjb2xvciBpcyBudWxsIG9yIHVuZGVmaW5lZFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIF9nZXRNYXhDb21wb25lbnQoY29sb3I6IENvbG9yMyk6IG51bWJlciB7XHJcbiAgICAgICAgaWYgKGNvbG9yKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBNYXRoLm1heChjb2xvci5yLCBNYXRoLm1heChjb2xvci5nLCBjb2xvci5iKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAwO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29udmVydCBhIFBCUk1hdGVyaWFsIChNZXRhbGxpYy9Sb3VnaG5lc3MpIHRvIE1ldGFsbGljIFJvdWdobmVzcyBmYWN0b3JzXHJcbiAgICAgKiBAcGFyYW0gYmFieWxvblBCUk1hdGVyaWFsIEJKUyBQQlIgTWV0YWxsaWMgUm91Z2huZXNzIE1hdGVyaWFsXHJcbiAgICAgKiBAcGFyYW0gbWltZVR5cGUgbWltZSB0eXBlIHRvIHVzZSBmb3IgdGhlIHRleHR1cmVzXHJcbiAgICAgKiBAcGFyYW0gZ2xURlBick1ldGFsbGljUm91Z2huZXNzIGdsVEYgUEJSIE1ldGFsbGljIFJvdWdobmVzcyBpbnRlcmZhY2VcclxuICAgICAqIEBwYXJhbSBoYXNUZXh0dXJlQ29vcmRzIHNwZWNpZmllcyBpZiB0ZXh0dXJlIGNvb3JkaW5hdGVzIGFyZSBwcmVzZW50IG9uIHRoZSBzdWJtZXNoIHRvIGRldGVybWluZSBpZiB0ZXh0dXJlcyBzaG91bGQgYmUgYXBwbGllZFxyXG4gICAgICogQHJldHVybnMgZ2xURiBQQlIgTWV0YWxsaWMgUm91Z2huZXNzIGZhY3RvcnNcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBfY29udmVydE1ldGFsUm91Z2hGYWN0b3JzVG9NZXRhbGxpY1JvdWdobmVzc0FzeW5jKFxyXG4gICAgICAgIGJhYnlsb25QQlJNYXRlcmlhbDogUEJSQmFzZU1hdGVyaWFsLFxyXG4gICAgICAgIG1pbWVUeXBlOiBJbWFnZU1pbWVUeXBlLFxyXG4gICAgICAgIGdsVEZQYnJNZXRhbGxpY1JvdWdobmVzczogSU1hdGVyaWFsUGJyTWV0YWxsaWNSb3VnaG5lc3MsXHJcbiAgICAgICAgaGFzVGV4dHVyZUNvb3JkczogYm9vbGVhblxyXG4gICAgKTogUHJvbWlzZTxfSVBCUk1ldGFsbGljUm91Z2huZXNzPiB7XHJcbiAgICAgICAgY29uc3QgcHJvbWlzZXMgPSBbXTtcclxuICAgICAgICBjb25zdCBiYXNlQ29sb3IgPSBiYWJ5bG9uUEJSTWF0ZXJpYWwuX2FsYmVkb0NvbG9yO1xyXG4gICAgICAgIGNvbnN0IG1ldGFsbGljID0gYmFieWxvblBCUk1hdGVyaWFsLl9tZXRhbGxpYztcclxuICAgICAgICBjb25zdCByb3VnaG5lc3MgPSBiYWJ5bG9uUEJSTWF0ZXJpYWwuX3JvdWdobmVzcztcclxuICAgICAgICBjb25zdCBtZXRhbGxpY1JvdWdobmVzczogX0lQQlJNZXRhbGxpY1JvdWdobmVzcyA9IHtcclxuICAgICAgICAgICAgYmFzZUNvbG9yOiBiYXNlQ29sb3IsXHJcbiAgICAgICAgICAgIG1ldGFsbGljOiBtZXRhbGxpYyxcclxuICAgICAgICAgICAgcm91Z2huZXNzOiByb3VnaG5lc3MsXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaWYgKGhhc1RleHR1cmVDb29yZHMpIHtcclxuICAgICAgICAgICAgY29uc3QgYWxiZWRvVGV4dHVyZSA9IGJhYnlsb25QQlJNYXRlcmlhbC5fYWxiZWRvVGV4dHVyZTtcclxuICAgICAgICAgICAgaWYgKGFsYmVkb1RleHR1cmUpIHtcclxuICAgICAgICAgICAgICAgIHByb21pc2VzLnB1c2goXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXhwb3J0VGV4dHVyZUFzeW5jKGJhYnlsb25QQlJNYXRlcmlhbC5fYWxiZWRvVGV4dHVyZSEsIG1pbWVUeXBlKS50aGVuKChnbFRGVGV4dHVyZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZ2xURlRleHR1cmUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsVEZQYnJNZXRhbGxpY1JvdWdobmVzcy5iYXNlQ29sb3JUZXh0dXJlID0gZ2xURlRleHR1cmU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBtZXRhbGxpY1RleHR1cmUgPSBiYWJ5bG9uUEJSTWF0ZXJpYWwuX21ldGFsbGljVGV4dHVyZTtcclxuICAgICAgICAgICAgaWYgKG1ldGFsbGljVGV4dHVyZSkge1xyXG4gICAgICAgICAgICAgICAgcHJvbWlzZXMucHVzaChcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9leHBvcnRUZXh0dXJlQXN5bmMobWV0YWxsaWNUZXh0dXJlLCBtaW1lVHlwZSkudGhlbigoZ2xURlRleHR1cmUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGdsVEZUZXh0dXJlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnbFRGUGJyTWV0YWxsaWNSb3VnaG5lc3MubWV0YWxsaWNSb3VnaG5lc3NUZXh0dXJlID0gZ2xURlRleHR1cmU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gbWV0YWxsaWNSb3VnaG5lc3M7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZ2V0VGV4dHVyZVNhbXBsZXIodGV4dHVyZTogTnVsbGFibGU8QmFzZVRleHR1cmU+KTogSVNhbXBsZXIge1xyXG4gICAgICAgIGNvbnN0IHNhbXBsZXI6IElTYW1wbGVyID0ge307XHJcbiAgICAgICAgaWYgKCF0ZXh0dXJlIHx8ICEodGV4dHVyZSBpbnN0YW5jZW9mIFRleHR1cmUpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzYW1wbGVyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3Qgd3JhcFMgPSB0aGlzLl9nZXRHTFRGVGV4dHVyZVdyYXBNb2RlKHRleHR1cmUud3JhcFUpO1xyXG4gICAgICAgIGlmICh3cmFwUyAhPT0gVGV4dHVyZVdyYXBNb2RlLlJFUEVBVCkge1xyXG4gICAgICAgICAgICBzYW1wbGVyLndyYXBTID0gd3JhcFM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCB3cmFwVCA9IHRoaXMuX2dldEdMVEZUZXh0dXJlV3JhcE1vZGUodGV4dHVyZS53cmFwVik7XHJcbiAgICAgICAgaWYgKHdyYXBUICE9PSBUZXh0dXJlV3JhcE1vZGUuUkVQRUFUKSB7XHJcbiAgICAgICAgICAgIHNhbXBsZXIud3JhcFQgPSB3cmFwVDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN3aXRjaCAodGV4dHVyZS5zYW1wbGluZ01vZGUpIHtcclxuICAgICAgICAgICAgY2FzZSBUZXh0dXJlLkxJTkVBUl9MSU5FQVI6IHtcclxuICAgICAgICAgICAgICAgIHNhbXBsZXIubWFnRmlsdGVyID0gVGV4dHVyZU1hZ0ZpbHRlci5MSU5FQVI7XHJcbiAgICAgICAgICAgICAgICBzYW1wbGVyLm1pbkZpbHRlciA9IFRleHR1cmVNaW5GaWx0ZXIuTElORUFSO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSBUZXh0dXJlLkxJTkVBUl9ORUFSRVNUOiB7XHJcbiAgICAgICAgICAgICAgICBzYW1wbGVyLm1hZ0ZpbHRlciA9IFRleHR1cmVNYWdGaWx0ZXIuTElORUFSO1xyXG4gICAgICAgICAgICAgICAgc2FtcGxlci5taW5GaWx0ZXIgPSBUZXh0dXJlTWluRmlsdGVyLk5FQVJFU1Q7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIFRleHR1cmUuTkVBUkVTVF9MSU5FQVI6IHtcclxuICAgICAgICAgICAgICAgIHNhbXBsZXIubWFnRmlsdGVyID0gVGV4dHVyZU1hZ0ZpbHRlci5ORUFSRVNUO1xyXG4gICAgICAgICAgICAgICAgc2FtcGxlci5taW5GaWx0ZXIgPSBUZXh0dXJlTWluRmlsdGVyLkxJTkVBUjtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhc2UgVGV4dHVyZS5ORUFSRVNUX0xJTkVBUl9NSVBMSU5FQVI6IHtcclxuICAgICAgICAgICAgICAgIHNhbXBsZXIubWFnRmlsdGVyID0gVGV4dHVyZU1hZ0ZpbHRlci5ORUFSRVNUO1xyXG4gICAgICAgICAgICAgICAgc2FtcGxlci5taW5GaWx0ZXIgPSBUZXh0dXJlTWluRmlsdGVyLkxJTkVBUl9NSVBNQVBfTElORUFSO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSBUZXh0dXJlLk5FQVJFU1RfTkVBUkVTVDoge1xyXG4gICAgICAgICAgICAgICAgc2FtcGxlci5tYWdGaWx0ZXIgPSBUZXh0dXJlTWFnRmlsdGVyLk5FQVJFU1Q7XHJcbiAgICAgICAgICAgICAgICBzYW1wbGVyLm1pbkZpbHRlciA9IFRleHR1cmVNaW5GaWx0ZXIuTkVBUkVTVDtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhc2UgVGV4dHVyZS5ORUFSRVNUX0xJTkVBUl9NSVBORUFSRVNUOiB7XHJcbiAgICAgICAgICAgICAgICBzYW1wbGVyLm1hZ0ZpbHRlciA9IFRleHR1cmVNYWdGaWx0ZXIuTkVBUkVTVDtcclxuICAgICAgICAgICAgICAgIHNhbXBsZXIubWluRmlsdGVyID0gVGV4dHVyZU1pbkZpbHRlci5MSU5FQVJfTUlQTUFQX05FQVJFU1Q7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIFRleHR1cmUuTElORUFSX05FQVJFU1RfTUlQTkVBUkVTVDoge1xyXG4gICAgICAgICAgICAgICAgc2FtcGxlci5tYWdGaWx0ZXIgPSBUZXh0dXJlTWFnRmlsdGVyLkxJTkVBUjtcclxuICAgICAgICAgICAgICAgIHNhbXBsZXIubWluRmlsdGVyID0gVGV4dHVyZU1pbkZpbHRlci5ORUFSRVNUX01JUE1BUF9ORUFSRVNUO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSBUZXh0dXJlLkxJTkVBUl9ORUFSRVNUX01JUExJTkVBUjoge1xyXG4gICAgICAgICAgICAgICAgc2FtcGxlci5tYWdGaWx0ZXIgPSBUZXh0dXJlTWFnRmlsdGVyLkxJTkVBUjtcclxuICAgICAgICAgICAgICAgIHNhbXBsZXIubWluRmlsdGVyID0gVGV4dHVyZU1pbkZpbHRlci5ORUFSRVNUX01JUE1BUF9MSU5FQVI7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIFRleHR1cmUuTkVBUkVTVF9ORUFSRVNUX01JUExJTkVBUjoge1xyXG4gICAgICAgICAgICAgICAgc2FtcGxlci5tYWdGaWx0ZXIgPSBUZXh0dXJlTWFnRmlsdGVyLk5FQVJFU1Q7XHJcbiAgICAgICAgICAgICAgICBzYW1wbGVyLm1pbkZpbHRlciA9IFRleHR1cmVNaW5GaWx0ZXIuTkVBUkVTVF9NSVBNQVBfTElORUFSO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSBUZXh0dXJlLkxJTkVBUl9MSU5FQVJfTUlQTElORUFSOiB7XHJcbiAgICAgICAgICAgICAgICBzYW1wbGVyLm1hZ0ZpbHRlciA9IFRleHR1cmVNYWdGaWx0ZXIuTElORUFSO1xyXG4gICAgICAgICAgICAgICAgc2FtcGxlci5taW5GaWx0ZXIgPSBUZXh0dXJlTWluRmlsdGVyLkxJTkVBUl9NSVBNQVBfTElORUFSO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSBUZXh0dXJlLkxJTkVBUl9MSU5FQVJfTUlQTkVBUkVTVDoge1xyXG4gICAgICAgICAgICAgICAgc2FtcGxlci5tYWdGaWx0ZXIgPSBUZXh0dXJlTWFnRmlsdGVyLkxJTkVBUjtcclxuICAgICAgICAgICAgICAgIHNhbXBsZXIubWluRmlsdGVyID0gVGV4dHVyZU1pbkZpbHRlci5MSU5FQVJfTUlQTUFQX05FQVJFU1Q7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIFRleHR1cmUuTkVBUkVTVF9ORUFSRVNUX01JUE5FQVJFU1Q6IHtcclxuICAgICAgICAgICAgICAgIHNhbXBsZXIubWFnRmlsdGVyID0gVGV4dHVyZU1hZ0ZpbHRlci5ORUFSRVNUO1xyXG4gICAgICAgICAgICAgICAgc2FtcGxlci5taW5GaWx0ZXIgPSBUZXh0dXJlTWluRmlsdGVyLk5FQVJFU1RfTUlQTUFQX05FQVJFU1Q7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHNhbXBsZXI7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZ2V0R0xURlRleHR1cmVXcmFwTW9kZSh3cmFwTW9kZTogbnVtYmVyKTogVGV4dHVyZVdyYXBNb2RlIHtcclxuICAgICAgICBzd2l0Y2ggKHdyYXBNb2RlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgVGV4dHVyZS5XUkFQX0FERFJFU1NNT0RFOiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gVGV4dHVyZVdyYXBNb2RlLlJFUEVBVDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIFRleHR1cmUuQ0xBTVBfQUREUkVTU01PREU6IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBUZXh0dXJlV3JhcE1vZGUuQ0xBTVBfVE9fRURHRTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIFRleHR1cmUuTUlSUk9SX0FERFJFU1NNT0RFOiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gVGV4dHVyZVdyYXBNb2RlLk1JUlJPUkVEX1JFUEVBVDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBkZWZhdWx0OiB7XHJcbiAgICAgICAgICAgICAgICBUb29scy5FcnJvcihgVW5zdXBwb3J0ZWQgVGV4dHVyZSBXcmFwIE1vZGUgJHt3cmFwTW9kZX0hYCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gVGV4dHVyZVdyYXBNb2RlLlJFUEVBVDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnZlcnQgYSBQQlJNYXRlcmlhbCAoU3BlY3VsYXIvR2xvc3NpbmVzcykgdG8gTWV0YWxsaWMgUm91Z2huZXNzIGZhY3RvcnNcclxuICAgICAqIEBwYXJhbSBiYWJ5bG9uUEJSTWF0ZXJpYWwgQkpTIFBCUiBNZXRhbGxpYyBSb3VnaG5lc3MgTWF0ZXJpYWxcclxuICAgICAqIEBwYXJhbSBtaW1lVHlwZSBtaW1lIHR5cGUgdG8gdXNlIGZvciB0aGUgdGV4dHVyZXNcclxuICAgICAqIEBwYXJhbSBwYnJNZXRhbGxpY1JvdWdobmVzcyBnbFRGIFBCUiBNZXRhbGxpYyBSb3VnaG5lc3MgaW50ZXJmYWNlXHJcbiAgICAgKiBAcGFyYW0gaGFzVGV4dHVyZUNvb3JkcyBzcGVjaWZpZXMgaWYgdGV4dHVyZSBjb29yZGluYXRlcyBhcmUgcHJlc2VudCBvbiB0aGUgc3VibWVzaCB0byBkZXRlcm1pbmUgaWYgdGV4dHVyZXMgc2hvdWxkIGJlIGFwcGxpZWRcclxuICAgICAqIEByZXR1cm5zIGdsVEYgUEJSIE1ldGFsbGljIFJvdWdobmVzcyBmYWN0b3JzXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgX2NvbnZlcnRTcGVjR2xvc3NGYWN0b3JzVG9NZXRhbGxpY1JvdWdobmVzc0FzeW5jKFxyXG4gICAgICAgIGJhYnlsb25QQlJNYXRlcmlhbDogUEJSQmFzZU1hdGVyaWFsLFxyXG4gICAgICAgIG1pbWVUeXBlOiBJbWFnZU1pbWVUeXBlLFxyXG4gICAgICAgIHBick1ldGFsbGljUm91Z2huZXNzOiBJTWF0ZXJpYWxQYnJNZXRhbGxpY1JvdWdobmVzcyxcclxuICAgICAgICBoYXNUZXh0dXJlQ29vcmRzOiBib29sZWFuXHJcbiAgICApOiBQcm9taXNlPF9JUEJSTWV0YWxsaWNSb3VnaG5lc3M+IHtcclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNwZWNHbG9zczogX0lQQlJTcGVjdWxhckdsb3NzaW5lc3MgPSB7XHJcbiAgICAgICAgICAgICAgICBkaWZmdXNlQ29sb3I6IGJhYnlsb25QQlJNYXRlcmlhbC5fYWxiZWRvQ29sb3IsXHJcbiAgICAgICAgICAgICAgICBzcGVjdWxhckNvbG9yOiBiYWJ5bG9uUEJSTWF0ZXJpYWwuX3JlZmxlY3Rpdml0eUNvbG9yLFxyXG4gICAgICAgICAgICAgICAgZ2xvc3NpbmVzczogYmFieWxvblBCUk1hdGVyaWFsLl9taWNyb1N1cmZhY2UsXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGNvbnN0IGFsYmVkb1RleHR1cmUgPSBiYWJ5bG9uUEJSTWF0ZXJpYWwuX2FsYmVkb1RleHR1cmU7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlZmxlY3Rpdml0eVRleHR1cmUgPSBiYWJ5bG9uUEJSTWF0ZXJpYWwuX3JlZmxlY3Rpdml0eVRleHR1cmU7XHJcbiAgICAgICAgICAgIGNvbnN0IHVzZU1pY3Jvc3VyZmFjZUZyb21SZWZsZWN0aXZpdHlNYXBBbHBoYSA9IGJhYnlsb25QQlJNYXRlcmlhbC5fdXNlTWljcm9TdXJmYWNlRnJvbVJlZmxlY3Rpdml0eU1hcEFscGhhO1xyXG4gICAgICAgICAgICBpZiAocmVmbGVjdGl2aXR5VGV4dHVyZSAmJiAhdXNlTWljcm9zdXJmYWNlRnJvbVJlZmxlY3Rpdml0eU1hcEFscGhhKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoXCJfQ29udmVydFBCUk1hdGVyaWFsOiBHbG9zc2luZXNzIHZhbHVlcyBub3QgaW5jbHVkZWQgaW4gdGhlIHJlZmxlY3Rpdml0eSB0ZXh0dXJlIGFyZSBjdXJyZW50bHkgbm90IHN1cHBvcnRlZFwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoKGFsYmVkb1RleHR1cmUgfHwgcmVmbGVjdGl2aXR5VGV4dHVyZSkgJiYgaGFzVGV4dHVyZUNvb3Jkcykge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2FtcGxlckluZGV4ID0gdGhpcy5fZXhwb3J0VGV4dHVyZVNhbXBsZXIoYWxiZWRvVGV4dHVyZSB8fCByZWZsZWN0aXZpdHlUZXh0dXJlKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb252ZXJ0U3BlY3VsYXJHbG9zc2luZXNzVGV4dHVyZXNUb01ldGFsbGljUm91Z2huZXNzQXN5bmMoYWxiZWRvVGV4dHVyZSwgcmVmbGVjdGl2aXR5VGV4dHVyZSwgc3BlY0dsb3NzLCBtaW1lVHlwZSkudGhlbigobWV0YWxsaWNSb3VnaG5lc3NGYWN0b3JzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGV4dHVyZXMgPSB0aGlzLl9leHBvcnRlci5fdGV4dHVyZXM7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1ldGFsbGljUm91Z2huZXNzRmFjdG9ycy5iYXNlQ29sb3JUZXh0dXJlRGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpbWFnZUluZGV4ID0gdGhpcy5fZXhwb3J0SW1hZ2UoYGJhc2VDb2xvciR7dGV4dHVyZXMubGVuZ3RofWAsIG1pbWVUeXBlLCBtZXRhbGxpY1JvdWdobmVzc0ZhY3RvcnMuYmFzZUNvbG9yVGV4dHVyZURhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYnJNZXRhbGxpY1JvdWdobmVzcy5iYXNlQ29sb3JUZXh0dXJlID0gdGhpcy5fZXhwb3J0VGV4dHVyZUluZm8oaW1hZ2VJbmRleCwgc2FtcGxlckluZGV4LCBhbGJlZG9UZXh0dXJlPy5jb29yZGluYXRlc0luZGV4KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1ldGFsbGljUm91Z2huZXNzRmFjdG9ycy5tZXRhbGxpY1JvdWdobmVzc1RleHR1cmVEYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGltYWdlSW5kZXggPSB0aGlzLl9leHBvcnRJbWFnZShgbWV0YWxsaWNSb3VnaG5lc3Mke3RleHR1cmVzLmxlbmd0aH1gLCBtaW1lVHlwZSwgbWV0YWxsaWNSb3VnaG5lc3NGYWN0b3JzLm1ldGFsbGljUm91Z2huZXNzVGV4dHVyZURhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYnJNZXRhbGxpY1JvdWdobmVzcy5tZXRhbGxpY1JvdWdobmVzc1RleHR1cmUgPSB0aGlzLl9leHBvcnRUZXh0dXJlSW5mbyhpbWFnZUluZGV4LCBzYW1wbGVySW5kZXgsIHJlZmxlY3Rpdml0eVRleHR1cmU/LmNvb3JkaW5hdGVzSW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1ldGFsbGljUm91Z2huZXNzRmFjdG9ycztcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvbnZlcnRTcGVjdWxhckdsb3NzaW5lc3NUb01ldGFsbGljUm91Z2huZXNzKHNwZWNHbG9zcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnZlcnRzIGEgQmFieWxvbiBQQlIgQmFzZSBNYXRlcmlhbCB0byBhIGdsVEYgTWF0ZXJpYWxcclxuICAgICAqIEBwYXJhbSBiYWJ5bG9uUEJSTWF0ZXJpYWwgQkpTIFBCUiBCYXNlIE1hdGVyaWFsXHJcbiAgICAgKiBAcGFyYW0gbWltZVR5cGUgbWltZSB0eXBlIHRvIHVzZSBmb3IgdGhlIHRleHR1cmVzXHJcbiAgICAgKiBAcGFyYW0gaGFzVGV4dHVyZUNvb3JkcyBzcGVjaWZpZXMgaWYgdGV4dHVyZSBjb29yZGluYXRlcyBhcmUgcHJlc2VudCBvbiB0aGUgc3VibWVzaCB0byBkZXRlcm1pbmUgaWYgdGV4dHVyZXMgc2hvdWxkIGJlIGFwcGxpZWRcclxuICAgICAqIEByZXR1cm5zIGFzeW5jIGdsVEYgTWF0ZXJpYWwgcmVwcmVzZW50YXRpb25cclxuICAgICAqL1xyXG4gICAgcHVibGljIF9jb252ZXJ0UEJSTWF0ZXJpYWxBc3luYyhiYWJ5bG9uUEJSTWF0ZXJpYWw6IFBCUkJhc2VNYXRlcmlhbCwgbWltZVR5cGU6IEltYWdlTWltZVR5cGUsIGhhc1RleHR1cmVDb29yZHM6IGJvb2xlYW4pOiBQcm9taXNlPElNYXRlcmlhbD4ge1xyXG4gICAgICAgIGNvbnN0IGdsVEZQYnJNZXRhbGxpY1JvdWdobmVzczogSU1hdGVyaWFsUGJyTWV0YWxsaWNSb3VnaG5lc3MgPSB7fTtcclxuICAgICAgICBjb25zdCBnbFRGTWF0ZXJpYWw6IElNYXRlcmlhbCA9IHtcclxuICAgICAgICAgICAgbmFtZTogYmFieWxvblBCUk1hdGVyaWFsLm5hbWUsXHJcbiAgICAgICAgfTtcclxuICAgICAgICBjb25zdCB1c2VNZXRhbGxpY1JvdWdobmVzcyA9IGJhYnlsb25QQlJNYXRlcmlhbC5pc01ldGFsbGljV29ya2Zsb3coKTtcclxuXHJcbiAgICAgICAgaWYgKHVzZU1ldGFsbGljUm91Z2huZXNzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGFsYmVkb0NvbG9yID0gYmFieWxvblBCUk1hdGVyaWFsLl9hbGJlZG9Db2xvcjtcclxuICAgICAgICAgICAgY29uc3QgYWxwaGEgPSBiYWJ5bG9uUEJSTWF0ZXJpYWwuYWxwaGE7XHJcbiAgICAgICAgICAgIGlmIChhbGJlZG9Db2xvcikge1xyXG4gICAgICAgICAgICAgICAgZ2xURlBick1ldGFsbGljUm91Z2huZXNzLmJhc2VDb2xvckZhY3RvciA9IFthbGJlZG9Db2xvci5yLCBhbGJlZG9Db2xvci5nLCBhbGJlZG9Db2xvci5iLCBhbHBoYV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvbnZlcnRNZXRhbFJvdWdoRmFjdG9yc1RvTWV0YWxsaWNSb3VnaG5lc3NBc3luYyhiYWJ5bG9uUEJSTWF0ZXJpYWwsIG1pbWVUeXBlLCBnbFRGUGJyTWV0YWxsaWNSb3VnaG5lc3MsIGhhc1RleHR1cmVDb29yZHMpLnRoZW4oKG1ldGFsbGljUm91Z2huZXNzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fc2V0TWV0YWxsaWNSb3VnaG5lc3NQYnJNYXRlcmlhbChtZXRhbGxpY1JvdWdobmVzcywgYmFieWxvblBCUk1hdGVyaWFsLCBnbFRGTWF0ZXJpYWwsIGdsVEZQYnJNZXRhbGxpY1JvdWdobmVzcywgbWltZVR5cGUsIGhhc1RleHR1cmVDb29yZHMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY29udmVydFNwZWNHbG9zc0ZhY3RvcnNUb01ldGFsbGljUm91Z2huZXNzQXN5bmMoYmFieWxvblBCUk1hdGVyaWFsLCBtaW1lVHlwZSwgZ2xURlBick1ldGFsbGljUm91Z2huZXNzLCBoYXNUZXh0dXJlQ29vcmRzKS50aGVuKChtZXRhbGxpY1JvdWdobmVzcykgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NldE1ldGFsbGljUm91Z2huZXNzUGJyTWF0ZXJpYWwobWV0YWxsaWNSb3VnaG5lc3MsIGJhYnlsb25QQlJNYXRlcmlhbCwgZ2xURk1hdGVyaWFsLCBnbFRGUGJyTWV0YWxsaWNSb3VnaG5lc3MsIG1pbWVUeXBlLCBoYXNUZXh0dXJlQ29vcmRzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3NldE1ldGFsbGljUm91Z2huZXNzUGJyTWF0ZXJpYWwoXHJcbiAgICAgICAgbWV0YWxsaWNSb3VnaG5lc3M6IE51bGxhYmxlPF9JUEJSTWV0YWxsaWNSb3VnaG5lc3M+LFxyXG4gICAgICAgIGJhYnlsb25QQlJNYXRlcmlhbDogUEJSQmFzZU1hdGVyaWFsLFxyXG4gICAgICAgIGdsVEZNYXRlcmlhbDogSU1hdGVyaWFsLFxyXG4gICAgICAgIGdsVEZQYnJNZXRhbGxpY1JvdWdobmVzczogSU1hdGVyaWFsUGJyTWV0YWxsaWNSb3VnaG5lc3MsXHJcbiAgICAgICAgbWltZVR5cGU6IEltYWdlTWltZVR5cGUsXHJcbiAgICAgICAgaGFzVGV4dHVyZUNvb3JkczogYm9vbGVhblxyXG4gICAgKTogUHJvbWlzZTxJTWF0ZXJpYWw+IHtcclxuICAgICAgICBjb25zdCBtYXRlcmlhbE1hcCA9IHRoaXMuX2V4cG9ydGVyLl9tYXRlcmlhbE1hcDtcclxuICAgICAgICBjb25zdCBtYXRlcmlhbHMgPSB0aGlzLl9leHBvcnRlci5fbWF0ZXJpYWxzO1xyXG4gICAgICAgIGNvbnN0IHByb21pc2VzID0gW107XHJcbiAgICAgICAgaWYgKG1ldGFsbGljUm91Z2huZXNzKSB7XHJcbiAgICAgICAgICAgIF9HTFRGTWF0ZXJpYWxFeHBvcnRlci5fU2V0QWxwaGFNb2RlKGdsVEZNYXRlcmlhbCwgYmFieWxvblBCUk1hdGVyaWFsIGFzIFBCUk1hdGVyaWFsKTtcclxuICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgIShcclxuICAgICAgICAgICAgICAgICAgICBfR0xURk1hdGVyaWFsRXhwb3J0ZXIuX0Z1enp5RXF1YWxzKG1ldGFsbGljUm91Z2huZXNzLmJhc2VDb2xvciwgQ29sb3IzLldoaXRlKCksIF9HTFRGTWF0ZXJpYWxFeHBvcnRlci5fRXBzaWxvbikgJiZcclxuICAgICAgICAgICAgICAgICAgICBiYWJ5bG9uUEJSTWF0ZXJpYWwuYWxwaGEgPj0gX0dMVEZNYXRlcmlhbEV4cG9ydGVyLl9FcHNpbG9uXHJcbiAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgZ2xURlBick1ldGFsbGljUm91Z2huZXNzLmJhc2VDb2xvckZhY3RvciA9IFttZXRhbGxpY1JvdWdobmVzcy5iYXNlQ29sb3IuciwgbWV0YWxsaWNSb3VnaG5lc3MuYmFzZUNvbG9yLmcsIG1ldGFsbGljUm91Z2huZXNzLmJhc2VDb2xvci5iLCBiYWJ5bG9uUEJSTWF0ZXJpYWwuYWxwaGFdO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAobWV0YWxsaWNSb3VnaG5lc3MubWV0YWxsaWMgIT0gbnVsbCAmJiBtZXRhbGxpY1JvdWdobmVzcy5tZXRhbGxpYyAhPT0gMSkge1xyXG4gICAgICAgICAgICAgICAgZ2xURlBick1ldGFsbGljUm91Z2huZXNzLm1ldGFsbGljRmFjdG9yID0gbWV0YWxsaWNSb3VnaG5lc3MubWV0YWxsaWM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKG1ldGFsbGljUm91Z2huZXNzLnJvdWdobmVzcyAhPSBudWxsICYmIG1ldGFsbGljUm91Z2huZXNzLnJvdWdobmVzcyAhPT0gMSkge1xyXG4gICAgICAgICAgICAgICAgZ2xURlBick1ldGFsbGljUm91Z2huZXNzLnJvdWdobmVzc0ZhY3RvciA9IG1ldGFsbGljUm91Z2huZXNzLnJvdWdobmVzcztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGJhYnlsb25QQlJNYXRlcmlhbC5iYWNrRmFjZUN1bGxpbmcgIT0gbnVsbCAmJiAhYmFieWxvblBCUk1hdGVyaWFsLmJhY2tGYWNlQ3VsbGluZykge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFiYWJ5bG9uUEJSTWF0ZXJpYWwuX3R3b1NpZGVkTGlnaHRpbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICBUb29scy5XYXJuKGJhYnlsb25QQlJNYXRlcmlhbC5uYW1lICsgXCI6IEJhY2stZmFjZSBjdWxsaW5nIGRpc2FibGVkIGFuZCB0d28tc2lkZWQgbGlnaHRpbmcgZGlzYWJsZWQgaXMgbm90IHN1cHBvcnRlZCBpbiBnbFRGLlwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGdsVEZNYXRlcmlhbC5kb3VibGVTaWRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChoYXNUZXh0dXJlQ29vcmRzKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBidW1wVGV4dHVyZSA9IGJhYnlsb25QQlJNYXRlcmlhbC5fYnVtcFRleHR1cmU7XHJcbiAgICAgICAgICAgICAgICBpZiAoYnVtcFRleHR1cmUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwcm9taXNlID0gdGhpcy5fZXhwb3J0VGV4dHVyZUFzeW5jKGJ1bXBUZXh0dXJlLCBtaW1lVHlwZSkudGhlbigoZ2xURlRleHR1cmUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGdsVEZUZXh0dXJlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnbFRGTWF0ZXJpYWwubm9ybWFsVGV4dHVyZSA9IGdsVEZUZXh0dXJlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJ1bXBUZXh0dXJlLmxldmVsICE9PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2xURk1hdGVyaWFsLm5vcm1hbFRleHR1cmUuc2NhbGUgPSBidW1wVGV4dHVyZS5sZXZlbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHByb21pc2VzLnB1c2gocHJvbWlzZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhbWJpZW50VGV4dHVyZSA9IGJhYnlsb25QQlJNYXRlcmlhbC5fYW1iaWVudFRleHR1cmU7XHJcbiAgICAgICAgICAgICAgICBpZiAoYW1iaWVudFRleHR1cmUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwcm9taXNlID0gdGhpcy5fZXhwb3J0VGV4dHVyZUFzeW5jKGFtYmllbnRUZXh0dXJlLCBtaW1lVHlwZSkudGhlbigoZ2xURlRleHR1cmUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGdsVEZUZXh0dXJlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvY2NsdXNpb25UZXh0dXJlOiBJTWF0ZXJpYWxPY2NsdXNpb25UZXh0dXJlSW5mbyA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleDogZ2xURlRleHR1cmUuaW5kZXgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4Q29vcmQ6IGdsVEZUZXh0dXJlLnRleENvb3JkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4dGVuc2lvbnM6IGdsVEZUZXh0dXJlLmV4dGVuc2lvbnMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsVEZNYXRlcmlhbC5vY2NsdXNpb25UZXh0dXJlID0gb2NjbHVzaW9uVGV4dHVyZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGFtYmllbnRUZXh0dXJlU3RyZW5ndGggPSBiYWJ5bG9uUEJSTWF0ZXJpYWwuX2FtYmllbnRUZXh0dXJlU3RyZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYW1iaWVudFRleHR1cmVTdHJlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9jY2x1c2lvblRleHR1cmUuc3RyZW5ndGggPSBhbWJpZW50VGV4dHVyZVN0cmVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvbWlzZXMucHVzaChwcm9taXNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvbnN0IGVtaXNzaXZlVGV4dHVyZSA9IGJhYnlsb25QQlJNYXRlcmlhbC5fZW1pc3NpdmVUZXh0dXJlO1xyXG4gICAgICAgICAgICAgICAgaWYgKGVtaXNzaXZlVGV4dHVyZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHByb21pc2UgPSB0aGlzLl9leHBvcnRUZXh0dXJlQXN5bmMoZW1pc3NpdmVUZXh0dXJlLCBtaW1lVHlwZSkudGhlbigoZ2xURlRleHR1cmUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGdsVEZUZXh0dXJlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnbFRGTWF0ZXJpYWwuZW1pc3NpdmVUZXh0dXJlID0gZ2xURlRleHR1cmU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBwcm9taXNlcy5wdXNoKHByb21pc2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGVtaXNzaXZlQ29sb3IgPSBiYWJ5bG9uUEJSTWF0ZXJpYWwuX2VtaXNzaXZlQ29sb3I7XHJcbiAgICAgICAgICAgIGlmICghX0dMVEZNYXRlcmlhbEV4cG9ydGVyLl9GdXp6eUVxdWFscyhlbWlzc2l2ZUNvbG9yLCBDb2xvcjMuQmxhY2soKSwgX0dMVEZNYXRlcmlhbEV4cG9ydGVyLl9FcHNpbG9uKSkge1xyXG4gICAgICAgICAgICAgICAgZ2xURk1hdGVyaWFsLmVtaXNzaXZlRmFjdG9yID0gZW1pc3NpdmVDb2xvci5hc0FycmF5KCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGdsVEZNYXRlcmlhbC5wYnJNZXRhbGxpY1JvdWdobmVzcyA9IGdsVEZQYnJNZXRhbGxpY1JvdWdobmVzcztcclxuICAgICAgICAgICAgbWF0ZXJpYWxzLnB1c2goZ2xURk1hdGVyaWFsKTtcclxuICAgICAgICAgICAgbWF0ZXJpYWxNYXBbYmFieWxvblBCUk1hdGVyaWFsLnVuaXF1ZUlkXSA9IG1hdGVyaWFscy5sZW5ndGggLSAxO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZpbmlzaE1hdGVyaWFsKHByb21pc2VzLCBnbFRGTWF0ZXJpYWwsIGJhYnlsb25QQlJNYXRlcmlhbCwgbWltZVR5cGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2dldFBpeGVsc0Zyb21UZXh0dXJlKGJhYnlsb25UZXh0dXJlOiBCYXNlVGV4dHVyZSk6IFByb21pc2U8TnVsbGFibGU8VWludDhBcnJheSB8IEZsb2F0MzJBcnJheT4+IHtcclxuICAgICAgICBjb25zdCBwaXhlbHMgPVxyXG4gICAgICAgICAgICBiYWJ5bG9uVGV4dHVyZS50ZXh0dXJlVHlwZSA9PT0gQ29uc3RhbnRzLlRFWFRVUkVUWVBFX1VOU0lHTkVEX0lOVFxyXG4gICAgICAgICAgICAgICAgPyAoYmFieWxvblRleHR1cmUucmVhZFBpeGVscygpIGFzIFByb21pc2U8VWludDhBcnJheT4pXHJcbiAgICAgICAgICAgICAgICA6IChiYWJ5bG9uVGV4dHVyZS5yZWFkUGl4ZWxzKCkgYXMgUHJvbWlzZTxGbG9hdDMyQXJyYXk+KTtcclxuICAgICAgICByZXR1cm4gcGl4ZWxzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRXh0cmFjdHMgYSB0ZXh0dXJlIGZyb20gYSBCYWJ5bG9uIHRleHR1cmUgaW50byBmaWxlIGRhdGEgYW5kIGdsVEYgZGF0YVxyXG4gICAgICogQHBhcmFtIGJhYnlsb25UZXh0dXJlIEJhYnlsb24gdGV4dHVyZSB0byBleHRyYWN0XHJcbiAgICAgKiBAcGFyYW0gbWltZVR5cGUgTWltZSBUeXBlIG9mIHRoZSBiYWJ5bG9uVGV4dHVyZVxyXG4gICAgICogQHJldHVybnMgZ2xURiB0ZXh0dXJlIGluZm8sIG9yIG51bGwgaWYgdGhlIHRleHR1cmUgZm9ybWF0IGlzIG5vdCBzdXBwb3J0ZWRcclxuICAgICAqL1xyXG4gICAgcHVibGljIF9leHBvcnRUZXh0dXJlQXN5bmMoYmFieWxvblRleHR1cmU6IEJhc2VUZXh0dXJlLCBtaW1lVHlwZTogSW1hZ2VNaW1lVHlwZSk6IFByb21pc2U8TnVsbGFibGU8SVRleHR1cmVJbmZvPj4ge1xyXG4gICAgICAgIGNvbnN0IGV4dGVuc2lvblByb21pc2UgPSB0aGlzLl9leHBvcnRlci5fZXh0ZW5zaW9uc1ByZUV4cG9ydFRleHR1cmVBc3luYyhcImV4cG9ydGVyXCIsIGJhYnlsb25UZXh0dXJlIGFzIFRleHR1cmUsIG1pbWVUeXBlKTtcclxuICAgICAgICBpZiAoIWV4dGVuc2lvblByb21pc2UpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2V4cG9ydFRleHR1cmVJbmZvQXN5bmMoYmFieWxvblRleHR1cmUsIG1pbWVUeXBlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBleHRlbnNpb25Qcm9taXNlLnRoZW4oKHRleHR1cmUpID0+IHtcclxuICAgICAgICAgICAgaWYgKCF0ZXh0dXJlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZXhwb3J0VGV4dHVyZUluZm9Bc3luYyhiYWJ5bG9uVGV4dHVyZSwgbWltZVR5cGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9leHBvcnRUZXh0dXJlSW5mb0FzeW5jKHRleHR1cmUsIG1pbWVUeXBlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYXN5bmMgX2V4cG9ydFRleHR1cmVJbmZvQXN5bmMoYmFieWxvblRleHR1cmU6IEJhc2VUZXh0dXJlLCBtaW1lVHlwZTogSW1hZ2VNaW1lVHlwZSk6IFByb21pc2U8TnVsbGFibGU8SVRleHR1cmVJbmZvPj4ge1xyXG4gICAgICAgIGNvbnN0IHRleHR1cmVVaWQgPSBiYWJ5bG9uVGV4dHVyZS51aWQ7XHJcbiAgICAgICAgaWYgKCEodGV4dHVyZVVpZCBpbiB0aGlzLl90ZXh0dXJlTWFwKSkge1xyXG4gICAgICAgICAgICBjb25zdCBwaXhlbHMgPSBhd2FpdCB0aGlzLl9nZXRQaXhlbHNGcm9tVGV4dHVyZShiYWJ5bG9uVGV4dHVyZSk7XHJcbiAgICAgICAgICAgIGlmICghcGl4ZWxzKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3Qgc2FtcGxlckluZGV4ID0gdGhpcy5fZXhwb3J0VGV4dHVyZVNhbXBsZXIoYmFieWxvblRleHR1cmUpO1xyXG5cclxuICAgICAgICAgICAgLy8gUHJlc2VydmUgdGV4dHVyZSBtaW1lIHR5cGUgaWYgZGVmaW5lZFxyXG4gICAgICAgICAgICBjb25zdCB0ZXh0dXJlTWltZVR5cGUgPSAoYmFieWxvblRleHR1cmUgYXMgVGV4dHVyZSkubWltZVR5cGU7XHJcbiAgICAgICAgICAgIGlmICh0ZXh0dXJlTWltZVR5cGUpIHtcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAodGV4dHVyZU1pbWVUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcImltYWdlL2pwZWdcIjpcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiaW1hZ2UvcG5nXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcImltYWdlL3dlYnBcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWltZVR5cGUgPSB0ZXh0dXJlTWltZVR5cGUgYXMgSW1hZ2VNaW1lVHlwZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgVG9vbHMuV2FybihgVW5zdXBwb3J0ZWQgbWVkaWEgdHlwZTogJHt0ZXh0dXJlTWltZVR5cGV9YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBpbnRlcm5hbFRleHR1cmVUb0ltYWdlID0gdGhpcy5faW50ZXJuYWxUZXh0dXJlVG9JbWFnZTtcclxuICAgICAgICAgICAgY29uc3QgaW50ZXJuYWxUZXh0dXJlVW5pcXVlSWQgPSBiYWJ5bG9uVGV4dHVyZS5nZXRJbnRlcm5hbFRleHR1cmUoKSEudW5pcXVlSWQ7XHJcbiAgICAgICAgICAgIGludGVybmFsVGV4dHVyZVRvSW1hZ2VbaW50ZXJuYWxUZXh0dXJlVW5pcXVlSWRdIHx8PSB7fTtcclxuICAgICAgICAgICAgbGV0IGltYWdlSW5kZXhQcm9taXNlID0gaW50ZXJuYWxUZXh0dXJlVG9JbWFnZVtpbnRlcm5hbFRleHR1cmVVbmlxdWVJZF1bbWltZVR5cGVdO1xyXG4gICAgICAgICAgICBpZiAoaW1hZ2VJbmRleFByb21pc2UgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2l6ZSA9IGJhYnlsb25UZXh0dXJlLmdldFNpemUoKTtcclxuICAgICAgICAgICAgICAgIGltYWdlSW5kZXhQcm9taXNlID0gKGFzeW5jICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgdGhpcy5fZ2V0SW1hZ2VEYXRhQXN5bmMocGl4ZWxzLCBzaXplLndpZHRoLCBzaXplLmhlaWdodCwgbWltZVR5cGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9leHBvcnRJbWFnZShiYWJ5bG9uVGV4dHVyZS5uYW1lLCBtaW1lVHlwZSwgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9KSgpO1xyXG4gICAgICAgICAgICAgICAgaW50ZXJuYWxUZXh0dXJlVG9JbWFnZVtpbnRlcm5hbFRleHR1cmVVbmlxdWVJZF1bbWltZVR5cGVdID0gaW1hZ2VJbmRleFByb21pc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHRleHR1cmVJbmZvID0gdGhpcy5fZXhwb3J0VGV4dHVyZUluZm8oYXdhaXQgaW1hZ2VJbmRleFByb21pc2UsIHNhbXBsZXJJbmRleCwgYmFieWxvblRleHR1cmUuY29vcmRpbmF0ZXNJbmRleCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3RleHR1cmVNYXBbdGV4dHVyZVVpZF0gPSB0ZXh0dXJlSW5mbztcclxuICAgICAgICAgICAgdGhpcy5fZXhwb3J0ZXIuX2V4dGVuc2lvbnNQb3N0RXhwb3J0VGV4dHVyZXMoXCJleHBvcnRlclwiLCB0aGlzLl90ZXh0dXJlTWFwW3RleHR1cmVVaWRdLCBiYWJ5bG9uVGV4dHVyZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fdGV4dHVyZU1hcFt0ZXh0dXJlVWlkXTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9leHBvcnRJbWFnZShuYW1lOiBzdHJpbmcsIG1pbWVUeXBlOiBJbWFnZU1pbWVUeXBlLCBkYXRhOiBBcnJheUJ1ZmZlcik6IG51bWJlciB7XHJcbiAgICAgICAgY29uc3QgaW1hZ2VEYXRhID0gdGhpcy5fZXhwb3J0ZXIuX2ltYWdlRGF0YTtcclxuXHJcbiAgICAgICAgY29uc3QgYmFzZU5hbWUgPSBuYW1lLnJlcGxhY2UoL1xcLlxcL3xcXC98XFwuXFxcXHxcXFxcL2csIFwiX1wiKTtcclxuICAgICAgICBjb25zdCBleHRlbnNpb24gPSBnZXRGaWxlRXh0ZW5zaW9uRnJvbU1pbWVUeXBlKG1pbWVUeXBlKTtcclxuICAgICAgICBsZXQgZmlsZU5hbWUgPSBiYXNlTmFtZSArIGV4dGVuc2lvbjtcclxuICAgICAgICBpZiAoZmlsZU5hbWUgaW4gaW1hZ2VEYXRhKSB7XHJcbiAgICAgICAgICAgIGZpbGVOYW1lID0gYCR7YmFzZU5hbWV9XyR7VG9vbHMuUmFuZG9tSWQoKX0ke2V4dGVuc2lvbn1gO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW1hZ2VEYXRhW2ZpbGVOYW1lXSA9IHtcclxuICAgICAgICAgICAgZGF0YTogZGF0YSxcclxuICAgICAgICAgICAgbWltZVR5cGU6IG1pbWVUeXBlLFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNvbnN0IGltYWdlcyA9IHRoaXMuX2V4cG9ydGVyLl9pbWFnZXM7XHJcbiAgICAgICAgaW1hZ2VzLnB1c2goe1xyXG4gICAgICAgICAgICBuYW1lOiBuYW1lLFxyXG4gICAgICAgICAgICB1cmk6IGZpbGVOYW1lLFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gaW1hZ2VzLmxlbmd0aCAtIDE7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZXhwb3J0VGV4dHVyZUluZm8oaW1hZ2VJbmRleDogbnVtYmVyLCBzYW1wbGVySW5kZXg6IG51bWJlciwgY29vcmRpbmF0ZXNJbmRleD86IG51bWJlcik6IElUZXh0dXJlSW5mbyB7XHJcbiAgICAgICAgY29uc3QgdGV4dHVyZXMgPSB0aGlzLl9leHBvcnRlci5fdGV4dHVyZXM7XHJcbiAgICAgICAgbGV0IHRleHR1cmVJbmRleCA9IHRleHR1cmVzLmZpbmRJbmRleCgodCkgPT4gdC5zYW1wbGVyID09IHNhbXBsZXJJbmRleCAmJiB0LnNvdXJjZSA9PT0gaW1hZ2VJbmRleCk7XHJcbiAgICAgICAgaWYgKHRleHR1cmVJbmRleCA9PT0gLTEpIHtcclxuICAgICAgICAgICAgdGV4dHVyZUluZGV4ID0gdGV4dHVyZXMubGVuZ3RoO1xyXG4gICAgICAgICAgICB0ZXh0dXJlcy5wdXNoKHtcclxuICAgICAgICAgICAgICAgIHNvdXJjZTogaW1hZ2VJbmRleCxcclxuICAgICAgICAgICAgICAgIHNhbXBsZXI6IHNhbXBsZXJJbmRleCxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCB0ZXh0dXJlSW5mbzogSVRleHR1cmVJbmZvID0geyBpbmRleDogdGV4dHVyZUluZGV4IH07XHJcbiAgICAgICAgaWYgKGNvb3JkaW5hdGVzSW5kZXgpIHtcclxuICAgICAgICAgICAgdGV4dHVyZUluZm8udGV4Q29vcmQgPSBjb29yZGluYXRlc0luZGV4O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGV4dHVyZUluZm87XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZXhwb3J0VGV4dHVyZVNhbXBsZXIodGV4dHVyZTogTnVsbGFibGU8QmFzZVRleHR1cmU+KTogbnVtYmVyIHtcclxuICAgICAgICBjb25zdCBzYW1wbGVyID0gdGhpcy5fZ2V0VGV4dHVyZVNhbXBsZXIodGV4dHVyZSk7XHJcblxyXG4gICAgICAgIC8vIGlmIGEgcHJlLWV4aXN0aW5nIHNhbXBsZXIgd2l0aCBpZGVudGljYWwgcGFyYW1ldGVycyBleGlzdHMsIHRoZW4gcmV1c2UgdGhlIHByZXZpb3VzIHNhbXBsZXJcclxuICAgICAgICBjb25zdCBzYW1wbGVycyA9IHRoaXMuX2V4cG9ydGVyLl9zYW1wbGVycztcclxuICAgICAgICBjb25zdCBzYW1wbGVySW5kZXggPSBzYW1wbGVycy5maW5kSW5kZXgoXHJcbiAgICAgICAgICAgIChzKSA9PiBzLm1pbkZpbHRlciA9PT0gc2FtcGxlci5taW5GaWx0ZXIgJiYgcy5tYWdGaWx0ZXIgPT09IHNhbXBsZXIubWFnRmlsdGVyICYmIHMud3JhcFMgPT09IHNhbXBsZXIud3JhcFMgJiYgcy53cmFwVCA9PT0gc2FtcGxlci53cmFwVFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgaWYgKHNhbXBsZXJJbmRleCAhPT0gLTEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHNhbXBsZXJJbmRleDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNhbXBsZXJzLnB1c2goc2FtcGxlcik7XHJcbiAgICAgICAgcmV0dXJuIHNhbXBsZXJzLmxlbmd0aCAtIDE7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHR5cGUgeyBOb2RlIH0gZnJvbSBcImNvcmUvbm9kZVwiO1xyXG5pbXBvcnQgdHlwZSB7IFNjZW5lIH0gZnJvbSBcImNvcmUvc2NlbmVcIjtcclxuaW1wb3J0IHR5cGUgeyBBbmltYXRpb24gfSBmcm9tIFwiY29yZS9BbmltYXRpb25zL2FuaW1hdGlvblwiO1xyXG5pbXBvcnQgdHlwZSB7IEdMVEZEYXRhIH0gZnJvbSBcIi4vZ2xURkRhdGFcIjtcclxuaW1wb3J0IHsgX0V4cG9ydGVyIH0gZnJvbSBcIi4vZ2xURkV4cG9ydGVyXCI7XHJcblxyXG4vKipcclxuICogSG9sZHMgYSBjb2xsZWN0aW9uIG9mIGV4cG9ydGVyIG9wdGlvbnMgYW5kIHBhcmFtZXRlcnNcclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUV4cG9ydE9wdGlvbnMge1xyXG4gICAgLyoqXHJcbiAgICAgKiBGdW5jdGlvbiB3aGljaCBpbmRpY2F0ZXMgd2hldGhlciBhIGJhYnlsb24gbm9kZSBzaG91bGQgYmUgZXhwb3J0ZWQgb3Igbm90XHJcbiAgICAgKiBAcGFyYW0gbm9kZSBzb3VyY2UgQmFieWxvbiBub2RlLiBJdCBpcyB1c2VkIHRvIGNoZWNrIHdoZXRoZXIgaXQgc2hvdWxkIGJlIGV4cG9ydGVkIHRvIGdsVEYgb3Igbm90XHJcbiAgICAgKiBAcmV0dXJucyBib29sZWFuLCB3aGljaCBpbmRpY2F0ZXMgd2hldGhlciB0aGUgbm9kZSBzaG91bGQgYmUgZXhwb3J0ZWQgKHRydWUpIG9yIG5vdCAoZmFsc2UpXHJcbiAgICAgKi9cclxuICAgIHNob3VsZEV4cG9ydE5vZGU/KG5vZGU6IE5vZGUpOiBib29sZWFuO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRnVuY3Rpb24gd2hpY2ggaW5kaWNhdGVzIHdoZXRoZXIgYW4gYW5pbWF0aW9uIG9uIHRoZSBzY2VuZSBzaG91bGQgYmUgZXhwb3J0ZWQgb3Igbm90XHJcbiAgICAgKiBAcGFyYW0gYW5pbWF0aW9uIHNvdXJjZSBhbmltYXRpb25cclxuICAgICAqIEByZXR1cm5zIGJvb2xlYW4sIHdoaWNoIGluZGljYXRlcyB3aGV0aGVyIHRoZSBhbmltYXRpb24gc2hvdWxkIGJlIGV4cG9ydGVkICh0cnVlKSBvciBub3QgKGZhbHNlKVxyXG4gICAgICovXHJcbiAgICBzaG91bGRFeHBvcnRBbmltYXRpb24/KGFuaW1hdGlvbjogQW5pbWF0aW9uKTogYm9vbGVhbjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEZ1bmN0aW9uIHVzZWQgdG8gZXh0cmFjdCB0aGUgcGFydCBvZiBub2RlJ3MgbWV0YWRhdGEgdGhhdCB3aWxsIGJlIGV4cG9ydGVkIGludG8gZ2xURiBub2RlIGV4dHJhc1xyXG4gICAgICogQHBhcmFtIG1ldGFkYXRhIHNvdXJjZSBtZXRhZGF0YSB0byByZWFkIGZyb21cclxuICAgICAqIEByZXR1cm5zIHRoZSBkYXRhIHRvIHN0b3JlIHRvIGdsVEYgbm9kZSBleHRyYXNcclxuICAgICAqL1xyXG4gICAgbWV0YWRhdGFTZWxlY3Rvcj8obWV0YWRhdGE6IGFueSk6IGFueTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoZSBzYW1wbGUgcmF0ZSB0byBiYWtlIGFuaW1hdGlvbiBjdXJ2ZXMuIERlZmF1bHRzIHRvIDEgLyA2MC5cclxuICAgICAqL1xyXG4gICAgYW5pbWF0aW9uU2FtcGxlUmF0ZT86IG51bWJlcjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEJlZ2luIHNlcmlhbGl6YXRpb24gd2l0aG91dCB3YWl0aW5nIGZvciB0aGUgc2NlbmUgdG8gYmUgcmVhZHkuIERlZmF1bHRzIHRvIGZhbHNlLlxyXG4gICAgICovXHJcbiAgICBleHBvcnRXaXRob3V0V2FpdGluZ0ZvclNjZW5lPzogYm9vbGVhbjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEluZGljYXRlcyBpZiB1bnVzZWQgdmVydGV4IHV2IGF0dHJpYnV0ZXMgc2hvdWxkIGJlIGluY2x1ZGVkIGluIGV4cG9ydC4gRGVmYXVsdHMgdG8gZmFsc2UuXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydFVudXNlZFVWcz86IGJvb2xlYW47XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmUgbm8tb3Agcm9vdCBub2RlcyB3aGVuIHBvc3NpYmxlLiBEZWZhdWx0cyB0byB0cnVlLlxyXG4gICAgICovXHJcbiAgICByZW1vdmVOb29wUm9vdE5vZGVzPzogYm9vbGVhbjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEluZGljYXRlcyBpZiBjb29yZGluYXRlIHN5c3RlbSBzd2FwcGluZyByb290IG5vZGVzIHNob3VsZCBiZSBpbmNsdWRlZCBpbiBleHBvcnQuIERlZmF1bHRzIHRvIGZhbHNlLlxyXG4gICAgICogQGRlcHJlY2F0ZWQgUGxlYXNlIHVzZSByZW1vdmVOb29wUm9vdE5vZGVzIGluc3RlYWRcclxuICAgICAqL1xyXG4gICAgaW5jbHVkZUNvb3JkaW5hdGVTeXN0ZW1Db252ZXJzaW9uTm9kZXM/OiBib29sZWFuO1xyXG59XHJcblxyXG4vKipcclxuICogQ2xhc3MgZm9yIGdlbmVyYXRpbmcgZ2xURiBkYXRhIGZyb20gYSBCYWJ5bG9uIHNjZW5lLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEdMVEYyRXhwb3J0IHtcclxuICAgIC8qKlxyXG4gICAgICogRXhwb3J0cyB0aGUgZ2VvbWV0cnkgb2YgdGhlIHNjZW5lIHRvIC5nbHRmIGZpbGUgZm9ybWF0IGFzeW5jaHJvbm91c2x5XHJcbiAgICAgKiBAcGFyYW0gc2NlbmUgQmFieWxvbiBzY2VuZSB3aXRoIHNjZW5lIGhpZXJhcmNoeSBpbmZvcm1hdGlvblxyXG4gICAgICogQHBhcmFtIGZpbGVQcmVmaXggRmlsZSBwcmVmaXggdG8gdXNlIHdoZW4gZ2VuZXJhdGluZyB0aGUgZ2xURiBmaWxlXHJcbiAgICAgKiBAcGFyYW0gb3B0aW9ucyBFeHBvcnRlciBvcHRpb25zXHJcbiAgICAgKiBAcmV0dXJucyBSZXR1cm5zIGFuIG9iamVjdCB3aXRoIGEgLmdsdGYgZmlsZSBhbmQgYXNzb2NpYXRlcyB0ZXh0dXJlIG5hbWVzXHJcbiAgICAgKiBhcyBrZXlzIGFuZCB0aGVpciBkYXRhIGFuZCBwYXRocyBhcyB2YWx1ZXNcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBHTFRGQXN5bmMoc2NlbmU6IFNjZW5lLCBmaWxlUHJlZml4OiBzdHJpbmcsIG9wdGlvbnM/OiBJRXhwb3J0T3B0aW9ucyk6IFByb21pc2U8R0xURkRhdGE+IHtcclxuICAgICAgICByZXR1cm4gc2NlbmUud2hlblJlYWR5QXN5bmMoKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgZ2xURlByZWZpeCA9IGZpbGVQcmVmaXgucmVwbGFjZSgvXFwuW14vLl0rJC8sIFwiXCIpO1xyXG4gICAgICAgICAgICBjb25zdCBnbHRmR2VuZXJhdG9yID0gbmV3IF9FeHBvcnRlcihzY2VuZSwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgIHJldHVybiBnbHRmR2VuZXJhdG9yLl9nZW5lcmF0ZUdMVEZBc3luYyhnbFRGUHJlZml4KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBfUHJlRXhwb3J0QXN5bmMoc2NlbmU6IFNjZW5lLCBvcHRpb25zPzogSUV4cG9ydE9wdGlvbnMpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMuZXhwb3J0V2l0aG91dFdhaXRpbmdGb3JTY2VuZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNjZW5lLndoZW5SZWFkeUFzeW5jKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBfUG9zdEV4cG9ydEFzeW5jKHNjZW5lOiBTY2VuZSwgZ2xURkRhdGE6IEdMVEZEYXRhLCBvcHRpb25zPzogSUV4cG9ydE9wdGlvbnMpOiBQcm9taXNlPEdMVEZEYXRhPiB7XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmV4cG9ydFdpdGhvdXRXYWl0aW5nRm9yU2NlbmUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBnbFRGRGF0YTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBnbFRGRGF0YTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRXhwb3J0cyB0aGUgZ2VvbWV0cnkgb2YgdGhlIHNjZW5lIHRvIC5nbGIgZmlsZSBmb3JtYXQgYXN5Y2hyb25vdXNseVxyXG4gICAgICogQHBhcmFtIHNjZW5lIEJhYnlsb24gc2NlbmUgd2l0aCBzY2VuZSBoaWVyYXJjaHkgaW5mb3JtYXRpb25cclxuICAgICAqIEBwYXJhbSBmaWxlUHJlZml4IEZpbGUgcHJlZml4IHRvIHVzZSB3aGVuIGdlbmVyYXRpbmcgZ2xiIGZpbGVcclxuICAgICAqIEBwYXJhbSBvcHRpb25zIEV4cG9ydGVyIG9wdGlvbnNcclxuICAgICAqIEByZXR1cm5zIFJldHVybnMgYW4gb2JqZWN0IHdpdGggYSAuZ2xiIGZpbGVuYW1lIGFzIGtleSBhbmQgZGF0YSBhcyB2YWx1ZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIEdMQkFzeW5jKHNjZW5lOiBTY2VuZSwgZmlsZVByZWZpeDogc3RyaW5nLCBvcHRpb25zPzogSUV4cG9ydE9wdGlvbnMpOiBQcm9taXNlPEdMVEZEYXRhPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX1ByZUV4cG9ydEFzeW5jKHNjZW5lLCBvcHRpb25zKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgZ2xURlByZWZpeCA9IGZpbGVQcmVmaXgucmVwbGFjZSgvXFwuW14vLl0rJC8sIFwiXCIpO1xyXG4gICAgICAgICAgICBjb25zdCBnbHRmR2VuZXJhdG9yID0gbmV3IF9FeHBvcnRlcihzY2VuZSwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgIHJldHVybiBnbHRmR2VuZXJhdG9yLl9nZW5lcmF0ZUdMQkFzeW5jKGdsVEZQcmVmaXgpLnRoZW4oKGdsVEZEYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fUG9zdEV4cG9ydEFzeW5jKHNjZW5lLCBnbFRGRGF0YSwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB0eXBlIHsgSUJ1ZmZlclZpZXcsIEFjY2Vzc29yQ29tcG9uZW50VHlwZSwgSUFjY2Vzc29yIH0gZnJvbSBcImJhYnlsb25qcy1nbHRmMmludGVyZmFjZVwiO1xyXG5pbXBvcnQgeyBBY2Nlc3NvclR5cGUgfSBmcm9tIFwiYmFieWxvbmpzLWdsdGYyaW50ZXJmYWNlXCI7XHJcblxyXG5pbXBvcnQgdHlwZSB7IEZsb2F0QXJyYXksIE51bGxhYmxlIH0gZnJvbSBcImNvcmUvdHlwZXNcIjtcclxuaW1wb3J0IHR5cGUgeyBWZWN0b3I0IH0gZnJvbSBcImNvcmUvTWF0aHMvbWF0aC52ZWN0b3JcIjtcclxuaW1wb3J0IHsgVmVjdG9yMyB9IGZyb20gXCJjb3JlL01hdGhzL21hdGgudmVjdG9yXCI7XHJcblxyXG4vKipcclxuICogQGludGVybmFsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgX0dMVEZVdGlsaXRpZXMge1xyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIGEgYnVmZmVyIHZpZXcgYmFzZWQgb24gdGhlIHN1cHBsaWVkIGFyZ3VtZW50c1xyXG4gICAgICogQHBhcmFtIGJ1ZmZlckluZGV4IGluZGV4IHZhbHVlIG9mIHRoZSBzcGVjaWZpZWQgYnVmZmVyXHJcbiAgICAgKiBAcGFyYW0gYnl0ZU9mZnNldCBieXRlIG9mZnNldCB2YWx1ZVxyXG4gICAgICogQHBhcmFtIGJ5dGVMZW5ndGggYnl0ZSBsZW5ndGggb2YgdGhlIGJ1ZmZlclZpZXdcclxuICAgICAqIEBwYXJhbSBieXRlU3RyaWRlIGJ5dGUgZGlzdGFuY2UgYmV0d2VlbiBjb25lcXVlbnRpYWwgZWxlbWVudHNcclxuICAgICAqIEBwYXJhbSBuYW1lIG5hbWUgb2YgdGhlIGJ1ZmZlciB2aWV3XHJcbiAgICAgKiBAcmV0dXJucyBidWZmZXJWaWV3IGZvciBnbFRGXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgX0NyZWF0ZUJ1ZmZlclZpZXcoYnVmZmVySW5kZXg6IG51bWJlciwgYnl0ZU9mZnNldDogbnVtYmVyLCBieXRlTGVuZ3RoOiBudW1iZXIsIGJ5dGVTdHJpZGU/OiBudW1iZXIsIG5hbWU/OiBzdHJpbmcpOiBJQnVmZmVyVmlldyB7XHJcbiAgICAgICAgY29uc3QgYnVmZmVydmlldzogSUJ1ZmZlclZpZXcgPSB7IGJ1ZmZlcjogYnVmZmVySW5kZXgsIGJ5dGVMZW5ndGg6IGJ5dGVMZW5ndGggfTtcclxuICAgICAgICBpZiAoYnl0ZU9mZnNldCkge1xyXG4gICAgICAgICAgICBidWZmZXJ2aWV3LmJ5dGVPZmZzZXQgPSBieXRlT2Zmc2V0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobmFtZSkge1xyXG4gICAgICAgICAgICBidWZmZXJ2aWV3Lm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoYnl0ZVN0cmlkZSkge1xyXG4gICAgICAgICAgICBidWZmZXJ2aWV3LmJ5dGVTdHJpZGUgPSBieXRlU3RyaWRlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGJ1ZmZlcnZpZXc7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIGFuIGFjY2Vzc29yIGJhc2VkIG9uIHRoZSBzdXBwbGllZCBhcmd1bWVudHNcclxuICAgICAqIEBwYXJhbSBidWZmZXJ2aWV3SW5kZXggVGhlIGluZGV4IG9mIHRoZSBidWZmZXJ2aWV3IHJlZmVyZW5jZWQgYnkgdGhpcyBhY2Nlc3NvclxyXG4gICAgICogQHBhcmFtIG5hbWUgVGhlIG5hbWUgb2YgdGhlIGFjY2Vzc29yXHJcbiAgICAgKiBAcGFyYW0gdHlwZSBUaGUgdHlwZSBvZiB0aGUgYWNjZXNzb3JcclxuICAgICAqIEBwYXJhbSBjb21wb25lbnRUeXBlIFRoZSBkYXRhdHlwZSBvZiBjb21wb25lbnRzIGluIHRoZSBhdHRyaWJ1dGVcclxuICAgICAqIEBwYXJhbSBjb3VudCBUaGUgbnVtYmVyIG9mIGF0dHJpYnV0ZXMgcmVmZXJlbmNlZCBieSB0aGlzIGFjY2Vzc29yXHJcbiAgICAgKiBAcGFyYW0gYnl0ZU9mZnNldCBUaGUgb2Zmc2V0IHJlbGF0aXZlIHRvIHRoZSBzdGFydCBvZiB0aGUgYnVmZmVyVmlldyBpbiBieXRlc1xyXG4gICAgICogQHBhcmFtIG1pbiBNaW5pbXVtIHZhbHVlIG9mIGVhY2ggY29tcG9uZW50IGluIHRoaXMgYXR0cmlidXRlXHJcbiAgICAgKiBAcGFyYW0gbWF4IE1heGltdW0gdmFsdWUgb2YgZWFjaCBjb21wb25lbnQgaW4gdGhpcyBhdHRyaWJ1dGVcclxuICAgICAqIEByZXR1cm5zIGFjY2Vzc29yIGZvciBnbFRGXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgX0NyZWF0ZUFjY2Vzc29yKFxyXG4gICAgICAgIGJ1ZmZlcnZpZXdJbmRleDogbnVtYmVyLFxyXG4gICAgICAgIG5hbWU6IHN0cmluZyxcclxuICAgICAgICB0eXBlOiBBY2Nlc3NvclR5cGUsXHJcbiAgICAgICAgY29tcG9uZW50VHlwZTogQWNjZXNzb3JDb21wb25lbnRUeXBlLFxyXG4gICAgICAgIGNvdW50OiBudW1iZXIsXHJcbiAgICAgICAgYnl0ZU9mZnNldDogTnVsbGFibGU8bnVtYmVyPixcclxuICAgICAgICBtaW46IE51bGxhYmxlPG51bWJlcltdPixcclxuICAgICAgICBtYXg6IE51bGxhYmxlPG51bWJlcltdPlxyXG4gICAgKTogSUFjY2Vzc29yIHtcclxuICAgICAgICBjb25zdCBhY2Nlc3NvcjogSUFjY2Vzc29yID0geyBuYW1lOiBuYW1lLCBidWZmZXJWaWV3OiBidWZmZXJ2aWV3SW5kZXgsIGNvbXBvbmVudFR5cGU6IGNvbXBvbmVudFR5cGUsIGNvdW50OiBjb3VudCwgdHlwZTogdHlwZSB9O1xyXG5cclxuICAgICAgICBpZiAobWluICE9IG51bGwpIHtcclxuICAgICAgICAgICAgYWNjZXNzb3IubWluID0gbWluO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobWF4ICE9IG51bGwpIHtcclxuICAgICAgICAgICAgYWNjZXNzb3IubWF4ID0gbWF4O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoYnl0ZU9mZnNldCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIGFjY2Vzc29yLmJ5dGVPZmZzZXQgPSBieXRlT2Zmc2V0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGFjY2Vzc29yO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2FsY3VsYXRlcyB0aGUgbWluaW11bSBhbmQgbWF4aW11bSB2YWx1ZXMgb2YgYW4gYXJyYXkgb2YgcG9zaXRpb24gZmxvYXRzXHJcbiAgICAgKiBAcGFyYW0gcG9zaXRpb25zIFBvc2l0aW9ucyBhcnJheSBvZiBhIG1lc2hcclxuICAgICAqIEBwYXJhbSB2ZXJ0ZXhTdGFydCBTdGFydGluZyB2ZXJ0ZXggb2Zmc2V0IHRvIGNhbGN1bGF0ZSBtaW4gYW5kIG1heCB2YWx1ZXNcclxuICAgICAqIEBwYXJhbSB2ZXJ0ZXhDb3VudCBOdW1iZXIgb2YgdmVydGljZXMgdG8gY2hlY2sgZm9yIG1pbiBhbmQgbWF4IHZhbHVlc1xyXG4gICAgICogQHJldHVybnMgbWluIG51bWJlciBhcnJheSBhbmQgbWF4IG51bWJlciBhcnJheVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIF9DYWxjdWxhdGVNaW5NYXhQb3NpdGlvbnMocG9zaXRpb25zOiBGbG9hdEFycmF5LCB2ZXJ0ZXhTdGFydDogbnVtYmVyLCB2ZXJ0ZXhDb3VudDogbnVtYmVyKTogeyBtaW46IG51bWJlcltdOyBtYXg6IG51bWJlcltdIH0ge1xyXG4gICAgICAgIGNvbnN0IG1pbiA9IFtJbmZpbml0eSwgSW5maW5pdHksIEluZmluaXR5XTtcclxuICAgICAgICBjb25zdCBtYXggPSBbLUluZmluaXR5LCAtSW5maW5pdHksIC1JbmZpbml0eV07XHJcbiAgICAgICAgY29uc3QgcG9zaXRpb25TdHJpZGVTaXplID0gMztcclxuICAgICAgICBsZXQgaW5kZXhPZmZzZXQ6IG51bWJlcjtcclxuICAgICAgICBsZXQgcG9zaXRpb246IFZlY3RvcjM7XHJcbiAgICAgICAgbGV0IHZlY3RvcjogbnVtYmVyW107XHJcblxyXG4gICAgICAgIGlmICh2ZXJ0ZXhDb3VudCkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gdmVydGV4U3RhcnQsIGxlbmd0aCA9IHZlcnRleFN0YXJ0ICsgdmVydGV4Q291bnQ7IGkgPCBsZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgaW5kZXhPZmZzZXQgPSBwb3NpdGlvblN0cmlkZVNpemUgKiBpO1xyXG5cclxuICAgICAgICAgICAgICAgIHBvc2l0aW9uID0gVmVjdG9yMy5Gcm9tQXJyYXkocG9zaXRpb25zLCBpbmRleE9mZnNldCk7XHJcbiAgICAgICAgICAgICAgICB2ZWN0b3IgPSBwb3NpdGlvbi5hc0FycmF5KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBwb3NpdGlvblN0cmlkZVNpemU7ICsraikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG51bSA9IHZlY3RvcltqXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobnVtIDwgbWluW2pdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbltqXSA9IG51bTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG51bSA+IG1heFtqXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXhbal0gPSBudW07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICsraW5kZXhPZmZzZXQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHsgbWluLCBtYXggfTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIF9Ob3JtYWxpemVUYW5nZW50RnJvbVJlZih0YW5nZW50OiBWZWN0b3I0IHwgVmVjdG9yMykge1xyXG4gICAgICAgIGNvbnN0IGxlbmd0aCA9IE1hdGguc3FydCh0YW5nZW50LnggKiB0YW5nZW50LnggKyB0YW5nZW50LnkgKiB0YW5nZW50LnkgKyB0YW5nZW50LnogKiB0YW5nZW50LnopO1xyXG4gICAgICAgIGlmIChsZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHRhbmdlbnQueCAvPSBsZW5ndGg7XHJcbiAgICAgICAgICAgIHRhbmdlbnQueSAvPSBsZW5ndGg7XHJcbiAgICAgICAgICAgIHRhbmdlbnQueiAvPSBsZW5ndGg7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgX0dldERhdGFBY2Nlc3NvckVsZW1lbnRDb3VudChhY2Nlc3NvclR5cGU6IEFjY2Vzc29yVHlwZSkge1xyXG4gICAgICAgIHN3aXRjaCAoYWNjZXNzb3JUeXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgQWNjZXNzb3JUeXBlLk1BVDI6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gNDtcclxuICAgICAgICAgICAgY2FzZSBBY2Nlc3NvclR5cGUuTUFUMzpcclxuICAgICAgICAgICAgICAgIHJldHVybiA5O1xyXG4gICAgICAgICAgICBjYXNlIEFjY2Vzc29yVHlwZS5NQVQ0OlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDE2O1xyXG4gICAgICAgICAgICBjYXNlIEFjY2Vzc29yVHlwZS5TQ0FMQVI6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICAgICAgY2FzZSBBY2Nlc3NvclR5cGUuVkVDMjpcclxuICAgICAgICAgICAgICAgIHJldHVybiAyO1xyXG4gICAgICAgICAgICBjYXNlIEFjY2Vzc29yVHlwZS5WRUMzOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDM7XHJcbiAgICAgICAgICAgIGNhc2UgQWNjZXNzb3JUeXBlLlZFQzQ6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gNDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiLyogZXNsaW50LWRpc2FibGUgaW1wb3J0L25vLWludGVybmFsLW1vZHVsZXMgKi9cclxuZXhwb3J0ICogZnJvbSBcIi4vZ2xURkFuaW1hdGlvblwiO1xyXG5leHBvcnQgKiBmcm9tIFwiLi9nbFRGRGF0YVwiO1xyXG5leHBvcnQgKiBmcm9tIFwiLi9nbFRGRXhwb3J0ZXJcIjtcclxuZXhwb3J0ICogZnJvbSBcIi4vZ2xURkV4cG9ydGVyRXh0ZW5zaW9uXCI7XHJcbmV4cG9ydCAqIGZyb20gXCIuL2dsVEZNYXRlcmlhbEV4cG9ydGVyXCI7XHJcbmV4cG9ydCAqIGZyb20gXCIuL2dsVEZTZXJpYWxpemVyXCI7XHJcbmV4cG9ydCAqIGZyb20gXCIuL2dsVEZVdGlsaXRpZXNcIjtcclxuZXhwb3J0ICogZnJvbSBcIi4vRXh0ZW5zaW9ucy9pbmRleFwiO1xyXG4iLCIvKiogQGludGVybmFsICovXHJcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby12YXIsIEB0eXBlc2NyaXB0LWVzbGludC9uYW1pbmctY29udmVudGlvblxyXG5leHBvcnQgdmFyIF9fSUdMVEZFeHBvcnRlckV4dGVuc2lvbiA9IDA7IC8vIEkgYW0gaGVyZSB0byBhbGxvdyBkdHMgdG8gYmUgY3JlYXRlZFxyXG5cclxuLyoqXHJcbiAqIEludGVyZmFjZSBmb3IgZXh0ZW5kaW5nIHRoZSBleHBvcnRlclxyXG4gKiBAaW50ZXJuYWxcclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUdMVEZFeHBvcnRlckV4dGVuc2lvbiB7XHJcbiAgICAvKipcclxuICAgICAqIFRoZSBuYW1lIG9mIHRoaXMgZXh0ZW5zaW9uXHJcbiAgICAgKi9cclxuICAgIHJlYWRvbmx5IG5hbWU6IHN0cmluZztcclxuICAgIC8qKlxyXG4gICAgICogRGVmaW5lcyB3aGV0aGVyIHRoaXMgZXh0ZW5zaW9uIGlzIGVuYWJsZWRcclxuICAgICAqL1xyXG4gICAgZW5hYmxlZDogYm9vbGVhbjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIERlZmluZXMgd2hldGhlciB0aGlzIGV4dGVuc2lvbiBpcyByZXF1aXJlZFxyXG4gICAgICovXHJcbiAgICByZXF1aXJlZDogYm9vbGVhbjtcclxufVxyXG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBpbXBvcnQvbm8taW50ZXJuYWwtbW9kdWxlcyAqL1xyXG5leHBvcnQgKiBmcm9tIFwiLi9nbFRGRmlsZUV4cG9ydGVyXCI7XHJcbmV4cG9ydCAqIGZyb20gXCIuLzIuMC9pbmRleFwiO1xyXG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBpbXBvcnQvbm8taW50ZXJuYWwtbW9kdWxlcyAqL1xyXG5leHBvcnQgKiBmcm9tIFwiLi9PQkovaW5kZXhcIjtcclxuZXhwb3J0ICogZnJvbSBcIi4vZ2xURi9pbmRleFwiO1xyXG5leHBvcnQgKiBmcm9tIFwiLi9zdGwvaW5kZXhcIjtcclxuIiwiZXhwb3J0ICogZnJvbSBcIi4vc3RsU2VyaWFsaXplclwiO1xyXG4iLCJpbXBvcnQgeyBNZXNoIH0gZnJvbSBcImNvcmUvTWVzaGVzL21lc2hcIjtcclxuaW1wb3J0IHsgSW5zdGFuY2VkTWVzaCB9IGZyb20gXCJjb3JlL01lc2hlcy9pbnN0YW5jZWRNZXNoXCI7XHJcbmltcG9ydCB7IFZlcnRleEJ1ZmZlciB9IGZyb20gXCJjb3JlL0J1ZmZlcnMvYnVmZmVyXCI7XHJcbmltcG9ydCB7IFZlY3RvcjMgfSBmcm9tIFwiY29yZS9NYXRocy9tYXRoLnZlY3RvclwiO1xyXG5cclxuLyoqXHJcbiAqIENsYXNzIGZvciBnZW5lcmF0aW5nIFNUTCBkYXRhIGZyb20gYSBCYWJ5bG9uIHNjZW5lLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFNUTEV4cG9ydCB7XHJcbiAgICAvKipcclxuICAgICAqIEV4cG9ydHMgdGhlIGdlb21ldHJ5IG9mIGEgTWVzaCBhcnJheSBpbiAuU1RMIGZpbGUgZm9ybWF0IChBU0NJSSlcclxuICAgICAqIEBwYXJhbSBtZXNoZXMgbGlzdCBkZWZpbmVzIHRoZSBtZXNoIHRvIHNlcmlhbGl6ZVxyXG4gICAgICogQHBhcmFtIGRvd25sb2FkIHRyaWdnZXJzIHRoZSBhdXRvbWF0aWMgZG93bmxvYWQgb2YgdGhlIGZpbGUuXHJcbiAgICAgKiBAcGFyYW0gZmlsZU5hbWUgY2hhbmdlcyB0aGUgZG93bmxvYWRzIGZpbGVOYW1lLlxyXG4gICAgICogQHBhcmFtIGJpbmFyeSBjaGFuZ2VzIHRoZSBTVEwgdG8gYSBiaW5hcnkgdHlwZS5cclxuICAgICAqIEBwYXJhbSBpc0xpdHRsZUVuZGlhbiB0b2dnbGUgZm9yIGJpbmFyeSB0eXBlIGV4cG9ydGVyLlxyXG4gICAgICogQHBhcmFtIGRvTm90QmFrZVRyYW5zZm9ybSB0b2dnbGUgaWYgbWVzaGVzIHRyYW5zZm9ybXMgc2hvdWxkIGJlIGJha2VkIG9yIG5vdC5cclxuICAgICAqIEBwYXJhbSBzdXBwb3J0SW5zdGFuY2VkTWVzaGVzIHRvZ2dsZSB0byBleHBvcnQgaW5zdGFuY2VkIE1lc2hlcy4gRW5hYmxpbmcgc3VwcG9ydCBmb3IgaW5zdGFuY2VkIG1lc2hlcyB3aWxsIG92ZXJyaWRlIGRvTm9CYWtlVHJhbnNmb3JtIGFzIHRydWVcclxuICAgICAqIEBwYXJhbSBleHBvcnRJbmRpdmlkdWFsTWVzaGVzIHRvZ2dsZSB0byBleHBvcnQgZWFjaCBtZXNoIGFzIGFuIGluZGVwZW5kZW50IG1lc2guIEJ5IGRlZmF1bHQsIGFsbCB0aGUgbWVzaGVzIGFyZSBjb21iaW5lZCBpbnRvIG9uZSBtZXNoLiBUaGlzIHByb3BlcnR5IGhhcyBubyBlZmZlY3Qgd2hlbiBleHBvcnRpbmcgaW4gYmluYXJ5IGZvcm1hdFxyXG4gICAgICogQHJldHVybnMgdGhlIFNUTCBhcyBVVEY4IHN0cmluZ1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIENyZWF0ZVNUTChcclxuICAgICAgICBtZXNoZXM6IChNZXNoIHwgSW5zdGFuY2VkTWVzaClbXSxcclxuICAgICAgICBkb3dubG9hZDogYm9vbGVhbiA9IHRydWUsXHJcbiAgICAgICAgZmlsZU5hbWU6IHN0cmluZyA9IFwic3RsbWVzaFwiLFxyXG4gICAgICAgIGJpbmFyeTogYm9vbGVhbiA9IGZhbHNlLFxyXG4gICAgICAgIGlzTGl0dGxlRW5kaWFuOiBib29sZWFuID0gdHJ1ZSxcclxuICAgICAgICBkb05vdEJha2VUcmFuc2Zvcm06IGJvb2xlYW4gPSBmYWxzZSxcclxuICAgICAgICBzdXBwb3J0SW5zdGFuY2VkTWVzaGVzOiBib29sZWFuID0gZmFsc2UsXHJcbiAgICAgICAgZXhwb3J0SW5kaXZpZHVhbE1lc2hlczogYm9vbGVhbiA9IGZhbHNlXHJcbiAgICApOiBhbnkge1xyXG4gICAgICAgIC8vQmluYXJ5IHN1cHBvcnQgYWRhcHRlZCBmcm9tIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL3BhdWxrYXBsYW4vNmQ1ZjBhYjJjN2U4ZmRjNjhhNjFcclxuXHJcbiAgICAgICAgY29uc3QgZ2V0RmFjZURhdGEgPSBmdW5jdGlvbiAoaW5kaWNlczogYW55LCB2ZXJ0aWNlczogYW55LCBpOiBudW1iZXIpIHtcclxuICAgICAgICAgICAgY29uc3QgaWQgPSBbaW5kaWNlc1tpXSAqIDMsIGluZGljZXNbaSArIDFdICogMywgaW5kaWNlc1tpICsgMl0gKiAzXTtcclxuICAgICAgICAgICAgY29uc3QgdiA9IFtcclxuICAgICAgICAgICAgICAgIG5ldyBWZWN0b3IzKHZlcnRpY2VzW2lkWzBdXSwgdmVydGljZXNbaWRbMF0gKyAyXSwgdmVydGljZXNbaWRbMF0gKyAxXSksXHJcbiAgICAgICAgICAgICAgICBuZXcgVmVjdG9yMyh2ZXJ0aWNlc1tpZFsxXV0sIHZlcnRpY2VzW2lkWzFdICsgMl0sIHZlcnRpY2VzW2lkWzFdICsgMV0pLFxyXG4gICAgICAgICAgICAgICAgbmV3IFZlY3RvcjModmVydGljZXNbaWRbMl1dLCB2ZXJ0aWNlc1tpZFsyXSArIDJdLCB2ZXJ0aWNlc1tpZFsyXSArIDFdKSxcclxuICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgY29uc3QgcDFwMiA9IHZbMF0uc3VidHJhY3QodlsxXSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHAzcDIgPSB2WzJdLnN1YnRyYWN0KHZbMV0pO1xyXG4gICAgICAgICAgICBjb25zdCBuID0gVmVjdG9yMy5Dcm9zcyhwM3AyLCBwMXAyKS5ub3JtYWxpemUoKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB7IHYsIG4gfTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdCB3cml0ZVZlY3RvciA9IGZ1bmN0aW9uIChkYXRhdmlldzogYW55LCBvZmZzZXQ6IG51bWJlciwgdmVjdG9yOiBWZWN0b3IzLCBpc0xpdHRsZUVuZGlhbjogYm9vbGVhbikge1xyXG4gICAgICAgICAgICBvZmZzZXQgPSB3cml0ZUZsb2F0KGRhdGF2aWV3LCBvZmZzZXQsIHZlY3Rvci54LCBpc0xpdHRsZUVuZGlhbik7XHJcbiAgICAgICAgICAgIG9mZnNldCA9IHdyaXRlRmxvYXQoZGF0YXZpZXcsIG9mZnNldCwgdmVjdG9yLnksIGlzTGl0dGxlRW5kaWFuKTtcclxuICAgICAgICAgICAgcmV0dXJuIHdyaXRlRmxvYXQoZGF0YXZpZXcsIG9mZnNldCwgdmVjdG9yLnosIGlzTGl0dGxlRW5kaWFuKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdCB3cml0ZUZsb2F0ID0gZnVuY3Rpb24gKGRhdGF2aWV3OiBhbnksIG9mZnNldDogbnVtYmVyLCB2YWx1ZTogbnVtYmVyLCBpc0xpdHRsZUVuZGlhbjogYm9vbGVhbikge1xyXG4gICAgICAgICAgICBkYXRhdmlldy5zZXRGbG9hdDMyKG9mZnNldCwgdmFsdWUsIGlzTGl0dGxlRW5kaWFuKTtcclxuICAgICAgICAgICAgcmV0dXJuIG9mZnNldCArIDQ7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgY29uc3QgZ2V0VmVydGljZXNEYXRhID0gZnVuY3Rpb24gKG1lc2g6IEluc3RhbmNlZE1lc2ggfCBNZXNoKSB7XHJcbiAgICAgICAgICAgIGlmIChzdXBwb3J0SW5zdGFuY2VkTWVzaGVzKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc291cmNlTWVzaCA9IG1lc2g7XHJcbiAgICAgICAgICAgICAgICBpZiAobWVzaCBpbnN0YW5jZW9mIEluc3RhbmNlZE1lc2gpIHtcclxuICAgICAgICAgICAgICAgICAgICBzb3VyY2VNZXNoID0gbWVzaC5zb3VyY2VNZXNoO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29uc3QgZGF0YSA9IHNvdXJjZU1lc2guZ2V0VmVydGljZXNEYXRhKFZlcnRleEJ1ZmZlci5Qb3NpdGlvbktpbmQsIHRydWUsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFkYXRhKSByZXR1cm4gW107XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0ZW1wID0gVmVjdG9yMy5aZXJvKCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgaW5kZXg7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGluZGV4ID0gMDsgaW5kZXggPCBkYXRhLmxlbmd0aDsgaW5kZXggKz0gMykge1xyXG4gICAgICAgICAgICAgICAgICAgIFZlY3RvcjMuVHJhbnNmb3JtQ29vcmRpbmF0ZXNGcm9tRmxvYXRzVG9SZWYoZGF0YVtpbmRleF0sIGRhdGFbaW5kZXggKyAxXSwgZGF0YVtpbmRleCArIDJdLCBtZXNoLmNvbXB1dGVXb3JsZE1hdHJpeCh0cnVlKSwgdGVtcCkudG9BcnJheShkYXRhLCBpbmRleCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBtZXNoLmdldFZlcnRpY2VzRGF0YShWZXJ0ZXhCdWZmZXIuUG9zaXRpb25LaW5kKSB8fCBbXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGlmIChzdXBwb3J0SW5zdGFuY2VkTWVzaGVzKSB7XHJcbiAgICAgICAgICAgIGRvTm90QmFrZVRyYW5zZm9ybSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgZGF0YTogRGF0YVZpZXcgfCBzdHJpbmcgPSBcIlwiO1xyXG5cclxuICAgICAgICBsZXQgZmFjZUNvdW50ID0gMDtcclxuICAgICAgICBsZXQgb2Zmc2V0ID0gMDtcclxuXHJcbiAgICAgICAgaWYgKGJpbmFyeSkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1lc2hlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbWVzaCA9IG1lc2hlc1tpXTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGluZGljZXMgPSBtZXNoLmdldEluZGljZXMoKTtcclxuICAgICAgICAgICAgICAgIGZhY2VDb3VudCArPSBpbmRpY2VzID8gaW5kaWNlcy5sZW5ndGggLyAzIDogMDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgYnVmZmVyU2l6ZSA9IDg0ICsgNTAgKiBmYWNlQ291bnQ7XHJcbiAgICAgICAgICAgIGNvbnN0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcihidWZmZXJTaXplKTtcclxuICAgICAgICAgICAgZGF0YSA9IG5ldyBEYXRhVmlldyhidWZmZXIpO1xyXG5cclxuICAgICAgICAgICAgb2Zmc2V0ICs9IDgwO1xyXG4gICAgICAgICAgICBkYXRhLnNldFVpbnQzMihvZmZzZXQsIGZhY2VDb3VudCwgaXNMaXR0bGVFbmRpYW4pO1xyXG4gICAgICAgICAgICBvZmZzZXQgKz0gNDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoIWV4cG9ydEluZGl2aWR1YWxNZXNoZXMpIHtcclxuICAgICAgICAgICAgICAgIGRhdGEgPSBcInNvbGlkIHN0bG1lc2hcXHJcXG5cIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtZXNoZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgbWVzaCA9IG1lc2hlc1tpXTtcclxuICAgICAgICAgICAgaWYgKCFiaW5hcnkgJiYgZXhwb3J0SW5kaXZpZHVhbE1lc2hlcykge1xyXG4gICAgICAgICAgICAgICAgZGF0YSArPSBcInNvbGlkIFwiICsgbWVzaC5uYW1lICsgXCJcXHJcXG5cIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIWRvTm90QmFrZVRyYW5zZm9ybSAmJiBtZXNoIGluc3RhbmNlb2YgTWVzaCkge1xyXG4gICAgICAgICAgICAgICAgbWVzaC5iYWtlQ3VycmVudFRyYW5zZm9ybUludG9WZXJ0aWNlcygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IHZlcnRpY2VzID0gZ2V0VmVydGljZXNEYXRhKG1lc2gpO1xyXG4gICAgICAgICAgICBjb25zdCBpbmRpY2VzID0gbWVzaC5nZXRJbmRpY2VzKCkgfHwgW107XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGluZGljZXMubGVuZ3RoOyBpICs9IDMpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGZkID0gZ2V0RmFjZURhdGEoaW5kaWNlcywgdmVydGljZXMsIGkpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChiaW5hcnkpIHtcclxuICAgICAgICAgICAgICAgICAgICBvZmZzZXQgPSB3cml0ZVZlY3RvcihkYXRhLCBvZmZzZXQsIGZkLm4sIGlzTGl0dGxlRW5kaWFuKTtcclxuICAgICAgICAgICAgICAgICAgICBvZmZzZXQgPSB3cml0ZVZlY3RvcihkYXRhLCBvZmZzZXQsIGZkLnZbMF0sIGlzTGl0dGxlRW5kaWFuKTtcclxuICAgICAgICAgICAgICAgICAgICBvZmZzZXQgPSB3cml0ZVZlY3RvcihkYXRhLCBvZmZzZXQsIGZkLnZbMV0sIGlzTGl0dGxlRW5kaWFuKTtcclxuICAgICAgICAgICAgICAgICAgICBvZmZzZXQgPSB3cml0ZVZlY3RvcihkYXRhLCBvZmZzZXQsIGZkLnZbMl0sIGlzTGl0dGxlRW5kaWFuKTtcclxuICAgICAgICAgICAgICAgICAgICBvZmZzZXQgKz0gMjtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YSArPSBcIlxcdGZhY2V0IG5vcm1hbCBcIiArIGZkLm4ueCArIFwiIFwiICsgZmQubi55ICsgXCIgXCIgKyBmZC5uLnogKyBcIlxcclxcblwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGEgKz0gXCJcXHRcXHRvdXRlciBsb29wXFxyXFxuXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YSArPSBcIlxcdFxcdFxcdHZlcnRleCBcIiArIGZkLnZbMF0ueCArIFwiIFwiICsgZmQudlswXS55ICsgXCIgXCIgKyBmZC52WzBdLnogKyBcIlxcclxcblwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGEgKz0gXCJcXHRcXHRcXHR2ZXJ0ZXggXCIgKyBmZC52WzFdLnggKyBcIiBcIiArIGZkLnZbMV0ueSArIFwiIFwiICsgZmQudlsxXS56ICsgXCJcXHJcXG5cIjtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhICs9IFwiXFx0XFx0XFx0dmVydGV4IFwiICsgZmQudlsyXS54ICsgXCIgXCIgKyBmZC52WzJdLnkgKyBcIiBcIiArIGZkLnZbMl0ueiArIFwiXFxyXFxuXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YSArPSBcIlxcdFxcdGVuZGxvb3BcXHJcXG5cIjtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhICs9IFwiXFx0ZW5kZmFjZXRcXHJcXG5cIjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIWJpbmFyeSAmJiBleHBvcnRJbmRpdmlkdWFsTWVzaGVzKSB7XHJcbiAgICAgICAgICAgICAgICBkYXRhICs9IFwiZW5kc29saWQgXCIgKyBuYW1lICsgXCJcXHJcXG5cIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFiaW5hcnkgJiYgIWV4cG9ydEluZGl2aWR1YWxNZXNoZXMpIHtcclxuICAgICAgICAgICAgZGF0YSArPSBcImVuZHNvbGlkIHN0bG1lc2hcIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChkb3dubG9hZCkge1xyXG4gICAgICAgICAgICBjb25zdCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XHJcbiAgICAgICAgICAgIGNvbnN0IGJsb2IgPSBuZXcgQmxvYihbZGF0YV0sIHsgdHlwZTogXCJhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW1cIiB9KTtcclxuICAgICAgICAgICAgYS5ocmVmID0gd2luZG93LlVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XHJcbiAgICAgICAgICAgIGEuZG93bmxvYWQgPSBmaWxlTmFtZSArIFwiLnN0bFwiO1xyXG4gICAgICAgICAgICBhLmNsaWNrKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxufVxyXG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBpbXBvcnQvbm8taW50ZXJuYWwtbW9kdWxlcyAqL1xyXG5pbXBvcnQgKiBhcyBFeHBvcnRlcnMgZnJvbSBcInNlcmlhbGl6ZXJzL2dsVEYvZ2xURkZpbGVFeHBvcnRlclwiO1xyXG5pbXBvcnQgKiBhcyBEYXRhcyBmcm9tIFwic2VyaWFsaXplcnMvZ2xURi8yLjAvZ2xURkRhdGFcIjtcclxuaW1wb3J0ICogYXMgU2VyaWFsaXplcnMgZnJvbSBcInNlcmlhbGl6ZXJzL2dsVEYvMi4wL2dsVEZTZXJpYWxpemVyXCI7XHJcbmltcG9ydCAqIGFzIEV4dGVuc2lvbnMgZnJvbSBcInNlcmlhbGl6ZXJzL2dsVEYvMi4wL0V4dGVuc2lvbnMvaW5kZXhcIjtcclxuaW1wb3J0ICogYXMgR0xURjIgZnJvbSBcInNlcmlhbGl6ZXJzL2dsVEYvMi4wL2luZGV4XCI7XHJcblxyXG4vKipcclxuICogVGhpcyBpcyB0aGUgZW50cnkgcG9pbnQgZm9yIHRoZSBVTUQgbW9kdWxlLlxyXG4gKiBUaGUgZW50cnkgcG9pbnQgZm9yIGEgZnV0dXJlIEVTTSBwYWNrYWdlIHNob3VsZCBiZSBpbmRleC50c1xyXG4gKi9cclxuY29uc3QgZ2xvYmFsT2JqZWN0ID0gdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB1bmRlZmluZWQ7XHJcbmlmICh0eXBlb2YgZ2xvYmFsT2JqZWN0ICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAoPGFueT5nbG9iYWxPYmplY3QpLkJBQllMT04gPSAoPGFueT5nbG9iYWxPYmplY3QpLkJBQllMT04gfHwge307XHJcbiAgICBjb25zdCBCQUJZTE9OID0gKDxhbnk+Z2xvYmFsT2JqZWN0KS5CQUJZTE9OO1xyXG4gICAgQkFCWUxPTi5HTFRGMiA9IEJBQllMT04uR0xURjIgfHwge307XHJcbiAgICBCQUJZTE9OLkdMVEYyLkV4cG9ydGVyID0gQkFCWUxPTi5HTFRGMi5FeHBvcnRlciB8fCB7fTtcclxuICAgIEJBQllMT04uR0xURjIuRXhwb3J0ZXIuRXh0ZW5zaW9ucyA9IEJBQllMT04uR0xURjIuRXhwb3J0ZXIuRXh0ZW5zaW9ucyB8fCB7fTtcclxuXHJcbiAgICBjb25zdCBrZXlzID0gW107XHJcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBFeHBvcnRlcnMpIHtcclxuICAgICAgICBCQUJZTE9OW2tleV0gPSAoPGFueT5FeHBvcnRlcnMpW2tleV07XHJcbiAgICAgICAga2V5cy5wdXNoKGtleSk7XHJcbiAgICB9XHJcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBEYXRhcykge1xyXG4gICAgICAgIEJBQllMT05ba2V5XSA9ICg8YW55PkRhdGFzKVtrZXldO1xyXG4gICAgICAgIGtleXMucHVzaChrZXkpO1xyXG4gICAgfVxyXG4gICAgZm9yIChjb25zdCBrZXkgaW4gU2VyaWFsaXplcnMpIHtcclxuICAgICAgICBCQUJZTE9OW2tleV0gPSAoPGFueT5TZXJpYWxpemVycylba2V5XTtcclxuICAgICAgICBrZXlzLnB1c2goa2V5KTtcclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBFeHRlbnNpb25zKSB7XHJcbiAgICAgICAgQkFCWUxPTi5HTFRGMi5FeHBvcnRlci5FeHRlbnNpb25zW2tleV0gPSAoPGFueT5FeHRlbnNpb25zKVtrZXldO1xyXG4gICAgICAgIGtleXMucHVzaChrZXkpO1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAoY29uc3Qga2V5IGluIEdMVEYyKSB7XHJcbiAgICAgICAgLy8gUHJldmVudCBSZWFzc2lnbm1lbnQuXHJcbiAgICAgICAgaWYgKGtleXMuaW5kZXhPZihrZXkpID4gLTEpIHtcclxuICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBCQUJZTE9OLkdMVEYyLkV4cG9ydGVyW2tleV0gPSAoPGFueT5HTFRGMilba2V5XTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0ICogZnJvbSBcInNlcmlhbGl6ZXJzL2dsVEYvZ2xURkZpbGVFeHBvcnRlclwiO1xyXG5leHBvcnQgKiBmcm9tIFwic2VyaWFsaXplcnMvZ2xURi8yLjAvaW5kZXhcIjtcclxuIiwiLyogZXNsaW50LWRpc2FibGUgaW1wb3J0L25vLWludGVybmFsLW1vZHVsZXMgKi9cclxuaW1wb3J0ICogYXMgU2VyaWFsaXplcnMgZnJvbSBcInNlcmlhbGl6ZXJzL09CSi9pbmRleFwiO1xyXG5cclxuLyoqXHJcbiAqIFRoaXMgaXMgdGhlIGVudHJ5IHBvaW50IGZvciB0aGUgVU1EIG1vZHVsZS5cclxuICogVGhlIGVudHJ5IHBvaW50IGZvciBhIGZ1dHVyZSBFU00gcGFja2FnZSBzaG91bGQgYmUgaW5kZXgudHNcclxuICovXHJcbmNvbnN0IGdsb2JhbE9iamVjdCA9IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDogdW5kZWZpbmVkO1xyXG5pZiAodHlwZW9mIGdsb2JhbE9iamVjdCAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgZm9yIChjb25zdCBzZXJpYWxpemVyIGluIFNlcmlhbGl6ZXJzKSB7XHJcbiAgICAgICAgKDxhbnk+Z2xvYmFsT2JqZWN0KS5CQUJZTE9OW3NlcmlhbGl6ZXJdID0gKDxhbnk+U2VyaWFsaXplcnMpW3NlcmlhbGl6ZXJdO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgKiBmcm9tIFwic2VyaWFsaXplcnMvT0JKL2luZGV4XCI7XHJcbiIsIi8qIGVzbGludC1kaXNhYmxlIGltcG9ydC9uby1pbnRlcm5hbC1tb2R1bGVzICovXHJcbmltcG9ydCAqIGFzIFNlcmlhbGl6ZXJzIGZyb20gXCJzZXJpYWxpemVycy9zdGwvaW5kZXhcIjtcclxuXHJcbi8qKlxyXG4gKiBUaGlzIGlzIHRoZSBlbnRyeSBwb2ludCBmb3IgdGhlIFVNRCBtb2R1bGUuXHJcbiAqIFRoZSBlbnRyeSBwb2ludCBmb3IgYSBmdXR1cmUgRVNNIHBhY2thZ2Ugc2hvdWxkIGJlIGluZGV4LnRzXHJcbiAqL1xyXG5jb25zdCBnbG9iYWxPYmplY3QgPSB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHVuZGVmaW5lZDtcclxuaWYgKHR5cGVvZiBnbG9iYWxPYmplY3QgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgIGZvciAoY29uc3Qgc2VyaWFsaXplciBpbiBTZXJpYWxpemVycykge1xyXG4gICAgICAgICg8YW55Pmdsb2JhbE9iamVjdCkuQkFCWUxPTltzZXJpYWxpemVyXSA9ICg8YW55PlNlcmlhbGl6ZXJzKVtzZXJpYWxpemVyXTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0ICogZnJvbSBcInNlcmlhbGl6ZXJzL3N0bC9pbmRleFwiO1xyXG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBpbXBvcnQvZXhwb3J0ICovXHJcbi8qIGVzbGludC1kaXNhYmxlIGltcG9ydC9uby1pbnRlcm5hbC1tb2R1bGVzICovXHJcbmltcG9ydCBcInNlcmlhbGl6ZXJzL2luZGV4XCI7XHJcbmV4cG9ydCAqIGZyb20gXCIuL2xlZ2FjeS1nbFRGMlNlcmlhbGl6ZXJcIjtcclxuZXhwb3J0ICogZnJvbSBcIi4vbGVnYWN5LW9ialNlcmlhbGl6ZXJcIjtcclxuZXhwb3J0ICogZnJvbSBcIi4vbGVnYWN5LXN0bFNlcmlhbGl6ZXJcIjtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX2JhYnlsb25qc19NYXRoc19tYXRoX3ZlY3Rvcl9fOyIsIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxuXG5QZXJtaXNzaW9uIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBhbmQvb3IgZGlzdHJpYnV0ZSB0aGlzIHNvZnR3YXJlIGZvciBhbnlcbnB1cnBvc2Ugd2l0aCBvciB3aXRob3V0IGZlZSBpcyBoZXJlYnkgZ3JhbnRlZC5cblxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiBBTkQgVEhFIEFVVEhPUiBESVNDTEFJTVMgQUxMIFdBUlJBTlRJRVMgV0lUSFxuUkVHQVJEIFRPIFRISVMgU09GVFdBUkUgSU5DTFVESU5HIEFMTCBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZXG5BTkQgRklUTkVTUy4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUiBCRSBMSUFCTEUgRk9SIEFOWSBTUEVDSUFMLCBESVJFQ1QsXG5JTkRJUkVDVCwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTIE9SIEFOWSBEQU1BR0VTIFdIQVRTT0VWRVIgUkVTVUxUSU5HIEZST01cbkxPU1MgT0YgVVNFLCBEQVRBIE9SIFBST0ZJVFMsIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBORUdMSUdFTkNFIE9SXG5PVEhFUiBUT1JUSU9VUyBBQ1RJT04sIEFSSVNJTkcgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgVVNFIE9SXG5QRVJGT1JNQU5DRSBPRiBUSElTIFNPRlRXQVJFLlxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8qIGdsb2JhbCBSZWZsZWN0LCBQcm9taXNlLCBTdXBwcmVzc2VkRXJyb3IsIFN5bWJvbCwgSXRlcmF0b3IgKi9cblxudmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbihkLCBiKSB7XG4gIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcbiAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcbiAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChiLCBwKSkgZFtwXSA9IGJbcF07IH07XG4gIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIF9fZXh0ZW5kcyhkLCBiKSB7XG4gIGlmICh0eXBlb2YgYiAhPT0gXCJmdW5jdGlvblwiICYmIGIgIT09IG51bGwpXG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2xhc3MgZXh0ZW5kcyB2YWx1ZSBcIiArIFN0cmluZyhiKSArIFwiIGlzIG5vdCBhIGNvbnN0cnVjdG9yIG9yIG51bGxcIik7XG4gIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG59XG5cbmV4cG9ydCB2YXIgX19hc3NpZ24gPSBmdW5jdGlvbigpIHtcbiAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uIF9fYXNzaWduKHQpIHtcbiAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XG4gICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKSB0W3BdID0gc1twXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0O1xuICB9XG4gIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gX19yZXN0KHMsIGUpIHtcbiAgdmFyIHQgPSB7fTtcbiAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApICYmIGUuaW5kZXhPZihwKSA8IDApXG4gICAgICB0W3BdID0gc1twXTtcbiAgaWYgKHMgIT0gbnVsbCAmJiB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gXCJmdW5jdGlvblwiKVxuICAgICAgZm9yICh2YXIgaSA9IDAsIHAgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHMpOyBpIDwgcC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmIChlLmluZGV4T2YocFtpXSkgPCAwICYmIE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChzLCBwW2ldKSlcbiAgICAgICAgICAgICAgdFtwW2ldXSA9IHNbcFtpXV07XG4gICAgICB9XG4gIHJldHVybiB0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gX19kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xuICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLCBkO1xuICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xuICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xuICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gX19wYXJhbShwYXJhbUluZGV4LCBkZWNvcmF0b3IpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIGtleSkgeyBkZWNvcmF0b3IodGFyZ2V0LCBrZXksIHBhcmFtSW5kZXgpOyB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfX2VzRGVjb3JhdGUoY3RvciwgZGVzY3JpcHRvckluLCBkZWNvcmF0b3JzLCBjb250ZXh0SW4sIGluaXRpYWxpemVycywgZXh0cmFJbml0aWFsaXplcnMpIHtcbiAgZnVuY3Rpb24gYWNjZXB0KGYpIHsgaWYgKGYgIT09IHZvaWQgMCAmJiB0eXBlb2YgZiAhPT0gXCJmdW5jdGlvblwiKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiRnVuY3Rpb24gZXhwZWN0ZWRcIik7IHJldHVybiBmOyB9XG4gIHZhciBraW5kID0gY29udGV4dEluLmtpbmQsIGtleSA9IGtpbmQgPT09IFwiZ2V0dGVyXCIgPyBcImdldFwiIDoga2luZCA9PT0gXCJzZXR0ZXJcIiA/IFwic2V0XCIgOiBcInZhbHVlXCI7XG4gIHZhciB0YXJnZXQgPSAhZGVzY3JpcHRvckluICYmIGN0b3IgPyBjb250ZXh0SW5bXCJzdGF0aWNcIl0gPyBjdG9yIDogY3Rvci5wcm90b3R5cGUgOiBudWxsO1xuICB2YXIgZGVzY3JpcHRvciA9IGRlc2NyaXB0b3JJbiB8fCAodGFyZ2V0ID8gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGNvbnRleHRJbi5uYW1lKSA6IHt9KTtcbiAgdmFyIF8sIGRvbmUgPSBmYWxzZTtcbiAgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIHZhciBjb250ZXh0ID0ge307XG4gICAgICBmb3IgKHZhciBwIGluIGNvbnRleHRJbikgY29udGV4dFtwXSA9IHAgPT09IFwiYWNjZXNzXCIgPyB7fSA6IGNvbnRleHRJbltwXTtcbiAgICAgIGZvciAodmFyIHAgaW4gY29udGV4dEluLmFjY2VzcykgY29udGV4dC5hY2Nlc3NbcF0gPSBjb250ZXh0SW4uYWNjZXNzW3BdO1xuICAgICAgY29udGV4dC5hZGRJbml0aWFsaXplciA9IGZ1bmN0aW9uIChmKSB7IGlmIChkb25lKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGFkZCBpbml0aWFsaXplcnMgYWZ0ZXIgZGVjb3JhdGlvbiBoYXMgY29tcGxldGVkXCIpOyBleHRyYUluaXRpYWxpemVycy5wdXNoKGFjY2VwdChmIHx8IG51bGwpKTsgfTtcbiAgICAgIHZhciByZXN1bHQgPSAoMCwgZGVjb3JhdG9yc1tpXSkoa2luZCA9PT0gXCJhY2Nlc3NvclwiID8geyBnZXQ6IGRlc2NyaXB0b3IuZ2V0LCBzZXQ6IGRlc2NyaXB0b3Iuc2V0IH0gOiBkZXNjcmlwdG9yW2tleV0sIGNvbnRleHQpO1xuICAgICAgaWYgKGtpbmQgPT09IFwiYWNjZXNzb3JcIikge1xuICAgICAgICAgIGlmIChyZXN1bHQgPT09IHZvaWQgMCkgY29udGludWU7XG4gICAgICAgICAgaWYgKHJlc3VsdCA9PT0gbnVsbCB8fCB0eXBlb2YgcmVzdWx0ICE9PSBcIm9iamVjdFwiKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiT2JqZWN0IGV4cGVjdGVkXCIpO1xuICAgICAgICAgIGlmIChfID0gYWNjZXB0KHJlc3VsdC5nZXQpKSBkZXNjcmlwdG9yLmdldCA9IF87XG4gICAgICAgICAgaWYgKF8gPSBhY2NlcHQocmVzdWx0LnNldCkpIGRlc2NyaXB0b3Iuc2V0ID0gXztcbiAgICAgICAgICBpZiAoXyA9IGFjY2VwdChyZXN1bHQuaW5pdCkpIGluaXRpYWxpemVycy51bnNoaWZ0KF8pO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAoXyA9IGFjY2VwdChyZXN1bHQpKSB7XG4gICAgICAgICAgaWYgKGtpbmQgPT09IFwiZmllbGRcIikgaW5pdGlhbGl6ZXJzLnVuc2hpZnQoXyk7XG4gICAgICAgICAgZWxzZSBkZXNjcmlwdG9yW2tleV0gPSBfO1xuICAgICAgfVxuICB9XG4gIGlmICh0YXJnZXQpIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGNvbnRleHRJbi5uYW1lLCBkZXNjcmlwdG9yKTtcbiAgZG9uZSA9IHRydWU7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gX19ydW5Jbml0aWFsaXplcnModGhpc0FyZywgaW5pdGlhbGl6ZXJzLCB2YWx1ZSkge1xuICB2YXIgdXNlVmFsdWUgPSBhcmd1bWVudHMubGVuZ3RoID4gMjtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBpbml0aWFsaXplcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhbHVlID0gdXNlVmFsdWUgPyBpbml0aWFsaXplcnNbaV0uY2FsbCh0aGlzQXJnLCB2YWx1ZSkgOiBpbml0aWFsaXplcnNbaV0uY2FsbCh0aGlzQXJnKTtcbiAgfVxuICByZXR1cm4gdXNlVmFsdWUgPyB2YWx1ZSA6IHZvaWQgMDtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBfX3Byb3BLZXkoeCkge1xuICByZXR1cm4gdHlwZW9mIHggPT09IFwic3ltYm9sXCIgPyB4IDogXCJcIi5jb25jYXQoeCk7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gX19zZXRGdW5jdGlvbk5hbWUoZiwgbmFtZSwgcHJlZml4KSB7XG4gIGlmICh0eXBlb2YgbmFtZSA9PT0gXCJzeW1ib2xcIikgbmFtZSA9IG5hbWUuZGVzY3JpcHRpb24gPyBcIltcIi5jb25jYXQobmFtZS5kZXNjcmlwdGlvbiwgXCJdXCIpIDogXCJcIjtcbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShmLCBcIm5hbWVcIiwgeyBjb25maWd1cmFibGU6IHRydWUsIHZhbHVlOiBwcmVmaXggPyBcIlwiLmNvbmNhdChwcmVmaXgsIFwiIFwiLCBuYW1lKSA6IG5hbWUgfSk7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gX19tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSkge1xuICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdGVyKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gX19nZW5lcmF0b3IodGhpc0FyZywgYm9keSkge1xuICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnID0gT2JqZWN0LmNyZWF0ZSgodHlwZW9mIEl0ZXJhdG9yID09PSBcImZ1bmN0aW9uXCIgPyBJdGVyYXRvciA6IE9iamVjdCkucHJvdG90eXBlKTtcbiAgcmV0dXJuIGcubmV4dCA9IHZlcmIoMCksIGdbXCJ0aHJvd1wiXSA9IHZlcmIoMSksIGdbXCJyZXR1cm5cIl0gPSB2ZXJiKDIpLCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XG4gIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxuICBmdW5jdGlvbiBzdGVwKG9wKSB7XG4gICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XG4gICAgICB3aGlsZSAoZyAmJiAoZyA9IDAsIG9wWzBdICYmIChfID0gMCkpLCBfKSB0cnkge1xuICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcbiAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XG4gICAgICAgICAgc3dpdGNoIChvcFswXSkge1xuICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcbiAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcbiAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xuICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cbiAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcbiAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xuICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxuICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XG4gIH1cbn1cblxuZXhwb3J0IHZhciBfX2NyZWF0ZUJpbmRpbmcgPSBPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XG4gIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XG4gIHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihtLCBrKTtcbiAgaWYgKCFkZXNjIHx8IChcImdldFwiIGluIGRlc2MgPyAhbS5fX2VzTW9kdWxlIDogZGVzYy53cml0YWJsZSB8fCBkZXNjLmNvbmZpZ3VyYWJsZSkpIHtcbiAgICAgIGRlc2MgPSB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH07XG4gIH1cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIGsyLCBkZXNjKTtcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XG4gIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XG4gIG9bazJdID0gbVtrXTtcbn0pO1xuXG5leHBvcnQgZnVuY3Rpb24gX19leHBvcnRTdGFyKG0sIG8pIHtcbiAgZm9yICh2YXIgcCBpbiBtKSBpZiAocCAhPT0gXCJkZWZhdWx0XCIgJiYgIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvLCBwKSkgX19jcmVhdGVCaW5kaW5nKG8sIG0sIHApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gX192YWx1ZXMobykge1xuICB2YXIgcyA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBTeW1ib2wuaXRlcmF0b3IsIG0gPSBzICYmIG9bc10sIGkgPSAwO1xuICBpZiAobSkgcmV0dXJuIG0uY2FsbChvKTtcbiAgaWYgKG8gJiYgdHlwZW9mIG8ubGVuZ3RoID09PSBcIm51bWJlclwiKSByZXR1cm4ge1xuICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmIChvICYmIGkgPj0gby5sZW5ndGgpIG8gPSB2b2lkIDA7XG4gICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IG8gJiYgb1tpKytdLCBkb25lOiAhbyB9O1xuICAgICAgfVxuICB9O1xuICB0aHJvdyBuZXcgVHlwZUVycm9yKHMgPyBcIk9iamVjdCBpcyBub3QgaXRlcmFibGUuXCIgOiBcIlN5bWJvbC5pdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfX3JlYWQobywgbikge1xuICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl07XG4gIGlmICghbSkgcmV0dXJuIG87XG4gIHZhciBpID0gbS5jYWxsKG8pLCByLCBhciA9IFtdLCBlO1xuICB0cnkge1xuICAgICAgd2hpbGUgKChuID09PSB2b2lkIDAgfHwgbi0tID4gMCkgJiYgIShyID0gaS5uZXh0KCkpLmRvbmUpIGFyLnB1c2goci52YWx1ZSk7XG4gIH1cbiAgY2F0Y2ggKGVycm9yKSB7IGUgPSB7IGVycm9yOiBlcnJvciB9OyB9XG4gIGZpbmFsbHkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgICBpZiAociAmJiAhci5kb25lICYmIChtID0gaVtcInJldHVyblwiXSkpIG0uY2FsbChpKTtcbiAgICAgIH1cbiAgICAgIGZpbmFsbHkgeyBpZiAoZSkgdGhyb3cgZS5lcnJvcjsgfVxuICB9XG4gIHJldHVybiBhcjtcbn1cblxuLyoqIEBkZXByZWNhdGVkICovXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWQoKSB7XG4gIGZvciAodmFyIGFyID0gW10sIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKVxuICAgICAgYXIgPSBhci5jb25jYXQoX19yZWFkKGFyZ3VtZW50c1tpXSkpO1xuICByZXR1cm4gYXI7XG59XG5cbi8qKiBAZGVwcmVjYXRlZCAqL1xuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkQXJyYXlzKCkge1xuICBmb3IgKHZhciBzID0gMCwgaSA9IDAsIGlsID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHMgKz0gYXJndW1lbnRzW2ldLmxlbmd0aDtcbiAgZm9yICh2YXIgciA9IEFycmF5KHMpLCBrID0gMCwgaSA9IDA7IGkgPCBpbDsgaSsrKVxuICAgICAgZm9yICh2YXIgYSA9IGFyZ3VtZW50c1tpXSwgaiA9IDAsIGpsID0gYS5sZW5ndGg7IGogPCBqbDsgaisrLCBrKyspXG4gICAgICAgICAgcltrXSA9IGFbal07XG4gIHJldHVybiByO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWRBcnJheSh0bywgZnJvbSwgcGFjaykge1xuICBpZiAocGFjayB8fCBhcmd1bWVudHMubGVuZ3RoID09PSAyKSBmb3IgKHZhciBpID0gMCwgbCA9IGZyb20ubGVuZ3RoLCBhcjsgaSA8IGw7IGkrKykge1xuICAgICAgaWYgKGFyIHx8ICEoaSBpbiBmcm9tKSkge1xuICAgICAgICAgIGlmICghYXIpIGFyID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSwgMCwgaSk7XG4gICAgICAgICAgYXJbaV0gPSBmcm9tW2ldO1xuICAgICAgfVxuICB9XG4gIHJldHVybiB0by5jb25jYXQoYXIgfHwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdCh2KSB7XG4gIHJldHVybiB0aGlzIGluc3RhbmNlb2YgX19hd2FpdCA/ICh0aGlzLnYgPSB2LCB0aGlzKSA6IG5ldyBfX2F3YWl0KHYpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0dlbmVyYXRvcih0aGlzQXJnLCBfYXJndW1lbnRzLCBnZW5lcmF0b3IpIHtcbiAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcbiAgdmFyIGcgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSksIGksIHEgPSBbXTtcbiAgcmV0dXJuIGkgPSBPYmplY3QuY3JlYXRlKCh0eXBlb2YgQXN5bmNJdGVyYXRvciA9PT0gXCJmdW5jdGlvblwiID8gQXN5bmNJdGVyYXRvciA6IE9iamVjdCkucHJvdG90eXBlKSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiLCBhd2FpdFJldHVybiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcbiAgZnVuY3Rpb24gYXdhaXRSZXR1cm4oZikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh2KS50aGVuKGYsIHJlamVjdCk7IH07IH1cbiAgZnVuY3Rpb24gdmVyYihuLCBmKSB7IGlmIChnW25dKSB7IGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKGEsIGIpIHsgcS5wdXNoKFtuLCB2LCBhLCBiXSkgPiAxIHx8IHJlc3VtZShuLCB2KTsgfSk7IH07IGlmIChmKSBpW25dID0gZihpW25dKTsgfSB9XG4gIGZ1bmN0aW9uIHJlc3VtZShuLCB2KSB7IHRyeSB7IHN0ZXAoZ1tuXSh2KSk7IH0gY2F0Y2ggKGUpIHsgc2V0dGxlKHFbMF1bM10sIGUpOyB9IH1cbiAgZnVuY3Rpb24gc3RlcChyKSB7IHIudmFsdWUgaW5zdGFuY2VvZiBfX2F3YWl0ID8gUHJvbWlzZS5yZXNvbHZlKHIudmFsdWUudikudGhlbihmdWxmaWxsLCByZWplY3QpIDogc2V0dGxlKHFbMF1bMl0sIHIpOyB9XG4gIGZ1bmN0aW9uIGZ1bGZpbGwodmFsdWUpIHsgcmVzdW1lKFwibmV4dFwiLCB2YWx1ZSk7IH1cbiAgZnVuY3Rpb24gcmVqZWN0KHZhbHVlKSB7IHJlc3VtZShcInRocm93XCIsIHZhbHVlKTsgfVxuICBmdW5jdGlvbiBzZXR0bGUoZiwgdikgeyBpZiAoZih2KSwgcS5zaGlmdCgpLCBxLmxlbmd0aCkgcmVzdW1lKHFbMF1bMF0sIHFbMF1bMV0pOyB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jRGVsZWdhdG9yKG8pIHtcbiAgdmFyIGksIHA7XG4gIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiwgZnVuY3Rpb24gKGUpIHsgdGhyb3cgZTsgfSksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XG4gIGZ1bmN0aW9uIHZlcmIobiwgZikgeyBpW25dID0gb1tuXSA/IGZ1bmN0aW9uICh2KSB7IHJldHVybiAocCA9ICFwKSA/IHsgdmFsdWU6IF9fYXdhaXQob1tuXSh2KSksIGRvbmU6IGZhbHNlIH0gOiBmID8gZih2KSA6IHY7IH0gOiBmOyB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jVmFsdWVzKG8pIHtcbiAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcbiAgdmFyIG0gPSBvW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSwgaTtcbiAgcmV0dXJuIG0gPyBtLmNhbGwobykgOiAobyA9IHR5cGVvZiBfX3ZhbHVlcyA9PT0gXCJmdW5jdGlvblwiID8gX192YWx1ZXMobykgOiBvW1N5bWJvbC5pdGVyYXRvcl0oKSwgaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGkpO1xuICBmdW5jdGlvbiB2ZXJiKG4pIHsgaVtuXSA9IG9bbl0gJiYgZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHsgdiA9IG9bbl0odiksIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHYuZG9uZSwgdi52YWx1ZSk7IH0pOyB9OyB9XG4gIGZ1bmN0aW9uIHNldHRsZShyZXNvbHZlLCByZWplY3QsIGQsIHYpIHsgUHJvbWlzZS5yZXNvbHZlKHYpLnRoZW4oZnVuY3Rpb24odikgeyByZXNvbHZlKHsgdmFsdWU6IHYsIGRvbmU6IGQgfSk7IH0sIHJlamVjdCk7IH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9fbWFrZVRlbXBsYXRlT2JqZWN0KGNvb2tlZCwgcmF3KSB7XG4gIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgXCJyYXdcIiwgeyB2YWx1ZTogcmF3IH0pOyB9IGVsc2UgeyBjb29rZWQucmF3ID0gcmF3OyB9XG4gIHJldHVybiBjb29rZWQ7XG59O1xuXG52YXIgX19zZXRNb2R1bGVEZWZhdWx0ID0gT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCB2KSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBcImRlZmF1bHRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdiB9KTtcbn0pIDogZnVuY3Rpb24obywgdikge1xuICBvW1wiZGVmYXVsdFwiXSA9IHY7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnRTdGFyKG1vZCkge1xuICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xuICB2YXIgcmVzdWx0ID0ge307XG4gIGlmIChtb2QgIT0gbnVsbCkgZm9yICh2YXIgayBpbiBtb2QpIGlmIChrICE9PSBcImRlZmF1bHRcIiAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9kLCBrKSkgX19jcmVhdGVCaW5kaW5nKHJlc3VsdCwgbW9kLCBrKTtcbiAgX19zZXRNb2R1bGVEZWZhdWx0KHJlc3VsdCwgbW9kKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0RGVmYXVsdChtb2QpIHtcbiAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBkZWZhdWx0OiBtb2QgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9fY2xhc3NQcml2YXRlRmllbGRHZXQocmVjZWl2ZXIsIHN0YXRlLCBraW5kLCBmKSB7XG4gIGlmIChraW5kID09PSBcImFcIiAmJiAhZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlByaXZhdGUgYWNjZXNzb3Igd2FzIGRlZmluZWQgd2l0aG91dCBhIGdldHRlclwiKTtcbiAgaWYgKHR5cGVvZiBzdGF0ZSA9PT0gXCJmdW5jdGlvblwiID8gcmVjZWl2ZXIgIT09IHN0YXRlIHx8ICFmIDogIXN0YXRlLmhhcyhyZWNlaXZlcikpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgcmVhZCBwcml2YXRlIG1lbWJlciBmcm9tIGFuIG9iamVjdCB3aG9zZSBjbGFzcyBkaWQgbm90IGRlY2xhcmUgaXRcIik7XG4gIHJldHVybiBraW5kID09PSBcIm1cIiA/IGYgOiBraW5kID09PSBcImFcIiA/IGYuY2FsbChyZWNlaXZlcikgOiBmID8gZi52YWx1ZSA6IHN0YXRlLmdldChyZWNlaXZlcik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfX2NsYXNzUHJpdmF0ZUZpZWxkU2V0KHJlY2VpdmVyLCBzdGF0ZSwgdmFsdWUsIGtpbmQsIGYpIHtcbiAgaWYgKGtpbmQgPT09IFwibVwiKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJpdmF0ZSBtZXRob2QgaXMgbm90IHdyaXRhYmxlXCIpO1xuICBpZiAoa2luZCA9PT0gXCJhXCIgJiYgIWYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJQcml2YXRlIGFjY2Vzc29yIHdhcyBkZWZpbmVkIHdpdGhvdXQgYSBzZXR0ZXJcIik7XG4gIGlmICh0eXBlb2Ygc3RhdGUgPT09IFwiZnVuY3Rpb25cIiA/IHJlY2VpdmVyICE9PSBzdGF0ZSB8fCAhZiA6ICFzdGF0ZS5oYXMocmVjZWl2ZXIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IHdyaXRlIHByaXZhdGUgbWVtYmVyIHRvIGFuIG9iamVjdCB3aG9zZSBjbGFzcyBkaWQgbm90IGRlY2xhcmUgaXRcIik7XG4gIHJldHVybiAoa2luZCA9PT0gXCJhXCIgPyBmLmNhbGwocmVjZWl2ZXIsIHZhbHVlKSA6IGYgPyBmLnZhbHVlID0gdmFsdWUgOiBzdGF0ZS5zZXQocmVjZWl2ZXIsIHZhbHVlKSksIHZhbHVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZEluKHN0YXRlLCByZWNlaXZlcikge1xuICBpZiAocmVjZWl2ZXIgPT09IG51bGwgfHwgKHR5cGVvZiByZWNlaXZlciAhPT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgcmVjZWl2ZXIgIT09IFwiZnVuY3Rpb25cIikpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgdXNlICdpbicgb3BlcmF0b3Igb24gbm9uLW9iamVjdFwiKTtcbiAgcmV0dXJuIHR5cGVvZiBzdGF0ZSA9PT0gXCJmdW5jdGlvblwiID8gcmVjZWl2ZXIgPT09IHN0YXRlIDogc3RhdGUuaGFzKHJlY2VpdmVyKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9fYWRkRGlzcG9zYWJsZVJlc291cmNlKGVudiwgdmFsdWUsIGFzeW5jKSB7XG4gIGlmICh2YWx1ZSAhPT0gbnVsbCAmJiB2YWx1ZSAhPT0gdm9pZCAwKSB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgdmFsdWUgIT09IFwiZnVuY3Rpb25cIikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIk9iamVjdCBleHBlY3RlZC5cIik7XG4gICAgdmFyIGRpc3Bvc2UsIGlubmVyO1xuICAgIGlmIChhc3luYykge1xuICAgICAgaWYgKCFTeW1ib2wuYXN5bmNEaXNwb3NlKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jRGlzcG9zZSBpcyBub3QgZGVmaW5lZC5cIik7XG4gICAgICBkaXNwb3NlID0gdmFsdWVbU3ltYm9sLmFzeW5jRGlzcG9zZV07XG4gICAgfVxuICAgIGlmIChkaXNwb3NlID09PSB2b2lkIDApIHtcbiAgICAgIGlmICghU3ltYm9sLmRpc3Bvc2UpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuZGlzcG9zZSBpcyBub3QgZGVmaW5lZC5cIik7XG4gICAgICBkaXNwb3NlID0gdmFsdWVbU3ltYm9sLmRpc3Bvc2VdO1xuICAgICAgaWYgKGFzeW5jKSBpbm5lciA9IGRpc3Bvc2U7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgZGlzcG9zZSAhPT0gXCJmdW5jdGlvblwiKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiT2JqZWN0IG5vdCBkaXNwb3NhYmxlLlwiKTtcbiAgICBpZiAoaW5uZXIpIGRpc3Bvc2UgPSBmdW5jdGlvbigpIHsgdHJ5IHsgaW5uZXIuY2FsbCh0aGlzKTsgfSBjYXRjaCAoZSkgeyByZXR1cm4gUHJvbWlzZS5yZWplY3QoZSk7IH0gfTtcbiAgICBlbnYuc3RhY2sucHVzaCh7IHZhbHVlOiB2YWx1ZSwgZGlzcG9zZTogZGlzcG9zZSwgYXN5bmM6IGFzeW5jIH0pO1xuICB9XG4gIGVsc2UgaWYgKGFzeW5jKSB7XG4gICAgZW52LnN0YWNrLnB1c2goeyBhc3luYzogdHJ1ZSB9KTtcbiAgfVxuICByZXR1cm4gdmFsdWU7XG59XG5cbnZhciBfU3VwcHJlc3NlZEVycm9yID0gdHlwZW9mIFN1cHByZXNzZWRFcnJvciA9PT0gXCJmdW5jdGlvblwiID8gU3VwcHJlc3NlZEVycm9yIDogZnVuY3Rpb24gKGVycm9yLCBzdXBwcmVzc2VkLCBtZXNzYWdlKSB7XG4gIHZhciBlID0gbmV3IEVycm9yKG1lc3NhZ2UpO1xuICByZXR1cm4gZS5uYW1lID0gXCJTdXBwcmVzc2VkRXJyb3JcIiwgZS5lcnJvciA9IGVycm9yLCBlLnN1cHByZXNzZWQgPSBzdXBwcmVzc2VkLCBlO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIF9fZGlzcG9zZVJlc291cmNlcyhlbnYpIHtcbiAgZnVuY3Rpb24gZmFpbChlKSB7XG4gICAgZW52LmVycm9yID0gZW52Lmhhc0Vycm9yID8gbmV3IF9TdXBwcmVzc2VkRXJyb3IoZSwgZW52LmVycm9yLCBcIkFuIGVycm9yIHdhcyBzdXBwcmVzc2VkIGR1cmluZyBkaXNwb3NhbC5cIikgOiBlO1xuICAgIGVudi5oYXNFcnJvciA9IHRydWU7XG4gIH1cbiAgdmFyIHIsIHMgPSAwO1xuICBmdW5jdGlvbiBuZXh0KCkge1xuICAgIHdoaWxlIChyID0gZW52LnN0YWNrLnBvcCgpKSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoIXIuYXN5bmMgJiYgcyA9PT0gMSkgcmV0dXJuIHMgPSAwLCBlbnYuc3RhY2sucHVzaChyKSwgUHJvbWlzZS5yZXNvbHZlKCkudGhlbihuZXh0KTtcbiAgICAgICAgaWYgKHIuZGlzcG9zZSkge1xuICAgICAgICAgIHZhciByZXN1bHQgPSByLmRpc3Bvc2UuY2FsbChyLnZhbHVlKTtcbiAgICAgICAgICBpZiAoci5hc3luYykgcmV0dXJuIHMgfD0gMiwgUHJvbWlzZS5yZXNvbHZlKHJlc3VsdCkudGhlbihuZXh0LCBmdW5jdGlvbihlKSB7IGZhaWwoZSk7IHJldHVybiBuZXh0KCk7IH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgcyB8PSAxO1xuICAgICAgfVxuICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgZmFpbChlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHMgPT09IDEpIHJldHVybiBlbnYuaGFzRXJyb3IgPyBQcm9taXNlLnJlamVjdChlbnYuZXJyb3IpIDogUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgaWYgKGVudi5oYXNFcnJvcikgdGhyb3cgZW52LmVycm9yO1xuICB9XG4gIHJldHVybiBuZXh0KCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgX19leHRlbmRzLFxuICBfX2Fzc2lnbixcbiAgX19yZXN0LFxuICBfX2RlY29yYXRlLFxuICBfX3BhcmFtLFxuICBfX21ldGFkYXRhLFxuICBfX2F3YWl0ZXIsXG4gIF9fZ2VuZXJhdG9yLFxuICBfX2NyZWF0ZUJpbmRpbmcsXG4gIF9fZXhwb3J0U3RhcixcbiAgX192YWx1ZXMsXG4gIF9fcmVhZCxcbiAgX19zcHJlYWQsXG4gIF9fc3ByZWFkQXJyYXlzLFxuICBfX3NwcmVhZEFycmF5LFxuICBfX2F3YWl0LFxuICBfX2FzeW5jR2VuZXJhdG9yLFxuICBfX2FzeW5jRGVsZWdhdG9yLFxuICBfX2FzeW5jVmFsdWVzLFxuICBfX21ha2VUZW1wbGF0ZU9iamVjdCxcbiAgX19pbXBvcnRTdGFyLFxuICBfX2ltcG9ydERlZmF1bHQsXG4gIF9fY2xhc3NQcml2YXRlRmllbGRHZXQsXG4gIF9fY2xhc3NQcml2YXRlRmllbGRTZXQsXG4gIF9fY2xhc3NQcml2YXRlRmllbGRJbixcbiAgX19hZGREaXNwb3NhYmxlUmVzb3VyY2UsXG4gIF9fZGlzcG9zZVJlc291cmNlcyxcbn07XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmcgPSAoZnVuY3Rpb24oKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gJ29iamVjdCcpIHJldHVybiBnbG9iYWxUaGlzO1xuXHR0cnkge1xuXHRcdHJldHVybiB0aGlzIHx8IG5ldyBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSByZXR1cm4gd2luZG93O1xuXHR9XG59KSgpOyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgKiBhcyBzZXJpYWxpemVycyBmcm9tIFwiQGx0cy9zZXJpYWxpemVycy9sZWdhY3kvbGVnYWN5XCI7XHJcbmV4cG9ydCB7IHNlcmlhbGl6ZXJzIH07XHJcbmV4cG9ydCBkZWZhdWx0IHNlcmlhbGl6ZXJzO1xyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=