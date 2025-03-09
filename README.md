# Air Traffic Control System Simulator

A POSIX-compliant multi-process system simulating real-time air traffic management with concurrent plane/airport operations and IPC synchronization.

## 📋 System Overview

This system simulates an air traffic control network with multiple airports, planes, and a central controller. The simulation includes:

- Multiple airports with configurable runways
- Passenger and cargo planes with realistic weight calculations
- Real-time flight coordination and tracking
- Runway allocation based on weight requirements
- Synchronized takeoffs and landings

## 🛠️ Implementation Highlights

- **Multi-process Architecture**: 4 independent programs (`plane`, `airport`, `airtrafficcontroller`, `cleanup`) with 1500+ LOC
- **Complex IPC**: Single message queue handles 4+ message types with priority routing
- **Synchronization**: Semaphore-controlled runway allocation with best-fit algorithm
- **Weight Calculations**: Passenger/cargo load management with pipe-based child processes
- **Graceful Termination**: System-wide cleanup handling pending operations

## 📁 Core Components

| File | Description | Key Features |
|------|-------------|--------------|
| `plane.c` | Aircraft process manager | Parent-child passenger hierarchy, Dual plane types, Pipe-based IPC |
| `airport.c` | Airport operations | Multi-threaded runway management, Best-fit allocation, Synchronized landings/takeoffs |
| `airtrafficcontroller.c` | Central coordinator | Message queue routing, Journey logging, System orchestration |
| `cleanup.c` | Termination handler | Safe system shutdown protocol |

## 🧰 Prerequisites

- Linux-based operating system (Ubuntu 22.04 LTS recommended)
- GCC compiler
- POSIX threads library (pthread)
- POSIX IPC libraries (semaphores, message queues)

## Installing Prerequisites
1. Install the required packages in Ubuntu
```bash
sudo apt update
sudo apt install build-essential
```

2. Install the required directories
```bash
sudo apt install libpthread-stubs0-dev
```

## 🚀 Installation

1. Clone or download the repository containing all source files in a folder
2. Open a terminal in the project directory
3. Compile all components with the following commands:

```bash
gcc plane.c -o plane
gcc airport.c -o airport -pthread
gcc airtrafficcontroller.c -o atc
gcc cleanup.c -o cleanup
```

## 🔄 Running the System

You'll need to open multiple terminal windows/tabs to run each component:

### Terminal 1: Start the Air Traffic Controller
```bash
./atc
```
- When prompted, enter the number of airports to manage
- The controller will create a message queue and wait for airport and plane processes

### Terminal 2-N: Start Airport Processes
For each airport in your system (match the number entered in the controller):
```bash
./airport
```
For each airport, you'll need to enter:
- Airport Number (unique ID for each airport, starting from 1)
- Number of Runways (how many runways this airport has)
- Load Capacity of each runway (space-separated list of weight capacities in kg)

Note: Each airport automatically includes an emergency runway with 15,000kg capacity

**Important: You must open a separate terminal for each airport you specified in the ATC.**
For example, if you specified 3 airports in the ATC:
- Terminal 2: `./airport` → Enter "1" for airport number → specify runways
- Terminal 3: `./airport` → Enter "2" for airport number → specify runways
- Terminal 4: `./airport` → Enter "3" for airport number → specify runways

The system doesn't have a built-in mechanism to delete an individual airport once it's running. If you want to simulate fewer airports, you would need to restart the entire system with the new desired number.

### Terminal N+1 and Beyond: Start Plane Processes
For each plane you want to simulate, open a new terminal and run:
```bash
./plane
```

**You need to open a new terminal for each plane you want to simulate.**
For example:
- Terminal 5: `./plane` → Configure first plane
- Terminal 6: `./plane` → Configure second plane
- And so on...

For each plane, you'll need to enter:
- Plane ID (unique identifier)
- Plane Type (1 for passenger, 2 for cargo)

For passenger planes:
- Number of Occupied Seats
- For each passenger: Luggage Weight and Body Weight

For cargo planes:
- Number of Cargo Items
- Average Weight of Cargo Items

