<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCampaignRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'min:10', 'max:20'],
            'spend' => ['sometimes', 'numeric', 'min:0'],
            'revenue' => ['sometimes', 'numeric', 'min:0'],
            'conversions' => ['sometimes', 'integer', 'min:0'],
            'platform_id' => ['sometimes', 'integer', 'exists:platforms,id'],
            'user_id' => ['sometimes', 'integer', 'exists:users,id'],
        ];
    }
}
