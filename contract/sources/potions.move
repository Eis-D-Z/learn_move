module contract::potions {
    // imports
    use sui::balance::Balance;
    use sui::coin::{Coin, Self};
    use sui::display;
    use sui::dynamic_object_field as dof;
    use sui::object::{Self, UID};
    use sui::package;
    // use sui::table::{Self, Table};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;

    use std::string::{String, Self};

    use contract::alc::ALC;

    // constants / error codes
    const EPotionNotFoundInShelf: u64 = 0;
    const EAmountIsNotExact: u64 = 1;
    

    const POTION_PRICE: u64 = 10000;

    // structs

    struct POTIONS has drop {}

    struct MintCap has key {
        id: UID
    }

    struct Potion<phantom T> has key, store {
        id: UID,
        name: String,
        purity: u64,
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


    struct Shelf has key, store {
        id: UID,
        payments: Balance<ALC>
    }

    fun init(otw: POTIONS, ctx: &mut TxContext) {

        let publisher = package::claim<POTIONS>(otw, ctx);

        let display_keys = vector[
            string::utf8(b"image_url"),
            string::utf8(b"name"),
            string::utf8(b"creator")
        ];

        let display_values = vector [
            string::utf8(b"https://cdna.artstation.com/p/assets/images/images/006/068/392/large/nathanael-mortensen-luck-potion-final-2.jpg?1495798250"),
            string::utf8(b"{name}"),
            string::utf8(b"Eis D. Zaster gaming LTD")
        ];
        let display = display::new_with_fields<Potion<LUCK>>(
            &publisher,
            display_keys,
            display_values,
            ctx    

        );

        display::update_version<Potion<LUCK>>(&mut display);

        let shelf = Shelf {
            id: object::new(ctx),      
        };

        let cap = MintCap {
            id: object::new(ctx)
        };

        let sender = tx_context::sender(ctx);
        transfer::public_transfer(publisher,sender);
        transfer::public_transfer(display, sender);
        transfer::transfer(cap, sender);
        transfer::public_share_object(shelf);
    }

    // fun
    public fun mint<T>(
        _: &MintCap,
        name: String,
        purity: u64,
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
            purity,
            creator: tx_context::sender(ctx),
            label
        };

        // let num = potion.purity;
        potion
    }

    public entry fun mint_and_transfer<T>(
        cap: &MintCap,
        name: String,
        purity: u64,
        sn: u8,
        description: String,
        ctx: &mut TxContext) 
    {
        let potion = mint<T>(cap, name, purity, sn, description, ctx);
        transfer::public_transfer(potion, tx_context::sender(ctx));
    }

    public fun burn<T>(potion: Potion<T>) {
        let Potion {id, name: _, purity: _, creator: _, label: _} = potion;
        object::delete(id);
    }

    public fun drink_potion<T>(potion: Potion<T>) {
        burn(potion);
    }

    public fun drink_agi_potion(potion: Potion<AGI>) {
        burn<AGI>(potion);
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

    public fun put_in_shelf<T>(shelf: &mut Shelf, potion: Potion<T>) {
        dof::add<address, Potion<T>>(
            &mut shelf.id,
            object::id_address<Potion<T>>(&potion),
            potion
        );
    }

    public fun get_from_shelf<T>(
        shelf: &mut Shelf,
        potion_address: address,
        payment: Coin<ALC>
        ): Potion<T> {
        assert!(coin::value<ALC>(&payment) == POTION_PRICE, EAmountIsNotExact);
        assert!(dof::exists_<address>(&mut shelf.id, potion_address), EPotionNotFoundInShelf);
        let balance = coin::into_balance<ALC>(payment);
        balance::join<ALC>(&mut shelf.payments, balance);
        dof::remove<address, Potion<T>>(&mut shelf.id, potion_address)
    }

    public fun borrow_from_shelf<T>(shelf: &mut Shelf, potion_address: address): &Potion<T> {
        assert!(dof::exists_<address>(&mut shelf.id, potion_address), EPotionNotFoundInShelf);
        dof::borrow<address, Potion<T>>(&mut shelf.id, potion_address)
    }

    public fun get_some_profit(_: &MintCap, shelf: &mut Shelf, value: u64, ctx: &mut TxContext ): Coin<ALC> {
        assert!(value <= balance::value(&shelf.payments));

        let coin1 = coin::take<ALC>(&mut shelf.payments, value, ctx);

        coin1
    }

    

    #[test_only]
    public fun call_init(ctx: &mut TxContext) {
        init(ctx);
    }
}

