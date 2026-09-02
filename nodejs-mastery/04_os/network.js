/**
 * ============================================================
 * Node.js OS Module - Network Interfaces
 * ============================================================
 *
 * File: network.js
 *
 * Built-in module:
 *
 *     node:os
 *
 * ============================================================
 *
 * Topics:
 *
 *     os.networkInterfaces()
 *     Network adapters
 *     IPv4
 *     IPv6
 *     MAC address
 *     Internal interfaces
 *     External interfaces
 *     CIDR
 *     Filtering interfaces
 *     Getting local IP addresses
 *
 * ============================================================
 */

/*
 * ============================================================
 * 1. Import node:os
 * ============================================================
 */

const os = require("node:os");

/*
 * ============================================================
 * 2. Get network interfaces
 * ============================================================
 *
 * `os.networkInterfaces()` returns information about the
 * network interfaces available on the machine.
 *
 * Example conceptually:
 *
 *
 * {
 *
 *   Ethernet: [
 *     {
 *       address: "192.168.1.10",
 *       netmask: "255.255.255.0",
 *       family: "IPv4",
 *       mac: "AA:BB:CC:DD:EE:FF",
 *       internal: false,
 *       cidr: "192.168.1.10/24"
 *     }
 *   ]
 *
 * }
 *
 * ============================================================
 */

const interfaces = os.networkInterfaces();

console.log("Network Interfaces:");

console.log(interfaces);

/*
 * ============================================================
 * 3. Network interface names
 * ============================================================
 *
 * The returned object contains interface names as keys.
 *
 * Examples:
 *
 *     Ethernet
 *     Wi-Fi
 *     eth0
 *     wlan0
 *     lo
 *
 * Names depend on the operating system.
 *
 * ============================================================
 */

console.log("\nInterface Names:");

console.log(Object.keys(interfaces));

/*
 * ============================================================
 * 4. Loop through interfaces
 * ============================================================
 */

for (const [name, addresses] of Object.entries(interfaces)) {
  console.log(`\nInterface: ${name}`);

  console.log("Addresses:", addresses);
}

/*
 * ============================================================
 * 5. Understanding an interface
 * ============================================================
 *
 * Each interface can contain one or more addresses.
 *
 *
 * Example:
 *
 *
 *     Ethernet
 *        │
 *        ├── IPv4
 *        └── IPv6
 *
 *
 * Therefore an interface usually contains an ARRAY of
 * address objects.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 6. Print every address
 * ============================================================
 */

for (const [name, addresses] of Object.entries(interfaces)) {
  if (!addresses) {
    continue;
  }

  for (const address of addresses) {
    console.log("\nInterface:", name);

    console.log("Address:", address.address);

    console.log("Family:", address.family);

    console.log("Netmask:", address.netmask);

    console.log("MAC:", address.mac);

    console.log("Internal:", address.internal);

    console.log("CIDR:", address.cidr);
  }
}

/*
 * ============================================================
 * 7. IPv4
 * ============================================================
 *
 * IPv4 addresses look like:
 *
 *
 *     192.168.1.10
 *
 *
 * They consist of four numeric sections.
 *
 *
 * Example:
 *
 *
 *     192.168.1.10
 *     └──┬──┘ └┬┘
 *       network host
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 8. IPv6
 * ============================================================
 *
 * IPv6 addresses look like:
 *
 *
 *     fe80::1234:abcd
 *
 *
 * IPv6 uses hexadecimal notation and supports a much larger
 * address space than IPv4.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 9. Check IPv4 addresses
 * ============================================================
 */

console.log("\nIPv4 Addresses:");

for (const [name, addresses] of Object.entries(interfaces)) {
  if (!addresses) {
    continue;
  }

  for (const address of addresses) {
    if (address.family === "IPv4") {
      console.log(`${name}: ${address.address}`);
    }
  }
}

/*
 * ============================================================
 * 10. Check IPv6 addresses
 * ============================================================
 */

console.log("\nIPv6 Addresses:");

for (const [name, addresses] of Object.entries(interfaces)) {
  if (!addresses) {
    continue;
  }

  for (const address of addresses) {
    if (address.family === "IPv6") {
      console.log(`${name}: ${address.address}`);
    }
  }
}

/*
 * ============================================================
 * 11. Internal interface
 * ============================================================
 *
 * The `internal` property tells us whether the address belongs
 * to an internal/loopback interface.
 *
 *
 * Common loopback address:
 *
 *
 *     127.0.0.1
 *
 *
 * This refers to the local machine.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. Find loopback addresses
 * ============================================================
 */

console.log("\nInternal Addresses:");

for (const [name, addresses] of Object.entries(interfaces)) {
  if (!addresses) {
    continue;
  }

  for (const address of addresses) {
    if (address.internal) {
      console.log(`${name}: ${address.address}`);
    }
  }
}

