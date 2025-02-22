import { Item } from "./item";

export type OrderStatus = 'pending' | 'completed' | 'cancelled';

export type Order = {
    order_id: string
    customer_id: string
    total_price: number
}

export type OrderExpand = Order & {
    items: Item[]
    order_date: string
    status: OrderStatus
}