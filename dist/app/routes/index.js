"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_route_1 = require("../modules/user/user.route");
const auth_route_1 = require("../modules/auth/auth.route");
const admin_router_1 = require("../modules/Admin/admin.router");
const parcel_router_1 = require("../modules/parcel/parcel.router");
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    { path: "/users", route: user_route_1.UserRoutes },
    { path: "/parcels", route: parcel_router_1.parcelRouter },
    { path: "/auth", route: auth_route_1.AuthRouter },
    { path: "/admin", route: admin_router_1.adminRouter },
];
moduleRoutes.forEach((route) => {
    exports.router.use(route.path, route.route);
});
