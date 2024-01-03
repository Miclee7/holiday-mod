// Starting area
SNIPPET_VillageGenerated("holiday_mod_village_setup", (villageId) => {
    // Deck initialization
    const villageDeck = DECK_Empty()

    // A center zone where the player will spawn (with some padding)
    const firstZone = ZonesCard("addZone", 8)
    DECK_MultiplyByMultipleRules(firstZone, [ZoneTagCard("villageMiddle"), PlacementPreferenceCard(PLACEMENT_CLOSE_TO_VILLAGE_START)])
    DECK_PutOnBottomOf(firstZone, villageDeck)

    const elfSpawner = BuildableCard("centerFountain")
    DECK_MultiplyByMultipleRules(elfSpawner, [ZoneFilterCard("villageMiddle"), PlacementPreferenceCard(PLACEMENT_CLOSE_TO_VILLAGE_START), ForceBuildingPlacementCard("forceBuildingPlacement")])
    DECK_PutOnBottomOf(elfSpawner, villageDeck)

    // Deck data
    DECK_PutOnTopOf(EntityClearingCard("clearPiglinInvisibleSpawners"), villageDeck)
    DECK_PutOnTopOf(EntityClearingCard("clearPiglins"), villageDeck)

    // Submit the deck to game logic for generation
    OUTPUT_SetNamedDeck(INSTANT_BUILD_DECK_NAME + villageId, villageDeck)
});

SNIPPET_InheritsFromGameMode("holiday_mod", () => {
    // Hook into when the player's villages are generated
    LISTENFOR_VillageGenerated({
        snippet: "holiday_mod_village_setup",
        ownerVillageId: OWNER_VILLAGE_OPT_OUT,
        factionName: "faction.cul.002"
    })
});


// Piglin base generation logic
SNIPPET_VillageGenerated("holiday_mod_piglin_setup", (villageId) => {
    // Deck setup
    const piglinDeck = DECK_Empty()
    SetupBasicVillageClearingCards(piglinDeck)

    // A zone for where we're going to plop the portal
    const firstZone = ZonesCard("defCenterZone", 2)
    DECK_MultiplyByMultipleRules(firstZone, [ZoneTagCard("villageDeadCenter"), ZoneHeightChangeCard("piglinFrost1Height"), PlacementPreferenceCard(PLACEMENT_CLOSE_TO_VILLAGE_START)])
    DECK_PutOnBottomOf(firstZone, piglinDeck)

    //const centerPaddingLayers = LayerOfZonesCard("addLayerOfZones", 1)
    //DECK_MultiplyByMultipleRules(centerPaddingLayers, [ZoneTagCard("defCenterZone"), ZoneHeightChangeCard("piglinFrost1Height"), PlacementPreferenceCard(PLACEMENT_CLOSE_TO_VILLAGE_START)])
    //DECK_PutOnBottomOf(centerPaddingLayers, piglinDeck)

    // An "initial zone" For some buildables
    for (let i = 0; i < 18; i++) {
        const padding = ZonesCard("add1Zone", 1)
        DECK_MultiplyBySingle(padding, ZoneTagCard("defBetweenWallsTag")) // Reusing these tags instead of making new ones with apt names because I'm lazy
        
        // There's a 25% chance that a the padding will be on the higher side of things
        if (QUERY_RandomNumberGroup(0, 3, "height_spin") < 1) {
            DECK_MultiplyBySingle(padding, ZoneHeightChangeCard("piglinFrost1Height"))
        } else {
            DECK_MultiplyBySingle(padding, ZoneHeightChangeCard("piglinFrost1Height"))
        }
        DECK_PutOnBottomOf(padding, piglinDeck)
    }

    // A "second initial zone" For some more buildables
    for (let i = 0; i < 18; i++) {
        const secondPadding = ZonesCard("add1Zone", 1)
        DECK_MultiplyBySingle(secondPadding, ZoneTagCard("defOuterWalls"))
        
        if (QUERY_RandomNumberGroup(0, 3, "height_spin") < 1) {
            DECK_MultiplyBySingle(secondPadding, ZoneHeightChangeCard("piglinFrost1Height"))
        } else {
            DECK_MultiplyBySingle(secondPadding, ZoneHeightChangeCard("piglinFrost1Height"))
        }
        DECK_PutOnBottomOf(secondPadding, piglinDeck)
    }

    const secondPaddingLayers = LayerOfZonesCard("addLayerOfZones", 1)
    DECK_MultiplyByMultipleRules(secondPaddingLayers, [ZoneTagCard("defOuterWalls"), ZoneHeightChangeCard("piglinFrost1Height"), PlacementPreferenceCard(PLACEMENT_CLOSE_TO_VILLAGE_START)])
    DECK_PutOnBottomOf(secondPaddingLayers, piglinDeck)

    DECK_PutOnBottomOf(TerrainWeatheringCard("terrainWeathering"), piglinDeck)

    ///Path Zones///
    
    ///North
    const northConnectionZone = ZonesCard("addZone", 1)
    DECK_MultiplyByMultipleRules(northConnectionZone, [ZoneTagCard("pathConnectionZoneNorth"), PlacementPreferenceCard(PLACEMENT_FAR_FROM_VILLAGE_START), PlacementPreferenceCard("placeInDirectionNorthWithRectangleBrush")])
    DECK_PutOnBottomOf(northConnectionZone, piglinDeck)

    const path1StartRules = [ZoneFilterCard("villageDeadCenter"), PlacementPreferenceCard(PLACEMENT_CLOSE_TO_VILLAGE_START), ForceBuildingPlacementCard("forceBuildingPlacement"), PlacementPreferenceCard("placeInDirectionNorthWithRectangleBrush15")]
    const path1EndRules = [ZoneFilterCard("pathConnectionZoneNorth"), PlacementPreferenceCard(PLACEMENT_FAR_FROM_VILLAGE_START)]
    CreatePathRequestOnBottomOf("piglinFrostPath", path1StartRules, path1EndRules, piglinDeck)

    //const path2Start = [ZoneFilterCard("defCenterZone"), PlacementPreferenceCard(PLACEMENT_CLOSE_TO_VILLAGE_START), PlacementPreferenceCard("placeInDirectionSouthWithRectangleBrush15")]
    //const path2End = [ZoneFilterCard("defOuterWalls"), PlacementPreferenceCard(PLACEMENT_FAR_FROM_VILLAGE_START)]
    //CreatePathRequestOnBottomOf("piglinFrostPath", path2Start, path2End, piglinDeck)

    const frostWalls = WallsCard("piglinFrostWalls", 1)
    DECK_MultiplyByMultipleRules(frostWalls, [ZoneFilterCard("defOuterWalls")])
    DECK_PutOnBottomOf(frostWalls, piglinDeck)

    // The portal buildable that the player must destroy
    const portal = BuildableCard("defendPortalMedium")
    DECK_MultiplyBySingle(portal, ZoneHeightChangeCard("piglinFrost1Height"))
    DECK_MultiplyBySingle(portal, PlacementPreferenceCard(PLACEMENT_CLOSE_TO_VILLAGE_START))
    DECK_MultiplyBySingle(portal, ForceBuildingPlacementCard("forceBuildingPlacement"))
    DECK_PutOnBottomOf(portal, piglinDeck)

    // Some "hazard" buildables placed in the initial zone
    const paddingHazards = DECK_Empty()
    DECK_PutOnBottomOf(BuildableCard("piglinTower", 3), paddingHazards)
    DECK_PutOnBottomOf(BuildableCard("lavaSprayerTower", 1), paddingHazards)
    DECK_PutOnBottomOf(BuildableCard("addFighterBarracks", 1), paddingHazards)
    DECK_PutOnBottomOf(BuildableCard("addSiegerBarracks", 1), paddingHazards)
    DECK_PutOnBottomOf(BuildableCard("buildingRegenerator", 1), paddingHazards)
    DECK_MultiplyBySingle(paddingHazards, ZoneFilterCard("defBetweenWalls")) 
    DECK_PutOnBottomOf(paddingHazards, piglinDeck)

    // Some "hazard" buildables placed in the second initial zone
    const secondPaddingHazards = DECK_Empty()
    DECK_PutOnBottomOf(BuildableCard("netherSpreader", 2), secondPaddingHazards)
    DECK_PutOnBottomOf(BuildableCard("piglinTower", 2), secondPaddingHazards)
    DECK_PutOnBottomOf(BuildableCard("addFighterBarracks", 2), secondPaddingHazards)
    DECK_MultiplyBySingle(secondPaddingHazards, ZoneFilterCard("defOuterWalls"))
    DECK_PutOnBottomOf(secondPaddingHazards, piglinDeck)
    
    // Submitting the deck microcode to the deck-interpeting virtual machine for groundbreaking deck systems engineering
    OUTPUT_SetNamedDeck(INSTANT_BUILD_DECK_NAME + villageId, piglinDeck)
});