Then for all planes:
- Departure Airport Number
- Arrival Airport Number (must be different from departure)

Each plane process represents a single aircraft's journey from departure to arrival.

### Terminal N+2: Cleanup (when you want to stop the simulation)
```bash
./cleanup
```
- Enter 'Y' when prompted to terminate the system
- This will send termination signals to all processes

## 🔍 Tracking and Monitoring the System

### Tracking Planes and Airports

You can track the system through:

1. **Terminal Output**: Each component (ATC, airports, planes) prints status messages to their respective terminals. For example:
   - When a plane departs: "Plane X has completed boarding/loading and taken off from Runway No. Y of Airport No. Z"
   - When a plane arrives: "Plane X has landed on Runway No. Y of Airport No. Z and has completed deboarding/unloading"

2. **Log File**: The ATC writes flight information to `AirTrafficController.txt`

### Monitoring the Log File in Real-time

You can monitor the log file in real-time while the system is running:

1. Open another terminal
2. Use the `tail` command with the `-f` flag to continuously watch the file:
   ```
   tail -f AirTrafficController.txt
   ```

   This will show you the file contents and automatically update as new entries are added.

   Alternatively, you can use:
   ```
   watch cat AirTrafficController.txt
   ```

The `AirTrafficController.txt` file is updated in real-time by the ATC process as planes complete various stages of their journeys, specifically when they depart from their origin airports.

## 🔍 Operational Workflow

1. **Controller Initialization**:
   - Creates message queue
   - Sets up airport management
   - Prepares logging to `AirTrafficController.txt`

2. **Airport Setup**:
   - Configures regular runways with user-defined capacities
   - Sets up an emergency runway (15,000kg capacity)
   - Initializes semaphores for runway access control

3. **Plane Lifecycle**:
   - **Passenger Plane**:
     - Creates child processes for each passenger
     - Collects weight data through pipes
     - Calculates total weight (passengers + luggage + 7 crew members at 75kg each)
   - **Cargo Plane**:
     - Calculates total weight (cargo items + 2 crew members at 75kg each)
   - Sends flight plan to controller
   - Waits for boarding, takeoff, flight, landing, and deboarding processes

4. **ATC Coordination**:
   - Routes messages between airports and planes
   - Logs flight information
   - Manages termination sequence

5. **Runway Operations**:
   - Uses best-fit algorithm to allocate appropriate runway
   - Implements semaphore locking for exclusive access
   - Simulates boarding (3s), takeoff (2s), flight (30s), landing (2s), and deboarding (3s)

## ⚙️ Technical Specifications

- **IPC Mechanisms**:
  - System V message queue with multiple message types:
    - Type 11: New plane requests
    - Type 12: Plane departure notifications
    - Type 13: Plane arrival notifications
    - Type 14: System termination signal
    - Type 16: Airport termination signal
    - Type 35+planeID: Plane termination signal
  - POSIX pipes for passenger-plane communication
  - POSIX semaphores for runway synchronization

- **Threading**: POSIX threads for concurrent runway operations

- **Logging**: Real-time flight tracking in `AirTrafficController.txt`

- **System Constraints**:
  - Supports up to 10 airports with up to 10 runways each
  - Runway capacities typically between 10,000-12,000kg
  - Emergency runway with 15,000kg capacity
  - Flight simulation duration of 30 seconds

## 🔎 Example Scenario

1. Start controller and configure for 2 airports
2. Start 2 airport processes, each with 2 runways
3. Start a passenger plane with 5 passengers
4. Observe as the plane requests departure, takes off, flies, and lands
5. Start a cargo plane between different airports
6. Use cleanup to gracefully terminate all processes

## 📝 Notes

- Arrival and departure airports must be different
- The system uses a single message queue for all communication
- Each airport runs as a separate process
- The controller maintains a count of in-flight planes for termination handling
- Files created by the system:
  - `msgq.txt`: Used for IPC key generation
  - `AirTrafficController.txt`: Flight logs

> **Note**: Developed for Ubuntu 22.04 LTS with strict POSIX compliance