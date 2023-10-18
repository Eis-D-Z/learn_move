module capy_ninja::sword {
    //imports
    use sui::object::{Self as obj, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    
    use std::string::{ String};
    // consts
    const VERSION: u64 = 1;

    // error codes
    const EWrongVersion: u64 = 0;

    //structs
    struct MintCap has key {
        id: UID,
        allowed_mints: u64
    }

    struct Sword has key, store {
        id: UID,
        damage: u64,
        type: String,
    }

    fun init(ctx: &mut TxContext) {
        let cap = MintCap {
            id: obj::new(ctx),
            allowed_mints: 10000000
        };
        transfer::transfer(cap, tx_context::sender(ctx));
    }

    // admin fun
    public fun transfer_cap(cap: MintCap, recipient: address) {
        transfer::transfer(cap, recipient);
    }

    //fun
    public fun mint(
        _: &MintCap,
        damage: u64,
        type: String,
        ctx: &mut TxContext): Sword {
        assert!(VERSION == 1, EWrongVersion);
        let id = obj::new(ctx);
        let sword = Sword {
            id,
            damage,
            type
        };
        sword
    }

    public fun mint_and_tranfer(
        cap: &MintCap,
        damage: u64,
        type: String,
        ctx: &mut TxContext) {
        let sword = mint(cap, damage, type, ctx);
        transfer::public_transfer(sword, tx_context::sender(ctx));
    }

    public fun burn(sword: Sword) {
        let Sword{id, damage:_, type:_} = sword;
        obj::delete(id);
    }

    // accessors
    public fun damage(sword: &Sword): u64 {
        sword.damage
    }

    public fun type(sword: &Sword):String {
        sword.type
    }
}