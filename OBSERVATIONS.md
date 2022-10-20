# Observations

> The code of the new functions is self-explanatory and uses struct creation and Sui-internal modules (TxContext and Transfer) in a way similar to what we > have seen in the previous sections. The important part is for the entry functions to have correct signatures as described earlier. In order for this code to build, we need to add an additional import line at the module level (as the first line in the module's main code block right before the existing module-wide ID module import) to make the TxContext struct available for function definitions:

    use sui::tx_context::TxContext;


The above part is not neeeded since the TxContext was imported from the get go as `use sui::tx_context::{Self, TxContext}`, if I understood correctly `Self` means the `sui::tx_context`.