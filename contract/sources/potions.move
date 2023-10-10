module contract::potions {
    // imports
    use sui::object::{Self, UID};
    // use sui::table::{Self, Table};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;

    use std::string::String;
    use std::vector;

    // constants / error codes
    const EPotionNotFoundInShelf: u64 = 0;
    // const ADMIN: address = @0x6f2d5e80dd21cb2c87c80b227d662642c688090dc81adbd9c4ae1fe889dfaf71;

    // structs
    struct Potion<phantom T> has key, store {
        id: UID,
        name: String,
        number: u8,
        creator: address,
        label: Label,
    }

    struct Label has store, copy, drop {
        serial_number: u8,
        description: String
    }

    struct STR has drop {}
    struct AGI has drop {}
    struct CHA has drop {}
    struct LvlUp has drop {}
    struct LUCK has drop {}

    struct PotionSmallShelf<phantom T> has key {
        id: UID,
        potions: vector<Potion<T>>,
    }

    // struct PotionLargeShelf has key, store {
    //     id: UID,
    //     potions: Table<Potion, bool>
    // }

    fun init(ctx: &mut TxContext) {
        let small_shelf = PotionSmallShelf<AGI> {
            id: object::new(ctx),
            potions: vector::empty<Potion<AGI>>()
        };

        // let large_shelf = PotionLargeShelf {
        //     id: object::new(ctx),
        //     potions: table::new<Potions, bool>(ctx)           
        // };

        transfer::share_object(small_shelf);
        // transfer::public_share_object(large_shelf);
    }

    // fun
    public fun mint<T>(
        name: String,
        number: u8,
        sn: u8,
        description: String,
        ctx: &mut TxContext
    ): Potion<T> 
    {
        let label = Label {
            serial_number: sn,
            description
        };
        let potion = Potion<T> {
            id: object::new(ctx),
            name,
            number,
            creator: tx_context::sender(ctx),
            label
        };

        // let num = potion.number;
        potion
    }

    public entry fun mint_and_transfer<T>(
        name: String,
        number: u8,
        sn: u8,
        description: String,
        ctx: &mut TxContext) 
    {
        let potion = mint<T>(name, number, sn, description, ctx);
        transfer::public_transfer(potion, tx_context::sender(ctx));
    }

    public fun burn<T>(potion: Potion<T>) {
        let Potion {id, name: _, number: _, creator: _, label: _} = potion;
        object::delete(id);
    }

    public fun drink_potion<T>(potion: Potion<T>) {
        burn(potion);
    }

    // Read functions for Potion

    public fun name<T>(potion: &Potion<T>): String {
        potion.name
    }

    public fun creator<T>(potion: &Potion<T>): address {
        potion.creator
    }

    // Write functions for Potion

    public fun set_description<T>(potion: &mut Potion<T>, description: String) {
        potion.label.description = description;
    }

    // Shelf functions

    public fun put_in_small_shelf<T>(shelf: &mut PotionSmallShelf<T>, potion: Potion<T>) {
        vector::push_back<Potion<T>>(&mut shelf.potions, potion);
    }

    public fun look_for_potion_small_shelf<T>(
        shelf: &mut PotionSmallShelf<T>,
        index: u64
    ): &Potion<T>
    {
       assert!(vector::length<Potion<T>>(&shelf.potions) > index, EPotionNotFoundInShelf);
       vector::borrow<Potion<T>>(&shelf.potions, index)
    }

    public fun take_potion_from_small_shelf<T>(
        shelf: &mut PotionSmallShelf<T>,
        index: u64): Potion<T> 
    {
        assert!(vector::length<Potion<T>>(&shelf.potions) > index, EPotionNotFoundInShelf);
        vector::remove<Potion<T>>(&mut shelf.potions, index)
    }
    
    public fun drink_agi_potion(potion: Potion<AGI>) {
        burn<AGI>(potion);
    }
}