/*
 * ============================================================
 * 13. Find external/local network addresses
 * ============================================================
 *
 * Here "external" means non-internal according to the
 * interface metadata.
 *
 * It does NOT necessarily mean "public internet IP".
 *
 * For example:
 *
 *
 *     192.168.1.20
 *
 *
 * is normally a private LAN address, even though:
 *
 *
 *     internal === false
 *
 * ============================================================
 */

console.log("\nNon-Internal Addresses:");

for (const [name, addresses] of Object.entries(interfaces)) {
  if (!addresses) {
    continue;
  }

  for (const address of addresses) {
    if (!address.internal) {
      console.log(`${name}: ${address.address}`);
    }
  }
}

/*
 * ============================================================
 * 14. Get local IPv4 addresses
 * ============================================================
 */

function getLocalIPv4Addresses() {
  const result = [];

  for (const [name, addresses] of Object.entries(interfaces)) {
    if (!addresses) {
      continue;
    }

    for (const address of addresses) {
      if (address.family === "IPv4" && !address.internal) {
        result.push({
          interface: name,

          address: address.address,

          netmask: address.netmask,

          mac: address.mac,

          cidr: address.cidr,
        });
      }
    }
  }

  return result;
}

console.log("\nLocal IPv4 Addresses:");

console.log(getLocalIPv4Addresses());

/*
 * ============================================================
 * 15. Get the first local IPv4 address
 * ============================================================
 */

function getLocalIPv4Address() {
  const addresses = getLocalIPv4Addresses();

  return addresses[0]?.address ?? null;
}

console.log("First Local IPv4:", getLocalIPv4Address());

/*
 * ============================================================
 * 16. MAC address
 * ============================================================
 *
 * MAC means:
 *
 *
 *     Media Access Control
 *
 *
 * A network interface generally has a MAC address.
 *
 * Example:
 *
 *
 *     00:1A:2B:3C:4D:5E
 *
 *
 * Node.js exposes it through:
 *
 *
 *     address.mac
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. Print MAC addresses
 * ============================================================
 */

console.log("\nMAC Addresses:");

for (const [name, addresses] of Object.entries(interfaces)) {
  if (!addresses) {
    continue;
  }

  for (const address of addresses) {
    console.log(`${name}: ${address.mac}`);
  }
}

/*
 * ============================================================
 * 18. Netmask
 * ============================================================
 *
 * Example:
 *
 *
 *     255.255.255.0
 *
 *
 * A netmask helps determine which part of an IPv4 address
 * represents the network and which part represents hosts.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. CIDR
 * ============================================================
 *
 * CIDR means:
 *
 *
 *     Classless Inter-Domain Routing
 *
 *
 * Example:
 *
 *
 *     192.168.1.10/24
 *
 *
 * The `/24` represents the network prefix length.
 *
 * Node.js may provide this directly through:
 *
 *
 *     address.cidr
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. Find a specific interface
 * ============================================================
 *
 * Suppose you want to inspect:
 *
 *
 *     Ethernet
 *
 *
 * You can access:
 *
 *
 *     interfaces["Ethernet"]
 *
 *
 * But interface names differ between systems.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. Safe interface lookup
 * ============================================================
 */

function getInterface(name) {
  return interfaces[name] ?? [];
}

/*
 * Example:
 *
 *
 *     console.log(
 *       getInterface("Ethernet"),
 *     );
 *
 *
 * The exact interface name depends on your machine.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. Find all IPv4 interfaces
 * ============================================================
 */

function getIPv4Interfaces() {
  const result = [];

  for (const [name, addresses] of Object.entries(interfaces)) {
    if (!addresses) {
      continue;
    }

    for (const address of addresses) {
      if (address.family === "IPv4") {
        result.push({
          interface: name,

          address: address.address,

          internal: address.internal,

          cidr: address.cidr,
        });
      }
    }
  }

  return result;
}

console.log("\nAll IPv4 Interfaces:");

console.log(getIPv4Interfaces());

/*
 * ============================================================
 * 23. Find all non-internal IPv4 interfaces
 * ============================================================
 */

function getExternalIPv4Interfaces() {
  const result = [];

  for (const [name, addresses] of Object.entries(interfaces)) {
    if (!addresses) {
      continue;
    }

    for (const address of addresses) {
      if (address.family === "IPv4" && !address.internal) {
        result.push({
          interface: name,

          address: address.address,

          cidr: address.cidr,
        });
      }
    }
  }

  return result;
}

console.log("\nNon-Internal IPv4 Interfaces:");

console.log(getExternalIPv4Interfaces());

