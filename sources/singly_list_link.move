module learn_move::singly_linked_list {

    // imports
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};

    
    // struct definitions

    struct Node has key, store, copy {
        id: UID,
        value: u64,
        next: address
    }

    struct SinglyLinkedList has key, store {
        id: UID,
        head: Node,
    }

    // creators

    public fun create_node(value: u64, next: address, ctx: &mut TxContext): Node {
        let node = Node {
            id: object::new(ctx),
            value: value,
            next: next
        };
        node
    }

    public fun create_list(self: &Node, ctx: &mut TxContext): SinglyLinkedList {
        let list = SinglyLinkedList {
            id: object::new(ctx),
            head: *self,
        };
        list
    }
}