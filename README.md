# Network Packet Flow Visualizer 
Javascript (WebGL/Three.JS) based network packet flow visualizer.


- Run code as local http server.
  <code>python -m http.server</code>
- Packet flow analyzer and collector must be setup separately.
- Packetflow data and network topology need to be fed using restful APIs. 
- Json response template for both APIs is given in packetflow.js file.
- If network topology is static you can give topology variable static value


## Caution
- Use mutex lock for changing the global variables (check comments for details)
