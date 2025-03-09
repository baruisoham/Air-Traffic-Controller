// Put this on mermaid chart website to generate the flowchart

flowchart TD
    %% System initialization
    start([Start]) --> atcMain[ATC Main]
    start --> airportMain[Airport Main]
    start --> planeMain[Plane Main]
    start --> cleanupMain[Cleanup Main]
    
    %% Air Traffic Controller flow
    subgraph ATC["Air Traffic Controller (airtrafficcontroller.c)"]
        atcMain --> atcInit[Initialize message queue]
        atcInit --> atcGetAirports[Get number of airports]
        atcGetAirports --> atcLoop[Message processing loop]
        
        atcLoop --> msgType11{Message type 11?}
        msgType11 -->|Yes| forwardToDeparture[Forward to departure airport]
        msgType11 -->|No| msgType12
        
        forwardToDeparture --> atcLoop
        
        msgType12{Message type 12?}
        msgType12 -->|Yes| logDeparture[Log plane departure to file]
        msgType12 -->|No| msgType13
        
        logDeparture --> forwardToArrival[Forward to arrival airport]
        forwardToArrival --> atcLoop
        
        msgType13{Message type 13?}
        msgType13 -->|Yes| notifyPlane[Notify plane of journey completion]
        msgType13 -->|No| msgType14
        
        notifyPlane --> atcLoop
        
        msgType14{Message type 14?}
        msgType14 -->|Yes| checkFlights{In-flight planes?}
        msgType14 -->|No| atcLoop
        
        checkFlights -->|Yes| atcLoop
        checkFlights -->|No| terminateAirports[Send termination signal]
        
        terminateAirports --> atcEnd[Delete message queue]
    end
    
    %% Airport flow
    subgraph Airport["Airport (airport.c)"]
        airportMain --> airportInit[Initialize message queue & semaphores]
        airportInit --> configAirport[Configure airport & runways]
        configAirport --> sortRunways[Sort runways by capacity]
        sortRunways --> airportLoop[Message processing loop]
        
        airportLoop --> checkTerminate{Termination message?}
        checkTerminate -->|Yes| airportExit[Clean up & terminate]
        checkTerminate -->|No| processPlaneMsgs[Process plane messages]
        
        processPlaneMsgs --> isDeparture{Is departure?}
        isDeparture -->|Yes| createDepartThread[Create departure thread]
        isDeparture -->|No| isArrival{Is arrival?}
        
        isArrival -->|Yes| createArriveThread[Create arrival thread]
        isArrival -->|No| airportLoop
        
        createDepartThread --> runway_allocate_depart[runway_allocate_depart]
        createArriveThread --> runway_allocate_arrive[runway_allocate_arrive]
        
        runway_allocate_depart --> findRunway1[Find suitable runway]
        findRunway1 --> lockRunway1[Lock runway semaphore]
        lockRunway1 --> boardingProcess[Simulate boarding]
        boardingProcess --> takeoffProcess[Simulate takeoff]
        takeoffProcess --> notifyATC1[Notify ATC of departure]
        notifyATC1 --> unlockRunway1[Unlock runway semaphore]
        unlockRunway1 --> airportLoop
        
        runway_allocate_arrive --> findRunway2[Find suitable runway]
        findRunway2 --> flightProcess[Simulate flight]
        flightProcess --> lockRunway2[Lock runway semaphore]
        lockRunway2 --> landingProcess[Simulate landing]
        landingProcess --> deboardingProcess[Simulate deboarding]
        deboardingProcess --> notifyATC2[Notify ATC of arrival]
        notifyATC2 --> unlockRunway2[Unlock runway semaphore]
        unlockRunway2 --> airportLoop
    end
    
    %% Plane flow
    subgraph Plane["Plane (plane.c)"]
        planeMain --> planeInit[Initialize message queue]
        planeInit --> getPlaneInfo[Get plane ID and type]
        
        getPlaneInfo --> planeType{Plane type?}
        planeType -->|Passenger| passengerPlane[Process passenger plane]
        planeType -->|Cargo| cargoPlane[Process cargo plane]
        
        passengerPlane --> getNumPass[Get number of passengers]
        getNumPass --> createPassengers[Create child processes]
        createPassengers --> collectWeights[Collect weights via pipes]
        collectWeights --> calcPassWeight[Calculate total weight]
        
        cargoPlane --> getCargoInfo[Get cargo items and weight]
        getCargoInfo --> calcCargoWeight[Calculate total weight]
        
        calcPassWeight --> getAirports[Get departure & arrival airports]
        calcCargoWeight --> getAirports
        
        getAirports --> sendToATC[Send flight plan to ATC]
        sendToATC --> waitForCompletion[Wait for completion message]
        waitForCompletion --> planeExit[Exit]
    end
    
    %% Cleanup flow
    subgraph Cleanup["Cleanup (cleanup.c)"]
        cleanupMain --> askTerminate[Ask user to terminate system]
        askTerminate --> userResponse{User response}
        userResponse -->|No| askTerminate
        userResponse -->|Yes| sendTerminate[Send termination message]
        sendTerminate --> cleanupExit[Exit]
    end
    
    %% Connections between components
    sendToATC -.-> msgType11
    forwardToDeparture -.-> processPlaneMsgs
    notifyATC1 -.-> msgType12
    forwardToArrival -.-> processPlaneMsgs
    notifyATC2 -.-> msgType13
    notifyPlane -.-> waitForCompletion
    sendTerminate -.-> msgType14
    terminateAirports -.-> checkTerminate