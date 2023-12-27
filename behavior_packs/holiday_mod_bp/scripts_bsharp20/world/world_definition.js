const holidayModWorldGenDefinition = {
    base: null,
    modify: (filterManager) => {
        filterManager.AppendFilter(['holiday_mod', 'center'], 1);
        filterManager.AppendFilter(['holiday_mod', 'set1'], 1);
        filterManager.AppendFilter(['holiday_mod', 'starting_area'], 2);
        filterManager.AppendFilter(['holiday_mod', 'piglin'], 1);
    }
};

SNIPPET_InheritsFromGameMode('holiday_mod', () => {
    SetWorldGenDefinition(holidayModWorldGenDefinition);
});
