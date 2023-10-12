module contract::alc{
    use sui::coin;
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::url::Url;

    use std::option;

    struct ALC has drop {}

    fun init(otw: ALC, ctx: &mut TxContext) {
        let (treasuryCap, metadata) = coin::create_currency(
            otw,
            4,
            b"ALC",
            b"alchemy coin",
            b"A coin used to buy potions",
            option::none<Url>(),
            ctx
        );

        transfer::public_transfer(treasuryCap, tx_context::sender(ctx));
        transfer::public_transfer(metadata, tx_context::sender(ctx));
    }

}