/*
 * ============================================================
 * 24. Private IP addresses
 * ============================================================
 *
 * Common private IPv4 ranges:
 *
 *
 *     10.0.0.0/8
 *
 *     172.16.0.0/12
 *
 *     192.168.0.0/16
 *
 *
 * Examples:
 *
 *
 *     10.0.0.5
 *     172.16.10.20
 *     192.168.1.100
 *
 *
 * These addresses are commonly used inside private networks.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. Important distinction
 * ============================================================
 *
 * `os.networkInterfaces()` gives you local network interface
 * information.
 *
 *
 * It does NOT tell you your public internet IP address.
 *
 *
 * For example:
 *
 *
 *     Laptop
 *       │
 *       │
 *       ▼
 *     Router
 *       │
 *       ▼
 *     Internet
 *
 *
 * Your laptop might have:
 *
 *
 *     192.168.1.20
 *
 *
 * while your router has a public IP.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. Network interface summary
 * ============================================================
 */

function getNetworkSummary() {
  const result = [];

  for (const [name, addresses] of Object.entries(interfaces)) {
    if (!addresses) {
      continue;
    }

    result.push({
      interface: name,

      addresses: addresses.map((address) => ({
        address: address.address,

        family: address.family,

        netmask: address.netmask,

        mac: address.mac,

        internal: address.internal,

        cidr: address.cidr,
      })),
    });
  }

  return result;
}

console.log("\nNetwork Summary:");

console.log(JSON.stringify(getNetworkSummary(), null, 2));

/*
 * ============================================================
 * 27. Why network information is useful
 * ============================================================
 *
 * Network interface information can be useful for:
 *
 *
 *     - Local development
 *     - Server configuration
 *     - Diagnostics
 *     - Network debugging
 *     - CLI tools
 *     - Service discovery
 *     - Selecting network interfaces
 *     - Server binding
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. Server binding
 * ============================================================
 *
 * Later, when working with HTTP servers, you may see:
 *
 *
 *     server.listen(
 *       3000,
 *       "127.0.0.1",
 *     );
 *
 *
 * This binds the server to the local machine only.
 *
 *
 * You may also see:
 *
 *
 *     server.listen(
 *       3000,
 *       "0.0.0.0",
 *     );
 *
 *
 * This generally means listening on available IPv4 interfaces.
 *
 *
 * Binding behavior depends on the environment and networking
 * configuration.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 29. Security consideration
 * ============================================================
 *
 * Be careful when exposing network information through an API.
 *
 * Avoid unnecessarily returning:
 *
 *
 *     - MAC addresses
 *     - Internal IP addresses
 *     - Hostnames
 *     - Network topology information
 *
 *
 * to untrusted clients.
 *
 * This information can reveal infrastructure details.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. Real-world health monitoring
 * ============================================================
 *
 * Internally, an application might collect:
 *
 *
 *     {
 *       "network": {
 *         "interfaces": 3,
 *         "ipv4": 2
 *       }
 *     }
 *
 *
 * Monitoring systems can use this information for diagnostics.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 31. Common mistake
 * ============================================================
 *
 * DON'T assume:
 *
 *
 *     interfaces["Ethernet"]
 *
 *
 * always exists.
 *
 *
 * Windows might use:
 *
 *
 *     Ethernet
 *
 *
 * another system might use:
 *
 *
 *     eth0
 *
 *
 * Wi-Fi may have another name entirely.
 *
 *
 * Always inspect:
 *
 *
 *     Object.keys(
 *       os.networkInterfaces(),
 *     );
 *
 * ============================================================
 */

/*
 * ============================================================
 * 32. Quick experiment
 * ============================================================
 *
 * Run this file:
 *
 *
 *     node .\04_os\network.js
 *
 *
 * Then compare the output with:
 *
 *
 * Windows:
 *
 *     ipconfig
 *
 *
 * Linux:
 *
 *     ip addr
 *
 *
 * macOS:
 *
 *     ifconfig
 *
 * ============================================================
 */

/*
 * ============================================================
 * FINAL CHEAT SHEET
 * ============================================================
 *
 *
 * Import:
 *
 *     const os = require("node:os");
 *
 *
 * Get interfaces:
 *
 *     os.networkInterfaces();
 *
 *
 * Interface address:
 *
 *     address.address
 *
 *
 * Address family:
 *
 *     address.family
 *
 *
 * Netmask:
 *
 *     address.netmask
 *
 *
 * MAC:
 *
 *     address.mac
 *
 *
 * Internal:
 *
 *     address.internal
 *
 *
 * CIDR:
 *
 *     address.cidr
 *
 *
 * ============================================================
 *
 * KEY IDEA:
 *
 *     `os.networkInterfaces()` gives Node.js information about
 *     the network interfaces and IP addresses available on the
 *     local machine.
 *
 * ============================================================
 */
