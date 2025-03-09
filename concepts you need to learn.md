
## Key Concepts Required to Understand the Project

1. **Inter-Process Communication (IPC)**
   - **System V Message Queues**: Primary communication method between all processes
   - **Message queue creation**: Using `msgget()` and `key_t` via `ftok()`
   - **Message sending/receiving**: Using `msgsnd()` and `msgrcv()` with message types
   - **Message queue control**: Using `msgctl()` for deletion
   - **Pipes**: Used for parent-child communication between plane and passenger processes
   - **Pipe creation and usage**: Using `pipe()`, `read()`, and `write()`

2. **Process Management**
   - **Process creation**: Using `fork()` to create child processes
   - **Process relationships**: Parent-child hierarchy for planes and passengers
   - **Process waiting**: Using `wait()` to synchronize with child processes
   - **Process termination**: Using `exit()` with status codes
   - **Process IDs (PIDs)**: Understanding and tracking process identifiers

3. **Thread Programming**
   - **POSIX threads**: Creating threads with `pthread_create()`
   - **Thread synchronization**: Using `pthread_join()` to wait for thread completion
   - **Thread attributes**: Setting up with `pthread_attr_init()` and `pthread_attr_t`
   - **Thread functions**: Creating thread entry points and passing parameters
   - **Thread-safe programming**: Avoiding race conditions in multi-threaded environments

4. **Synchronization Mechanisms**
   - **Semaphores**: Using POSIX semaphores for mutual exclusion
   - **Semaphore operations**: `sem_init()`, `sem_wait()`, `sem_post()`, `sem_destroy()`
   - **Critical sections**: Protecting shared resources with semaphores
   - **Resource allocation**: Managing runway access using semaphores
   - **Deadlock prevention**: Proper resource release to avoid deadlocks

5. **File Input/Output Operations**
   - **File handling**: Opening, writing to, and closing files
   - **Error handling**: Checking for file operation failures
   - **Logging**: Writing system events to log files

6. **Data Structures and Algorithms**
   - **Structs**: Using `struct` for message passing and data organization
   - **Arrays**: Managing collections of runways and their properties
   - **Sorting algorithms**: Using bubble sort to arrange runways by capacity
   - **Best-fit algorithm**: Finding the most suitable runway for plane weight

7. **System Programming Concepts**
   - **System calls**: Understanding direct OS interactions
   - **Process scheduling**: How the OS manages process execution
   - **File descriptors**: Understanding low-level file handling
   - **Error handling**: Using `perror()` and error codes

8. **POSIX Standards**
   - **POSIX compatibility**: Writing portable code for Unix-like systems
   - **POSIX functions**: Using standard library functions
   - **POSIX thread model**: Understanding the pthread implementation

9. **Concurrency and Parallelism**
   - **Concurrent execution**: Managing multiple processes/threads
   - **Race conditions**: Understanding and preventing data races
   - **Atomicity**: Ensuring operations complete without interruption
   - **Process synchronization**: Coordinating activities between processes

10. **Command-Line Interface Programming**
    - **User input handling**: Reading and validating user input
    - **Command parsing**: Processing command-line arguments
    - **Terminal I/O**: Understanding standard input/output

11. **Simulation Techniques**
    - **Time simulation**: Using `sleep()` to represent real-world durations
    - **Event-based modeling**: Simulating real-world events with message passing
    - **State machines**: Managing entity states (planes, runways, etc.)

12. **Resource Management**
    - **Memory management**: Allocating and freeing resources
    - **Resource allocation strategies**: Best-fit algorithm for runway selection
    - **System resource cleanup**: Properly terminating and closing resources

The project integrates all these concepts to create a sophisticated simulation of an air traffic control system. Understanding these fundamentals will give you a solid foundation for comprehending and potentially modifying the code.



## Reusing a plane once it has reached its destination

Based on my analysis of the provided code files, there is no functionality to reuse a plane for another journey after it has completed its initial flight.

When a plane completes its journey, the following sequence occurs:

1. The plane lands at the arrival airport and completes deboarding/unloading.
2. The airport sends a message with `msg_type = 13` to the air traffic controller.
3. The air traffic controller then sends a message with `msg_type = 35 + planeID` to the plane.
4. The plane receives this message and prints a completion message: "Plane [ID] has successfully traveled from Airport [dep] to Airport [arr]!"
5. After this, the plane process terminates with `return 0` at the end of its main function.

Once a plane process terminates, there's no mechanism in the code to restart it or assign it a new route. Each plane appears to be designed for a single journey only.

If you wanted to add this functionality, you would need to:

1. Modify the `plane.c` file to continue running after receiving the completion message
2. Add a loop that would allow entering new destination information
3. Update the messaging system to handle these subsequent flight requests

Would you like me to suggest specific code modifications to implement this feature?