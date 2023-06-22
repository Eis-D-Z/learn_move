module package::weapons {
    use std::option::{Option, Self};
    use std::string::{Self,String};
    // use std::debug;

    use sui::dynamic_field as df;
    use sui::dynamic_object_field as dof;
    use sui::object::{Self, UID};
    use sui::tx_context::{TxContext};
    // use sui::transfer;

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

    struct HolderAccessory has key, store {
        id: UID,
        color: String,
        name: String
    }



    // === Weapon Functions ====

    public fun forge(damage: u16, type: String, ctx: &mut TxContext): Weapon {
        let weapon = Weapon {
            id: object::new(ctx),
            damage,
            type
        };

        let name: String = string::utf8(b"slash_count");
        let value: u64 = 0;

        df::add<String, u64>(&mut weapon.id, name, value);

        weapon
    }

    // getter
    public fun get_damage(weapon: &Weapon): &u16 {
        &weapon.damage
    }

    public fun slash(weapon: &mut Weapon) {
        let count = df::borrow_mut<String, u64>(&mut weapon.id, string::utf8(b"slash_count"));
        *count = *count + 1;
    }

    public fun add_accessory(color: String, name: String, holder: &mut Holder<Weapon>, ctx: &mut TxContext) {
        let accessory = HolderAccessory {
            id: object::new(ctx),
            color,
            name
        };

        dof::add<String, HolderAccessory>(&mut holder.id, name, accessory); 
    }

    public fun burn_weapon(weapon: Weapon){
        df::remove<String, u64>(&mut weapon.id, string::utf8(b"slash_count"));
        let Weapon{ id, damage: _, type: _} = weapon;
        object::delete(id);
    }

    // === Holder Functions ===

    public fun mint_holder(ctx: &mut TxContext): Holder<Weapon> {
        let holder = Holder {
            id: object::new(ctx),
            weapon: option::none<Weapon>()
        };

        holder
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

    public fun burn_holder(holder: Holder<Weapon>) {
        let is_empty = is_empty(&holder);

        let Holder { id, weapon } = holder;

        if (dof::exists_<String>(&mut id, string::utf8(b"strings"))) {
            let accessory = dof::remove<String, HolderAccessory>(&mut id, string::utf8(b"strings"));
            let HolderAccessory {id, color: _, name: _} = accessory;
            object::delete(id);
        };
        object::delete(id);

        if (is_empty) {
            option::destroy_none(weapon);
        } else {
            let weapon_ = option::destroy_some<Weapon>(weapon);
            burn_weapon(weapon_);
        }

    }


    // helper
    public fun is_empty(holder: &Holder<Weapon>): bool {
        option::is_none<Weapon>(&holder.weapon)
    }
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