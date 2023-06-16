module package::weapons {
    use std::option::{Option, Self};
    use std::string::{Self,String};
    // use std::debug;

    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;

    /// This error will appear when you try to put a weapon in a holder that already has a weapon
    const EHolderAlreadyHasWeapon: u64 = 0;
    const EHolderIsEmpty: u64 = 1;

    struct SUI has drop {
        dummy_field: bool
    }

    struct Weapon has key, store {
        id: UID,
        damage: u16,
        type: String,
    }


    struct Holder<Weapon> has key, store{
        id: UID,
        weapon: Option<Weapon>
    }


    public fun mint(ctx: &mut TxContext): Weapon {
        let uid: UID = object::new(ctx);
    
        let weapon = Weapon {
            id: uid,
            damage: 100,
            type: string::utf8(b"katana"),
        };

        let holder = Holder {
            id: object::new(ctx),
            weapon: option::none<Weapon>()
        };
        // debug::print<vector<u8>>(&b"katana");
        let sender: address = tx_context::sender(ctx);
        // debug::print<Weapon>(&weapon);
        transfer::public_transfer(holder, sender);
        weapon
    }



    public fun forge(damage: u16, type: String, ctx: &mut TxContext): Weapon {
        let weapon = Weapon {
            id: object::new(ctx),
            damage,
            type
        };
        weapon
    }

    public fun get_id(weapon: &Weapon): &UID {
        &weapon.id
    }

    public fun borrow_sword_mut(holder: &mut Holder<Weapon>): &mut Weapon {
        option::borrow_mut<Weapon>(&mut holder.weapon)
    }

    public fun holster(holder: &mut Holder<Weapon>, weapon: Weapon) {
        assert!(option::is_none<Weapon>(&mut holder.weapon), EHolderAlreadyHasWeapon);
        option::fill(&mut holder.weapon, weapon)
    }

    public fun unholster(holder: &mut Holder<Weapon>): Weapon {
        assert!(option::is_some<Weapon>(&mut holder.weapon), EHolderIsEmpty);
        let weapon = option::extract<Weapon>(&mut holder.weapon);
        weapon
    }

//     public fun transfer(weapon: Weapon, recipient: address) {
//         transfer::transfer(weapon, recipient);
//     }
}
// 0x7c8f52f7f53791a9cd007d4e943f10f486f4fcb43ec643f196f6adcfb52e39c4
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