SNIPPET_InheritsFromGameMode("holiday_mod", () => {
    // Hook in our logic to when a defend faction is generated
    LISTENFOR_VillageGenerated({
        snippet: "holiday_mod_piglin_setup",
        ownerVillageId: OWNER_VILLAGE_OPT_OUT,
        factionName: "faction.pig.frost"
    })
});

// Win condition
SNIPPET_InheritsFromGameMode("holiday_mod", (_villageId, _payload) => {
    LISTENFOR_VillageDestroyed({
        snippet: "holiday_mod_piglin_base_destroyed",
        ownerVillageId: OWNER_VILLAGE_OPT_OUT,
        factionName: "faction.pig.frost"
    })
});

SNIPPET_VillageDestroyed("holiday_mod_piglin_base_destroyed", () => {
    OUTPUT_EndMatch(TEAM_BLUE)
});


// Lose condition
SNIPPET_InheritsFromGameMode("holiday_mod", (_villageId, _payload) => {
    LISTENFOR_NonPopCappedEntityDestroyed({
        snippet: "holiday_mod_player_death",
        ownerVillageId: OWNER_VILLAGE_OPT_OUT,
        includeTags: ["player"],
        despawned: false
    })

    LISTENFOR_PlayersReady({
        snippet: "holiday_mod_player_ready",
        ownerVillageId: OWNER_VILLAGE_OPT_OUT
    })
});

SNIPPET_PlayersReady("holiday_mod_player_ready", (_payload) => {
    LISTENFOR_LocalTimer({
        snippet: "holiday_mod_pacing_delay_intro",
        ownerVillageId: OWNER_VILLAGE_OPT_OUT,
    })

    Once()
})

SNIPPET_LocalTimer("holiday_mod_pacing_delay_intro", (_payload) => {
    OUTPUT_SetLivesCounter(1, TEAM_BLUE, true)

    // I don't know why this isn't working correctly for me, but I'm going to cut the feature for time's sake.
    OUTPUT_Announce("holiday_mod_intro_message", [])

    Once()
})

SNIPPET_NonPopCappedEntityDestroyed("holiday_mod_player_death", (_player) => {
    OUTPUT_SetLivesCounter(0, TEAM_BLUE, true)

    OUTPUT_EndMatch(TEAM_ORANGE)
});