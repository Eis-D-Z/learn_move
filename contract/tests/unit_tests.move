#[test_only]
#[allow(unused_assignment)]
module contract::unit_tests {
    use sui::object;
    use sui::test_scenario as ts;
    use sui::transfer;

    use std::debug;
    use std::string;

    use contract::potions::{LUCK, MintCap, Potion, STR, Shelf, Self};

    // errors
    const EPotionWrongName: u64 = 0;

    // const WORLD: address = @0xCAFE;
    const USER: address = @0x1234;

    // const VEC: vector<u8> = b"whatever";
    // const VEC2: vector<u8> = x"231321";

    // public fun helper() {}
    #[test]
    public fun check_typename() {
        let id1: address = @0x0;
        let id2: address = @0x1;
        let scenario = ts::begin(USER);
        {
            let ctx = ts::ctx(&mut scenario);
            potions::call_init(ctx);
        };

        ts::next_tx(&mut scenario, USER);
        {
            let cap = ts::take_from_sender<MintCap>(&scenario);
            let potion = potions::mint<LUCK>(
                &cap,
                string::utf8(b"Potions of Luck"),
                6,
                12,
                string::utf8(b"A potion that gives luck."),
                ts::ctx(&mut scenario)
            );

            assert!(potions::name<LUCK>(&potion) == string::utf8(b"Potions of Luck"), EPotionWrongName);

            transfer::public_transfer(potion, USER);
            ts::return_to_sender<MintCap>(&scenario, cap);
        };

        ts::next_tx(&mut scenario, USER);
        {
            let cap = ts::take_from_sender<MintCap>(&scenario);
            let potion = potions::mint<STR>(
                &cap,
                string::utf8(b"Potion of Strength"),
                6,
                12,
                string::utf8(b"A potion that increases Strength."),
                ts::ctx(&mut scenario)
            );

            assert!(potions::name<STR>(&potion) == string::utf8(b"Potion of Strength"), EPotionWrongName);

            transfer::public_transfer(potion, USER);
            ts::return_to_sender<MintCap>(&scenario, cap);
        };

        ts::next_tx(&mut scenario, USER);
        {
            let potion1 = ts::take_from_sender<Potion<LUCK>>(&scenario);
            let potion2 = ts::take_from_sender<Potion<STR>>(&scenario);
            id1 = object::id_address(&potion1);
            id2 = object::id_address(&potion2);
            let shelf = ts::take_shared<Shelf>(&scenario);

            potions::put_in_shelf(&mut shelf, potion1);
            debug::print(&string::utf8(b"success"));
            potions::put_in_shelf(&mut shelf, potion2);

            ts::return_shared<Shelf>(shelf);
        
        };

        ts::next_tx(&mut scenario, USER);
        {   
            let shelf = ts::take_shared<Shelf>(&scenario);
            let potion1 = potions::get_from_shelf<LUCK>(&mut shelf, id1);
            let potion2 = potions::borrow_from_shelf<STR>(&mut shelf, id2);

            debug::print(potion2);
            transfer::public_transfer(potion1, USER);
            ts::return_shared<Shelf>(shelf);
        };


        ts::end(scenario);
    }
}