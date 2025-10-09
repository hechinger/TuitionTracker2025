#!/usr/bin/env python3
"""
Calculate all tuition-related values that would change when updating a school's tuition.
Run with: python calculate_tuition_changes.py
"""

import json
import copy
from typing import Dict, List, Optional, Any
from datetime import datetime

def calculate_tuition_changes(
    current_row: Dict,
    new_sticker_price: float,
    new_out_state_price: Optional[float] = None
) -> Dict:
    """
    Calculate all values that would change when updating tuition.
    
    Args:
        current_row: Current database row
        new_sticker_price: New in-state tuition
        new_out_state_price: New out-of-state tuition (if None, uses new_sticker_price)
    
    Returns:
        Updated row with all cascading changes
    """
    
    # Deep clone to avoid modifying original
    updated_row = copy.deepcopy(current_row)
    
    print("=" * 80)
    print("TUITION UPDATE CALCULATOR")
    print("=" * 80)
    
    # Get current values
    old_sticker_in = current_row['sticker_price_in_state']
    old_sticker_out = current_row['sticker_price_out_state']
    
    print("\n📊 CURRENT VALUES:")
    print(f"  School ID: {current_row['school_id']}")
    print(f"  Year: {current_row['year']}")
    print(f"  Start Year: {current_row['start_year']}")
    print(f"  In-State Sticker: ${old_sticker_in:,.2f}")
    print(f"  Out-State Sticker: ${old_sticker_out:,.2f}")
    print(f"  Average Net Price: ${current_row['net_price_average']:,.2f}")
    
    # If no out-state price specified, use the in-state price
    if new_out_state_price is None:
        new_out_state_price = new_sticker_price
    
    # Calculate change ratios
    in_state_ratio = new_sticker_price / old_sticker_in
    out_state_ratio = new_out_state_price / old_sticker_out
    
    print("\n📈 CHANGE ANALYSIS:")
    print(f"  New In-State: ${new_sticker_price:,.2f} ({(in_state_ratio - 1) * 100:+.2f}%)")
    print(f"  New Out-State: ${new_out_state_price:,.2f} ({(out_state_ratio - 1) * 100:+.2f}%)")
    
    # Update sticker prices
    updated_row['sticker_price_in_state'] = new_sticker_price
    updated_row['sticker_price_out_state'] = new_out_state_price
    
    # Calculate discount rate for average net price (using existing min/max as bounds)
    # The actual discount seems to be: net_price / sticker_price
    avg_discount = current_row['net_price_average'] / old_sticker_in
    
    # Update all net prices proportionally
    print("\n💰 UPDATED NET PRICES:")
    print("  Category                    Old Price    →    New Price      Change")
    print("  " + "-" * 70)
    
    # Update average net price
    old_avg = current_row['net_price_average']
    updated_row['net_price_average'] = new_sticker_price * avg_discount
    print(f"  Average:                ${old_avg:10,.2f} → ${updated_row['net_price_average']:10,.2f}  {(updated_row['net_price_average'] - old_avg):+10,.2f}")
    
    # Update bracket prices (maintaining their discount rates)
    brackets = [
        ('$0-30,000', 'net_price_bracket0'),
        ('$30,001-48,000', 'net_price_bracket1'),
        ('$48,001-75,000', 'net_price_bracket2'),
        ('$75,001-110,000', 'net_price_bracket3'),
        ('$110,001+', 'net_price_bracket4')
    ]
    
    for bracket_name, bracket_key in brackets:
        old_price = current_row[bracket_key]
        discount_rate = old_price / old_sticker_in
        new_price = new_sticker_price * discount_rate
        updated_row[bracket_key] = new_price
        print(f"  {bracket_name:20} ${old_price:10,.2f} → ${new_price:10,.2f}  {(new_price - old_price):+10,.2f}")
    
    # Note: min/max values stay the same as they represent the historical range of discounts
    print("\n📝 Note: min/max discount values remain unchanged (historical bounds)")
    
    # Generate SQL update statement
    print("\n" + "=" * 80)
    print("📝 DATABASE UPDATE SQL")
    print("=" * 80)
    
    sql_update = f"""
UPDATE your_table_name
SET 
    sticker_price_in_state = {updated_row['sticker_price_in_state']:.2f},
    sticker_price_out_state = {updated_row['sticker_price_out_state']:.2f},
    net_price_average = {updated_row['net_price_average']:.2f},
    net_price_bracket0 = {updated_row['net_price_bracket0']:.2f},
    net_price_bracket1 = {updated_row['net_price_bracket1']:.2f},
    net_price_bracket2 = {updated_row['net_price_bracket2']:.2f},
    net_price_bracket3 = {updated_row['net_price_bracket3']:.2f},
    net_price_bracket4 = {updated_row['net_price_bracket4']:.2f}
WHERE 
    db_id = {current_row['db_id']};
"""
    print(sql_update)
    
    # Generate JSON update
    print("\n" + "=" * 80)
    print("📝 JSON UPDATE VALUES")
    print("=" * 80)
    print("\nUpdated row as JSON:\n")
    print(json.dumps(updated_row, indent=2))
    
    # Summary comparison
    print("\n" + "=" * 80)
    print("📊 SUMMARY")
    print("=" * 80)
    
    print(f"\nSchool {current_row['school_id']} - Year {current_row['year']}:")
    print(f"  Sticker Price: ${old_sticker_in:,.2f} → ${new_sticker_price:,.2f}")
    print(f"  Average Net:   ${old_avg:,.2f} → ${updated_row['net_price_average']:,.2f}")
    print(f"  Discount Rate: {avg_discount:.1%} (maintained)")
    
    return updated_row


