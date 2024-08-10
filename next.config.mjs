/** @type {import('next').NextConfig} */
// const fs = require('fs');
import * as fs from "fs"
import * as dotenv from "dotenv";

// const dotenv = require('dotenv');
const env = dotenv.parse(fs.readFileSync('.env'));

const nextConfig = {
    reactStrictMode: true,
    env: env
  }
export default nextConfig;
