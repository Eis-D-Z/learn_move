module learn_move::my_module {
    // imports
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    // structs

    struct Sword has key, store {
        id: UID,
        magic: u64,
        strength: u64,
    }

    struct Forge has key, store {
        id: UID,
        swords_created: u64,
    }

    // init

    fun init (ctx: &mut TxContext) {
        let admin = Forge {
            id: object::new(ctx),
            swords_created: 0
        };
        transfer::transfer(admin, tx_context::sender(ctx));
    }

    // accessors

    public fun magic(self: &Sword): u64 {
        self.magic
    }

    public fun strength(self: &Sword): u64 {
        self.strength
    }

    public fun swords_created(self: &Forge): u64 {
        self.swords_created
    }

    // entry sui functions

    public entry fun sword_create(magic: u64, strength: u64, recipient: address, ctx: &mut TxContext) {
        use sui::transfer;

        let sword = Sword {
            id: object::new(ctx),
            magic: magic,
            strength: strength,
        };

        transfer::transfer(sword, recipient);

    }

    public entry fun sword_transfer(sword: Sword, recipient: address, _ctx: &mut TxContext) {
        use sui::transfer;

        transfer::transfer(sword, recipient);
    }

    // 6

    // tests

    #[test]
    public fun test_sword_create() {
        use sui::tx_context;
        use sui::transfer;

        let ctx = tx_context::dummy();

        let bfsword = Sword {
            id: object::new(&mut ctx),
            magic: 42,
            strength: 142,
        };

        // checks
        assert!(magic(&bfsword) == 42 && strength(&bfsword) == 142, 1);


        let dummy_address = @0xCAFE;
        transfer::transfer(bfsword, dummy_address);
    }

    #[test]
    fun test_sword_transactions() {
        use sui::test_scenario;

        let admin = @0xABBA;
        let initial_owner = @0xCAFE;
        let final_owner = @0xFACE;

        // first transaction executed by admin
        let scenario = test_scenario::begin(admin);

        {
         sword_create(42, 7, initial_owner, test_scenario::ctx(&mut scenario))
        };

        test_scenario::next_tx(&mut scenario, initial_owner);
        {
            // we just take the object???
            let sword = test_scenario::take_from_address<Sword>(&mut scenario, initial_owner);

            sword_transfer(sword, final_owner, test_scenario::ctx(&mut scenario));
        };

        test_scenario::next_tx(&mut scenario, final_owner);
        {
            let sword = test_scenario::take_from_address<Sword>(&mut scenario, final_owner);
            assert!(magic(&sword) == 42 && strength(&sword) == 7, 1);

            // return the object
            test_scenario::return_to_address<Sword>(final_owner, sword);
        };
        // end the scenario
        test_scenario::end(scenario);
    }

}