# ============================================================================
# YOUR CURRENT DATA
# ============================================================================

CURRENT_ROW = {
    "db_id": 19531,
    "school_id": "191533",
    "year": "25-26",
    "start_year": 2025,
    "sticker_price_in_state": 72816.65917425064,
    "sticker_price_out_state": 72816.65917425064,
    "sticker_price_type": "on-campus",
    "net_price_average": 29261.087039199454,
    "net_price_average_min": 0.3457827,
    "net_price_average_max": 0.4836564,
    "net_price_bracket0": 29059.23376519498,
    "net_price_bracket0_min": 0.30887654,
    "net_price_bracket0_max": 0.399074,
    "net_price_bracket1": 32470.008546481335,
    "net_price_bracket1_min": 0.32643795,
    "net_price_bracket1_max": 0.44591457,
    "net_price_bracket2": 33213.04681457347,
    "net_price_bracket2_min": 0.34627676,
    "net_price_bracket2_max": 0.4768701,
    "net_price_bracket3": 34474.35700240681,
    "net_price_bracket3_min": 0.34181476,
    "net_price_bracket3_max": 0.5187377,
    "net_price_bracket4": 32746.056537417182,
    "net_price_bracket4_min": 0.3849561,
    "net_price_bracket4_max": 0.5663287
}

# ============================================================================
# CONFIGURATION - Your specific update
# ============================================================================

NEW_STICKER_PRICE = 40220  # New tuition for both in-state and out-of-state

# ============================================================================
# RUN THE CALCULATION
# ============================================================================

if __name__ == "__main__":
    try:
        updated_row = calculate_tuition_changes(
            current_row=CURRENT_ROW,
            new_sticker_price=NEW_STICKER_PRICE,
            new_out_state_price=NEW_STICKER_PRICE  # Same as in-state per your requirement
        )
        
        print("\n✅ Calculation complete!")
        print("Use the SQL statement or JSON values above to update your database.")
        
        # Optionally save to file
        save_to_file = input("\nSave output to file? (y/n): ").lower().strip() == 'y'
        if save_to_file:
            filename = f"tuition_update_school_{CURRENT_ROW['school_id']}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
            output = {
                "original": CURRENT_ROW,
                "updated": updated_row,
                "changes": {
                    "sticker_price_change": NEW_STICKER_PRICE - CURRENT_ROW['sticker_price_in_state'],
                    "sticker_price_change_pct": ((NEW_STICKER_PRICE / CURRENT_ROW['sticker_price_in_state']) - 1) * 100,
                    "net_price_average_change": updated_row['net_price_average'] - CURRENT_ROW['net_price_average']
                }
            }
            with open(filename, 'w') as f:
                json.dump(output, f, indent=2)
            print(f"Output saved to {filename}")
        
    except Exception as error:
        print(f"\n❌ Error: {error}")
        import traceback
        traceback.print_exc()