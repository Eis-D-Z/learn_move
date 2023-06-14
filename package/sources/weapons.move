module package::weapons {
    use std::string::{Self,String};
    use std::debug;

    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;


    const Error: u64 = 1;

    struct Weapon has key, store {
        id: UID,
        damage: u16,
        type: String,
        t: vector<u8>
    }


    public fun mint(ctx: &mut TxContext) {
        let uid: UID = object::new(ctx);

        let weapon = Weapon {
            id: uid,
            damage: 100,
            type: string::utf8(b"katana"),
            t: b"katana"
        };
        // debug::print<vector<u8>>(&b"katana");
        let sender: address = tx_context::sender(ctx);
        debug::print<Weapon>(&weapon);
        transfer::public_transfer(weapon, sender);
    }

    public fun get_id(weapon: &Weapon): &UID {
        &weapon.id
    }
}
// 0x2837aef041f00e75ebf7170871d73a2d192ae7152b07f212a9f80171f6c4178d
#[test_only]
module package::weapon_tests{
    use sui::test_scenario as ts;
    // use sui::transfer;

    use package::weapons;

    const ADMIN: address = @0xCAFE;
    #[test]
    public fun test_weapon() {
        let scenario = ts::begin(ADMIN);

        weapons::mint(ts::ctx(&mut scenario));

        ts::end(scenario);
    }

}